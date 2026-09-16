"""Structural validation for the Agent Skills Pack. No network needed.

Checks every skill against the SKILL.md contract: frontmatter shape, naming rules,
description quality, and that referenced files actually ship.
"""

import re
from pathlib import Path

import pytest

PACK_ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = PACK_ROOT / "skills"
EXPECTED_SKILLS = {
    "creai-lead-qualifier",
    "creai-inbox-triage",
    "creai-content-repurposer",
    "creai-meeting-actions",
    "creai-weekly-review",
}

FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n", re.S)


def parse_frontmatter(text: str) -> dict:
    match = FRONTMATTER_RE.match(text)
    assert match, "SKILL.md must start with a --- frontmatter block"
    fields = {}
    current_key = None
    for line in match.group(1).splitlines():
        key_match = re.match(r"^([a-zA-Z_-]+):\s*(.*)$", line)
        if key_match:
            current_key = key_match.group(1)
            fields[current_key] = key_match.group(2).strip()
        elif current_key and line.startswith(" "):
            fields[current_key] += " " + line.strip()
    return fields


def skill_dirs():
    return sorted(p for p in SKILLS_DIR.iterdir() if p.is_dir())


def test_pack_contains_exactly_the_advertised_skills():
    assert {p.name for p in skill_dirs()} == EXPECTED_SKILLS


@pytest.mark.parametrize("skill_dir", skill_dirs(), ids=lambda p: p.name)
def test_skill_md_frontmatter(skill_dir):
    skill_md = skill_dir / "SKILL.md"
    assert skill_md.exists(), f"{skill_dir.name} is missing SKILL.md"
    fields = parse_frontmatter(skill_md.read_text(encoding="utf-8"))

    assert set(fields) >= {"name", "description"}
    # name: lowercase, hyphens, <=64 chars, matches its directory
    assert fields["name"] == skill_dir.name
    assert re.fullmatch(r"[a-z0-9-]{1,64}", fields["name"])
    # description: substantial, trigger-rich, within the 1024-char limit
    desc = fields["description"]
    assert 50 <= len(desc) <= 1024
    assert "use when" in desc.lower(), "description should tell the agent when to trigger"


@pytest.mark.parametrize("skill_dir", skill_dirs(), ids=lambda p: p.name)
def test_referenced_files_ship(skill_dir):
    body = (skill_dir / "SKILL.md").read_text(encoding="utf-8")
    for ref in re.findall(r"`references/([\w./-]+)`", body):
        assert (skill_dir / "references" / ref).exists(), (
            f"{skill_dir.name}/SKILL.md points at references/{ref} which does not ship"
        )


@pytest.mark.parametrize("skill_dir", skill_dirs(), ids=lambda p: p.name)
def test_editable_references_carry_example_marker(skill_dir):
    """Every shipped editable reference must be marked EXAMPLE so skills can detect
    an uncustomized install (SKILL.md workflows key off that marker)."""
    refs = skill_dir / "references"
    if not refs.exists():
        return
    for ref_file in refs.glob("*.md"):
        if "template" in ref_file.name or ref_file.name in {"rubric.md", "your-context.md", "voice-profile.md"}:
            assert "EXAMPLE" in ref_file.read_text(encoding="utf-8"), (
                f"{ref_file} must contain the EXAMPLE marker"
            )


def test_docs_ship():
    assert (PACK_ROOT / "README.md").exists()
    assert (PACK_ROOT / "INSTALL.md").exists()
    readme = (PACK_ROOT / "README.md").read_text(encoding="utf-8")
    for skill in EXPECTED_SKILLS:
        assert skill in readme, f"README must list {skill}"
