# Inbox Triage Agent Kit

Turn a 200-email inbox into a 20-minute review. Classify, prioritize, and pre-draft
replies for everything that lands.

**What it does:** you feed it exported email (`.eml` files or a Gmail/Thunderbird
`.mbox` export). It sorts every message into an action category — act now, respond
today, delegate, FYI, archive — with a priority, a one-line summary, and a drafted
reply for anything that needs one. Out comes a single triage report you can work top
to bottom, plus ready-to-edit reply drafts.

Nothing connects to your live inbox unless you choose the optional Gmail recipe — the
core kit works entirely on exported files, so there are no OAuth grants or inbox
permissions to worry about on day one.

## What's in the box

```
inbox-triage-kit/
├── README.md                 ← you are here
├── SETUP.md                  ← 15-minute setup guide
├── prompts/
│   ├── system-prompt.md      ← the agent's triage instructions
│   └── your-context.md       ← EDIT THIS: who you are, what matters, how you reply
├── src/
│   └── inbox_triage.py       ← the CLI (Python 3.10+)
├── recipes/
│   └── gmail-recipe.md       ← auto-label live Gmail (optional, no Python)
├── examples/                 ← sample .eml files to try immediately
├── tests/
│   └── test_inbox_triage.py
└── requirements.txt
```

## Quick start

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # from console.anthropic.com

python src/inbox_triage.py examples/ -o triage/
```

Open `triage/triage-report.md`: every email categorized and prioritized, urgent items on
top. Reply drafts are in `triage/replies/`.

## Make it yours

Edit `prompts/your-context.md` — tell the agent who you are, what counts as urgent in
your world, who you delegate to, and how you sign off. The drafts start sounding like
you instead of like a bot.

## Requirements & costs

- Python 3.10+ and an Anthropic API key. A typical email costs on the order of a cent
  to triage with the default model; `--model claude-haiku-4-5` cuts that ~5x.

## Support

14-day money-back guarantee. Questions: reply to your purchase receipt email.
