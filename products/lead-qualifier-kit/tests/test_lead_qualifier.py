"""Tests for the Lead Qualifier CLI. No API key or network needed."""

import argparse
import csv
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
import lead_qualifier  # noqa: E402
from lead_qualifier import LeadScore, format_lead  # noqa: E402

KIT_ROOT = Path(__file__).resolve().parent.parent


class StubMessages:
    """Stands in for client.messages; returns canned scores keyed by lead email."""

    def __init__(self, scores):
        self.scores = scores
        self.calls = []

    def parse(self, **kwargs):
        self.calls.append(kwargs)
        user_content = kwargs["messages"][0]["content"]
        for email, score in self.scores.items():
            if email in user_content:
                return SimpleNamespace(parsed_output=score)
        raise AssertionError(f"no stub score matches request: {user_content[:120]}")


def make_stub_client(scores):
    return SimpleNamespace(messages=StubMessages(scores))


def write_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def hot(score):
    return LeadScore(score=score, tier="hot", reasons=["strong fit"], disqualifiers=[], next_step="call today")


def cold(score):
    return LeadScore(score=score, tier="cold", reasons=["spam"], disqualifiers=["vendor pitch"], next_step="ignore")


def test_format_lead_includes_all_nonempty_fields():
    text = format_lead({"name": "Dana", "email": "d@x.io", "notes": "", "score": "99"})
    assert "name: Dana" in text and "email: d@x.io" in text
    assert "notes" not in text  # empty values dropped
    assert "score" not in text  # prior output columns never shown to the model


def test_run_scores_sorts_and_writes(tmp_path, monkeypatch, capsys):
    input_csv = tmp_path / "leads.csv"
    write_csv(
        input_csv,
        [
            {"name": "Spam", "email": "spam@x.biz", "message": "buy leads"},
            {"name": "Dana", "email": "dana@brightops.io", "message": "demo please"},
        ],
        ["name", "email", "message"],
    )
    stub = make_stub_client({"spam@x.biz": cold(10), "dana@brightops.io": hot(92)})
    monkeypatch.setattr(lead_qualifier.anthropic, "Anthropic", lambda: stub)

    out = tmp_path / "scored.csv"
    args = argparse.Namespace(
        input_csv=str(input_csv), output=str(out), model="claude-opus-5", limit=0, prompts_dir=None
    )
    assert lead_qualifier.run(args) == 0

    rows = list(csv.DictReader(open(out, encoding="utf-8")))
    assert [r["name"] for r in rows] == ["Dana", "Spam"]  # sorted best-first
    assert rows[0]["score"] == "92" and rows[0]["tier"] == "hot"
    assert rows[1]["disqualifiers"] == "vendor pitch"

    # System prompt must carry both prompt files and be cached.
    system = stub.messages.calls[0]["system"]
    assert "senior sales-development analyst" in system[0]["text"]
    assert "Scoring rubric" in system[0]["text"]
    assert system[0]["cache_control"] == {"type": "ephemeral"}


def test_run_survives_api_failure_on_one_row(tmp_path, monkeypatch):
    import httpx2

    input_csv = tmp_path / "leads.csv"
    write_csv(
        input_csv,
        [
            {"name": "Bad", "email": "bad@x.io", "message": "boom"},
            {"name": "Good", "email": "good@x.io", "message": "hi"},
        ],
        ["name", "email", "message"],
    )

    stub = make_stub_client({"good@x.io": hot(80)})
    original_parse = stub.messages.parse

    def flaky_parse(**kwargs):
        if "bad@x.io" in kwargs["messages"][0]["content"]:
            raise lead_qualifier.anthropic.APIConnectionError(
                request=httpx2.Request("POST", "https://api.anthropic.com/v1/messages")
            )
        return original_parse(**kwargs)

    stub.messages.parse = flaky_parse
    monkeypatch.setattr(lead_qualifier.anthropic, "Anthropic", lambda: stub)

    out = tmp_path / "scored.csv"
    args = argparse.Namespace(
        input_csv=str(input_csv), output=str(out), model="claude-opus-5", limit=0, prompts_dir=None
    )
    assert lead_qualifier.run(args) == 1  # partial failure exit code

    rows = list(csv.DictReader(open(out, encoding="utf-8")))
    assert [r["name"] for r in rows] == ["Good", "Bad"]  # failed rows sink to the bottom
    assert rows[1]["error"] == "network error" and rows[1]["score"] == ""


def test_limit_flag(tmp_path, monkeypatch):
    input_csv = tmp_path / "leads.csv"
    write_csv(
        input_csv,
        [{"name": f"L{i}", "email": f"l{i}@x.io", "message": "m"} for i in range(5)],
        ["name", "email", "message"],
    )
    stub = make_stub_client({f"l{i}@x.io": hot(50 + i) for i in range(5)})
    monkeypatch.setattr(lead_qualifier.anthropic, "Anthropic", lambda: stub)

    out = tmp_path / "scored.csv"
    args = argparse.Namespace(
        input_csv=str(input_csv), output=str(out), model="claude-opus-5", limit=2, prompts_dir=None
    )
    assert lead_qualifier.run(args) == 0
    assert len(stub.messages.calls) == 2


def test_example_csv_ships_and_parses():
    rows = list(csv.DictReader(open(KIT_ROOT / "examples" / "leads.csv", encoding="utf-8")))
    assert len(rows) >= 5
    assert {"name", "email", "message"} <= set(rows[0].keys())
