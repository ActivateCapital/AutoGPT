#!/usr/bin/env python3
"""Content Repurposer — one piece of long-form content, four channel-native drafts.

Usage:
    python src/repurpose.py post.md -o drafts/
    python src/repurpose.py transcript.txt -o drafts/ --channels x,linkedin

Input: a markdown or plain-text file (blog post, transcript, talk notes).
Output: x-thread.md, linkedin.md, newsletter.md, youtube-description.md, and
all-drafts.md in the output directory. Tweets over 280 characters are flagged.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import List

import anthropic
from pydantic import BaseModel

DEFAULT_MODEL = "claude-opus-5"
KIT_ROOT = Path(__file__).resolve().parent.parent
ALL_CHANNELS = ["x", "linkedin", "newsletter", "youtube"]
TWEET_LIMIT = 280
MAX_SOURCE_CHARS = 60_000


class RepurposedContent(BaseModel):
    x_thread: List[str]
    linkedin_post: str
    newsletter_section: str
    youtube_description: str


def load_prompts(prompts_dir: Path) -> str:
    parts = [
        (prompts_dir / "system-prompt.md").read_text(encoding="utf-8"),
        (prompts_dir / "voice-profile.md").read_text(encoding="utf-8"),
        (prompts_dir / "channel-guides.md").read_text(encoding="utf-8"),
    ]
    return "\n\n---\n\n".join(parts)


def repurpose(client: anthropic.Anthropic, system: str, source: str, model: str) -> RepurposedContent:
    response = client.messages.parse(
        model=model,
        max_tokens=16000,
        system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": f"Repurpose this piece for all four channels:\n\n{source}"}],
        output_format=RepurposedContent,
    )
    return response.parsed_output


def check_tweets(thread: List[str]) -> list[str]:
    return [
        f"Tweet {i} is {len(tweet)} chars (limit {TWEET_LIMIT}) — trim before posting."
        for i, tweet in enumerate(thread, 1)
        if len(tweet) > TWEET_LIMIT
    ]


def render_x_thread(thread: List[str]) -> str:
    lines = ["# X thread", ""]
    for i, tweet in enumerate(thread, 1):
        lines += [f"**{i}/{len(thread)}** ({len(tweet)} chars)", "", tweet, ""]
    return "\n".join(lines)


def write_outputs(out_dir: Path, content: RepurposedContent, channels: list[str]) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    files = {
        "x": ("x-thread.md", render_x_thread(content.x_thread)),
        "linkedin": ("linkedin.md", f"# LinkedIn post\n\n{content.linkedin_post}\n"),
        "newsletter": ("newsletter.md", f"# Newsletter section\n\n{content.newsletter_section}\n"),
        "youtube": ("youtube-description.md", f"# YouTube description\n\n{content.youtube_description}\n"),
    }
    written = []
    combined = ["# All drafts", ""]
    for channel in channels:
        name, text = files[channel]
        path = out_dir / name
        path.write_text(text, encoding="utf-8")
        written.append(path)
        combined += [text, "", "---", ""]
    all_path = out_dir / "all-drafts.md"
    all_path.write_text("\n".join(combined), encoding="utf-8")
    written.append(all_path)
    return written


def run(args: argparse.Namespace) -> int:
    channels = [c.strip() for c in args.channels.split(",")] if args.channels else ALL_CHANNELS
    unknown = [c for c in channels if c not in ALL_CHANNELS]
    if unknown:
        print(f"Unknown channel(s): {', '.join(unknown)}. Valid: {', '.join(ALL_CHANNELS)}", file=sys.stderr)
        return 2

    prompts_dir = Path(args.prompts_dir) if args.prompts_dir else KIT_ROOT / "prompts"
    try:
        system = load_prompts(prompts_dir)
    except FileNotFoundError as exc:
        print(f"Prompt file missing: {exc}", file=sys.stderr)
        return 2

    source_path = Path(args.input)
    try:
        source = source_path.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        print(f"Input file not found: {source_path}", file=sys.stderr)
        return 2
    if not source:
        print("Input file is empty.", file=sys.stderr)
        return 2
    if len(source) > MAX_SOURCE_CHARS:
        print(
            f"Input is {len(source):,} chars; using the first {MAX_SOURCE_CHARS:,}. "
            "Split very long transcripts into parts for best results.",
            file=sys.stderr,
        )
        source = source[:MAX_SOURCE_CHARS]

    client = anthropic.Anthropic()
    try:
        content = repurpose(client, system, source, args.model)
    except anthropic.AuthenticationError:
        print("Invalid or missing ANTHROPIC_API_KEY — aborting.", file=sys.stderr)
        return 2
    except anthropic.RateLimitError:
        print("Rate limited even after SDK retries — wait a minute and rerun.", file=sys.stderr)
        return 1
    except anthropic.APIStatusError as exc:
        print(f"API error {exc.status_code}: {exc.message}", file=sys.stderr)
        return 1
    except anthropic.APIConnectionError:
        print("Network error — check your connection and rerun.", file=sys.stderr)
        return 1

    written = write_outputs(Path(args.output), content, channels)
    for path in written:
        print(f"wrote {path}")

    warnings = check_tweets(content.x_thread) if "x" in channels else []
    for warning in warnings:
        print(f"⚠ {warning}", file=sys.stderr)

    print(f"\nDone: {len(written)} files in {args.output}/")
    return 0 if not warnings else 1


def main() -> None:
    parser = argparse.ArgumentParser(description="Repurpose long-form content into channel-native drafts.")
    parser.add_argument("input", help="markdown or text file (post, transcript, notes)")
    parser.add_argument("-o", "--output", default="drafts", help="output directory (default: drafts/)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Claude model ID (default: {DEFAULT_MODEL})")
    parser.add_argument("--channels", default="", help=f"comma-separated subset of: {','.join(ALL_CHANNELS)}")
    parser.add_argument("--prompts-dir", default=None, help="override the prompts directory")
    sys.exit(run(parser.parse_args()))


if __name__ == "__main__":
    main()
