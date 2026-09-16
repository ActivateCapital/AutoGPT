#!/usr/bin/env python3
"""Inbox Triage Agent — classify, prioritize, and pre-draft replies with Claude.

Usage:
    python src/inbox_triage.py exported-mail/ -o triage/
    python src/inbox_triage.py inbox.mbox -o triage/ --model claude-haiku-4-5

Input: a directory of .eml files, or a single .mbox file (Gmail Takeout, Thunderbird).
Output: <out>/triage-report.md grouped by category and priority, and
<out>/replies/NNN-<slug>.txt for every email that needs a reply.
"""

from __future__ import annotations

import argparse
import email
import email.policy
import mailbox
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import anthropic
from pydantic import BaseModel, Field

DEFAULT_MODEL = "claude-opus-5"
KIT_ROOT = Path(__file__).resolve().parent.parent
CATEGORY_ORDER = ["act_now", "respond_today", "delegate", "fyi", "archive"]
CATEGORY_TITLES = {
    "act_now": "🔥 Act now",
    "respond_today": "✉️ Respond today",
    "delegate": "👥 Delegate",
    "fyi": "📌 FYI — no action",
    "archive": "🗑️ Archive",
}
MAX_BODY_CHARS = 6000


class TriageResult(BaseModel):
    category: str = Field(pattern="^(act_now|respond_today|delegate|fyi|archive)$")
    priority: int = Field(ge=1, le=5)
    summary: str
    needs_reply: bool
    suggested_reply: str


@dataclass
class Email:
    source: str
    sender: str
    subject: str
    date: str
    body: str


def extract_body(msg: email.message.EmailMessage) -> str:
    body_part = msg.get_body(preferencelist=("plain", "html"))
    if body_part is None:
        return ""
    try:
        text = body_part.get_content()
    except (KeyError, LookupError, UnicodeDecodeError):
        return ""
    if body_part.get_content_type() == "text/html":
        text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", text, flags=re.S | re.I)
        text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"[ \t]+", " ", text).strip()[:MAX_BODY_CHARS]


def to_email(msg: email.message.EmailMessage, source: str) -> Email:
    return Email(
        source=source,
        sender=str(msg.get("From", "(unknown sender)")),
        subject=str(msg.get("Subject", "(no subject)")),
        date=str(msg.get("Date", "")),
        body=extract_body(msg),
    )


def load_emails(path: Path) -> list[Email]:
    emails: list[Email] = []
    if path.is_dir():
        for eml in sorted(path.glob("*.eml")):
            with open(eml, "rb") as f:
                msg = email.message_from_binary_file(f, policy=email.policy.default)
            emails.append(to_email(msg, eml.name))
    elif path.suffix == ".mbox":
        box = mailbox.mbox(str(path), factory=lambda f: email.message_from_binary_file(f, policy=email.policy.default))
        for i, msg in enumerate(box):
            emails.append(to_email(msg, f"mbox message {i + 1}"))
    else:
        raise ValueError(f"Input must be a directory of .eml files or a .mbox file, got: {path}")
    return emails


def triage_email(client: anthropic.Anthropic, system: str, context: str, mail: Email, model: str) -> TriageResult:
    user = (
        f"Triage this email:\n\n"
        f"From: {mail.sender}\nSubject: {mail.subject}\nDate: {mail.date}\n\n{mail.body or '(empty body)'}"
    )
    response = client.messages.parse(
        model=model,
        max_tokens=16000,
        system=[
            {"type": "text", "text": f"{system}\n\n---\n\n{context}", "cache_control": {"type": "ephemeral"}},
        ],
        messages=[{"role": "user", "content": user}],
        output_format=TriageResult,
    )
    return response.parsed_output


def slugify(text: str, max_len: int = 40) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug[:max_len] or "email"


def write_outputs(out_dir: Path, results: list[tuple[Email, TriageResult]]) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    replies_dir = out_dir / "replies"

    ordered = sorted(results, key=lambda pair: (CATEGORY_ORDER.index(pair[1].category), pair[1].priority))

    lines = ["# Inbox triage report", ""]
    counts = ", ".join(
        f"{sum(1 for _, r in results if r.category == c)} {c}" for c in CATEGORY_ORDER
    )
    lines += [f"{len(results)} emails triaged: {counts}", ""]

    reply_count = 0
    for category in CATEGORY_ORDER:
        group = [(m, r) for m, r in ordered if r.category == category]
        if not group:
            continue
        lines += [f"## {CATEGORY_TITLES[category]} ({len(group)})", ""]
        for mail, result in group:
            lines.append(f"- **P{result.priority} · {mail.subject}** — {mail.sender}")
            lines.append(f"  - {result.summary}")
            if result.needs_reply and result.suggested_reply:
                reply_count += 1
                reply_path = replies_dir / f"{reply_count:03d}-{slugify(mail.subject)}.txt"
                replies_dir.mkdir(parents=True, exist_ok=True)
                reply_path.write_text(
                    f"To: {mail.sender}\nSubject: Re: {mail.subject}\n\n{result.suggested_reply}\n",
                    encoding="utf-8",
                )
                lines.append(f"  - Draft reply: `replies/{reply_path.name}`")
            lines.append("")

    report_path = out_dir / "triage-report.md"
    report_path.write_text("\n".join(lines), encoding="utf-8")
    return report_path


def run(args: argparse.Namespace) -> int:
    prompts_dir = Path(args.prompts_dir) if args.prompts_dir else KIT_ROOT / "prompts"
    try:
        system = (prompts_dir / "system-prompt.md").read_text(encoding="utf-8")
        context = (prompts_dir / "your-context.md").read_text(encoding="utf-8")
    except FileNotFoundError as exc:
        print(f"Prompt file missing: {exc}", file=sys.stderr)
        return 2

    try:
        emails = load_emails(Path(args.input))
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    if args.limit:
        emails = emails[: args.limit]
    if not emails:
        print("No emails found in input.", file=sys.stderr)
        return 2

    client = anthropic.Anthropic()
    results: list[tuple[Email, TriageResult]] = []
    failures = 0
    for i, mail in enumerate(emails, 1):
        try:
            result = triage_email(client, system, context, mail, args.model)
            results.append((mail, result))
            print(f"[{i}/{len(emails)}] {mail.subject[:60]}: {result.category} (P{result.priority})")
        except anthropic.AuthenticationError:
            print("Invalid or missing ANTHROPIC_API_KEY — aborting.", file=sys.stderr)
            return 2
        except (anthropic.APIStatusError, anthropic.APIConnectionError) as exc:
            failures += 1
            print(f"[{i}/{len(emails)}] {mail.subject[:60]}: failed ({type(exc).__name__}), skipped", file=sys.stderr)

    if not results:
        print("Every email failed to triage — check your API key and network.", file=sys.stderr)
        return 2

    report_path = write_outputs(Path(args.output), results)
    print(f"\nDone: {len(results)}/{len(emails)} emails triaged → {report_path}")
    return 0 if failures == 0 else 1


def main() -> None:
    parser = argparse.ArgumentParser(description="Triage exported email with Claude.")
    parser.add_argument("input", help="directory of .eml files, or a .mbox file")
    parser.add_argument("-o", "--output", default="triage", help="output directory (default: triage/)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Claude model ID (default: {DEFAULT_MODEL})")
    parser.add_argument("--limit", type=int, default=0, help="triage only the first N emails")
    parser.add_argument("--prompts-dir", default=None, help="override the prompts directory")
    sys.exit(run(parser.parse_args()))


if __name__ == "__main__":
    main()
