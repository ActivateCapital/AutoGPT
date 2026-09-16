# Install — 60 seconds

The pack is five folders in `skills/`, each containing a `SKILL.md` (plus reference
files). Installing means copying folders — that's all.

## Claude Code (CLI, desktop, or web)

**Personal (all your projects):**

```bash
cp -r skills/* ~/.claude/skills/
```

**Per-project (shared with your team via git):**

```bash
cp -r skills/* your-repo/.claude/skills/
```

Start a new session. The skills auto-trigger when relevant ("qualify these leads",
"triage my inbox", "repurpose this post", "here's the meeting transcript", "weekly
review") — or invoke directly: `/creai-lead-qualifier`.

## Cursor / Copilot / Codex CLI / other SKILL.md-compatible agents

Same folders, different directory — check your agent's docs for its skills path
(commonly `.cursor/skills/`, `.github/skills/`, or a skills setting). The SKILL.md
format is portable by design.

## Claude.ai (web, no coding tool)

Settings → Capabilities → Skills → upload each skill folder as a zip. (Availability
depends on your plan.)

## First-run customization (5 minutes, once)

Three skills read an editable reference file — replace the examples with your reality:

- `creai-lead-qualifier/references/rubric.md` — your ideal customer + deal-breakers
- `creai-inbox-triage/references/your-context.md` — what's urgent, who you delegate to, how you sign off
- `creai-content-repurposer/references/voice-profile.md` — how you sound

Skip this and the skills still work — they'll ask you the key questions in-chat
instead, and you can paste answers once per session.

## Uninstall

Delete the folders. No registries, no daemons, nothing else was touched.
