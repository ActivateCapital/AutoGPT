"""Tests for the Content Repurposer CLI. No API key or network needed."""

import argparse
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
import repurpose  # noqa: E402
from repurpose import RepurposedContent, check_tweets  # noqa: E402

KIT_ROOT = Path(__file__).resolve().parent.parent


def canned(thread=None):
    return RepurposedContent(
        x_thread=thread or ["We cut onboarding from 14 days to 3. By deleting features.", "Here's the actual number: 61% week-one activation."],
        linkedin_post="We built more tooltips. Onboarding got slower.\n\nWhat finally worked was subtraction.",
        newsletter_section="This week: why your onboarding needs fewer rooms, not a map.",
        youtube_description="How we cut onboarding time 78% by hiding features.\n00:00 The 14-day problem",
    )


class StubMessages:
    def __init__(self, content):
        self.content = content
        self.calls = []

    def parse(self, **kwargs):
        self.calls.append(kwargs)
        return SimpleNamespace(parsed_output=self.content)


def make_args(tmp_path, **overrides):
    defaults = dict(
        input=str(KIT_ROOT / "examples" / "sample-post.md"),
        output=str(tmp_path / "drafts"),
        model="claude-opus-5",
        channels="",
        prompts_dir=None,
    )
    defaults.update(overrides)
    return argparse.Namespace(**defaults)


def test_check_tweets_flags_only_over_limit():
    ok = "x" * 280
    over = "y" * 281
    warnings = check_tweets([ok, over])
    assert len(warnings) == 1 and "Tweet 2" in warnings[0]


def test_run_writes_all_channels(tmp_path, monkeypatch):
    stub = SimpleNamespace(messages=StubMessages(canned()))
    monkeypatch.setattr(repurpose.anthropic, "Anthropic", lambda: stub)

    assert repurpose.run(make_args(tmp_path)) == 0

    out = tmp_path / "drafts"
    names = {p.name for p in out.iterdir()}
    assert names == {"x-thread.md", "linkedin.md", "newsletter.md", "youtube-description.md", "all-drafts.md"}

    thread = (out / "x-thread.md").read_text(encoding="utf-8")
    assert "**1/2**" in thread and "deleting features" in thread

    combined = (out / "all-drafts.md").read_text(encoding="utf-8")
    assert "LinkedIn post" in combined and "Newsletter section" in combined

    # System prompt bundles all three prompt files and is cache-marked
    system = stub.messages.calls[0]["system"]
    text = system[0]["text"]
    assert "channel-native content editor" in text
    assert "Voice profile" in text and "Channel guides" in text
    assert system[0]["cache_control"] == {"type": "ephemeral"}


def test_run_channel_subset(tmp_path, monkeypatch):
    stub = SimpleNamespace(messages=StubMessages(canned()))
    monkeypatch.setattr(repurpose.anthropic, "Anthropic", lambda: stub)

    assert repurpose.run(make_args(tmp_path, channels="x,newsletter")) == 0
    names = {p.name for p in (tmp_path / "drafts").iterdir()}
    assert names == {"x-thread.md", "newsletter.md", "all-drafts.md"}


def test_run_rejects_unknown_channel(tmp_path, monkeypatch):
    monkeypatch.setattr(repurpose.anthropic, "Anthropic", lambda: SimpleNamespace(messages=StubMessages(canned())))
    assert repurpose.run(make_args(tmp_path, channels="x,tiktok")) == 2


def test_run_flags_long_tweets_with_exit_code(tmp_path, monkeypatch):
    long_thread = ["short and fine", "z" * 300]
    stub = SimpleNamespace(messages=StubMessages(canned(thread=long_thread)))
    monkeypatch.setattr(repurpose.anthropic, "Anthropic", lambda: stub)

    assert repurpose.run(make_args(tmp_path)) == 1  # drafts written, warning exit
    assert (tmp_path / "drafts" / "x-thread.md").exists()


def test_run_missing_input(tmp_path, monkeypatch):
    monkeypatch.setattr(repurpose.anthropic, "Anthropic", lambda: SimpleNamespace(messages=StubMessages(canned())))
    assert repurpose.run(make_args(tmp_path, input=str(tmp_path / "nope.md"))) == 2
