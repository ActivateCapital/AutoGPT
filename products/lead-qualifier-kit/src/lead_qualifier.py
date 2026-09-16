#!/usr/bin/env python3
"""Lead Qualifier Agent — score and rank inbound leads with Claude.

Usage:
    python src/lead_qualifier.py leads.csv -o scored.csv
    python src/lead_qualifier.py leads.csv --model claude-haiku-4-5 --limit 20

Input: any CSV with a header row. Every column is shown to the agent.
Output: the same rows plus score/tier/reasons/disqualifiers/next_step columns,
sorted best-first. Rows that fail to score are kept, marked in the `error` column.
"""

from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path
from typing import List

import anthropic
from pydantic import BaseModel, Field

DEFAULT_MODEL = "claude-opus-5"
KIT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_COLUMNS = ["score", "tier", "reasons", "disqualifiers", "next_step", "error"]


class LeadScore(BaseModel):
    score: int = Field(ge=0, le=100)
    tier: str = Field(pattern="^(hot|warm|cold)$")
    reasons: List[str]
    disqualifiers: List[str]
    next_step: str


def load_prompts(prompts_dir: Path) -> tuple[str, str]:
    system = (prompts_dir / "system-prompt.md").read_text(encoding="utf-8")
    rubric = (prompts_dir / "scoring-rubric.md").read_text(encoding="utf-8")
    return system, rubric


def format_lead(row: dict) -> str:
    lines = [f"{key}: {value}" for key, value in row.items() if value and key not in OUTPUT_COLUMNS]
    return "\n".join(lines) if lines else "(empty lead record)"


def score_lead(client: anthropic.Anthropic, system: str, rubric: str, row: dict, model: str) -> LeadScore:
    response = client.messages.parse(
        model=model,
        max_tokens=16000,
        system=[
            {"type": "text", "text": f"{system}\n\n---\n\n{rubric}", "cache_control": {"type": "ephemeral"}},
        ],
        messages=[{"role": "user", "content": f"Qualify this lead:\n\n{format_lead(row)}"}],
        output_format=LeadScore,
    )
    return response.parsed_output


def run(args: argparse.Namespace) -> int:
    prompts_dir = Path(args.prompts_dir) if args.prompts_dir else KIT_ROOT / "prompts"
    try:
        system, rubric = load_prompts(prompts_dir)
    except FileNotFoundError as exc:
        print(f"Prompt file missing: {exc}", file=sys.stderr)
        return 2

    with open(args.input_csv, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            print("Input CSV has no header row.", file=sys.stderr)
            return 2
        input_columns = [c for c in reader.fieldnames if c not in OUTPUT_COLUMNS]
        rows = list(reader)

    if args.limit:
        rows = rows[: args.limit]
    if not rows:
        print("No leads found in input.", file=sys.stderr)
        return 2

    client = anthropic.Anthropic()
    scored: list[dict] = []
    failures = 0
    for i, row in enumerate(rows, 1):
        label = row.get("email") or row.get("name") or f"row {i}"
        try:
            result = score_lead(client, system, rubric, row, args.model)
            row.update(
                score=result.score,
                tier=result.tier,
                reasons="; ".join(result.reasons),
                disqualifiers="; ".join(result.disqualifiers),
                next_step=result.next_step,
                error="",
            )
            print(f"[{i}/{len(rows)}] {label}: {result.score} ({result.tier})")
        except anthropic.AuthenticationError:
            print("Invalid or missing ANTHROPIC_API_KEY — aborting.", file=sys.stderr)
            return 2
        except anthropic.RateLimitError as exc:
            # SDK already retried with backoff; record and continue.
            failures += 1
            row.update(score="", tier="", reasons="", disqualifiers="", next_step="", error=f"rate limited: {exc.message}")
            print(f"[{i}/{len(rows)}] {label}: rate limited, skipped", file=sys.stderr)
        except anthropic.APIStatusError as exc:
            failures += 1
            row.update(score="", tier="", reasons="", disqualifiers="", next_step="", error=f"API error {exc.status_code}")
            print(f"[{i}/{len(rows)}] {label}: API error {exc.status_code}, skipped", file=sys.stderr)
        except anthropic.APIConnectionError:
            failures += 1
            row.update(score="", tier="", reasons="", disqualifiers="", next_step="", error="network error")
            print(f"[{i}/{len(rows)}] {label}: network error, skipped", file=sys.stderr)
        scored.append(row)

    scored.sort(key=lambda r: (r["score"] == "", -int(r["score"] or 0)))

    out_path = Path(args.output)
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=input_columns + OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(scored)

    ok = len(scored) - failures
    print(f"\nDone: {ok}/{len(scored)} leads scored → {out_path}")
    return 0 if failures == 0 else 1


def main() -> None:
    parser = argparse.ArgumentParser(description="Score and rank inbound leads with Claude.")
    parser.add_argument("input_csv", help="CSV of leads (any columns, header row required)")
    parser.add_argument("-o", "--output", default="scored.csv", help="output CSV path (default: scored.csv)")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Claude model ID (default: {DEFAULT_MODEL})")
    parser.add_argument("--limit", type=int, default=0, help="score only the first N leads")
    parser.add_argument("--prompts-dir", default=None, help="override the prompts directory")
    sys.exit(run(parser.parse_args()))


if __name__ == "__main__":
    main()
