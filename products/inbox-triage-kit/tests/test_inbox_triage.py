"""Tests for the Inbox Triage CLI. No API key or network needed."""

import argparse
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
import inbox_triage  # noqa: E402
from inbox_triage import TriageResult, load_emails, slugify  # noqa: E402

KIT_ROOT = Path(__file__).resolve().parent.parent
EXAMPLES = KIT_ROOT / "examples"


class StubMessages:
    """Returns canned triage results keyed by a substring of the user message."""

    def __init__(self, results):
        self.results = results
        self.calls = []

    def parse(self, **kwargs):
        self.calls.append(kwargs)
        user_content = kwargs["messages"][0]["content"]
        for needle, result in self.results.items():
            if needle in user_content:
                return SimpleNamespace(parsed_output=result)
        raise AssertionError(f"no stub result matches: {user_content[:120]}")


def result(category, priority, needs_reply=False, reply=""):
    return TriageResult(
        category=category,
        priority=priority,
        summary=f"summary for {category}",
        needs_reply=needs_reply,
        suggested_reply=reply,
    )


def test_load_emails_parses_eml_dir():
    emails = load_emails(EXAMPLES)
    assert len(emails) == 4
    outage = next(m for m in emails if "Integration down" in m.subject)
    assert "acmefreight.com" in outage.sender
    assert "401 token expired" in outage.body

    # HTML newsletter gets tags stripped and subject header decoded is fine as-is
    newsletter = next(m for m in emails if "growth hacks" in m.subject.lower())
    assert "<a href" not in newsletter.body
    assert "Register now" in newsletter.body


def test_load_emails_rejects_unknown_input(tmp_path):
    import pytest

    with pytest.raises(ValueError):
        load_emails(tmp_path / "mail.pst")


def test_slugify():
    assert slugify("Re: Invoice #2214 ($480)!") == "re-invoice-2214-480"
    assert slugify("!!!") == "email"


def test_run_end_to_end(tmp_path, monkeypatch):
    stub = SimpleNamespace(
        messages=StubMessages(
            {
                "Integration down": result("act_now", 1, needs_reply=True, reply="On it — investigating now.\n— Jordan"),
                "growth hacks": result("archive", 5),
                "invoice #2214": result("delegate", 3),
                "interview last Thursday": result("respond_today", 2, needs_reply=True, reply="Thanks Aisha — decision by Wednesday.\n— Jordan"),
            }
        )
    )
    monkeypatch.setattr(inbox_triage.anthropic, "Anthropic", lambda: stub)

    out_dir = tmp_path / "triage"
    args = argparse.Namespace(
        input=str(EXAMPLES), output=str(out_dir), model="claude-opus-5", limit=0, prompts_dir=None
    )
    assert inbox_triage.run(args) == 0

    report = (out_dir / "triage-report.md").read_text(encoding="utf-8")
    # Categories appear in urgency order
    assert report.index("Act now") < report.index("Respond today") < report.index("Delegate") < report.index("Archive")
    assert "4 emails triaged" in report

    replies = sorted((out_dir / "replies").glob("*.txt"))
    assert len(replies) == 2
    outage_reply = next(p for p in replies if "integration-down" in p.name)
    text = outage_reply.read_text(encoding="utf-8")
    assert text.startswith("To: Maria Chen")
    assert "Subject: Re: Integration down" in text

    # System prompt carries both prompt files and is cache-marked
    system = stub.messages.calls[0]["system"]
    assert "executive assistant" in system[0]["text"]
    assert "Your context" in system[0]["text"]
    assert system[0]["cache_control"] == {"type": "ephemeral"}


def test_limit_flag(tmp_path, monkeypatch):
    stub = SimpleNamespace(messages=StubMessages({"": result("fyi", 4)}))
    # Empty-string needle matches everything
    monkeypatch.setattr(inbox_triage.anthropic, "Anthropic", lambda: stub)

    args = argparse.Namespace(
        input=str(EXAMPLES), output=str(tmp_path / "t"), model="claude-opus-5", limit=2, prompts_dir=None
    )
    assert inbox_triage.run(args) == 0
    assert len(stub.messages.calls) == 2
