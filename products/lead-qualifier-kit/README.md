# Lead Qualifier Agent Kit

Score, rank, and route every inbound lead with a Claude-powered agent you run yourself.

**What it does:** you feed it a CSV of leads (any columns — name, company, message,
source, whatever you capture). It scores each lead 0–100 against a rubric you control,
assigns a tier (hot / warm / cold), writes the reasons in plain English, flags
disqualifiers, and suggests a concrete next step. Out comes the same CSV, ranked, with
your best leads on top.

## What's in the box

```
lead-qualifier-kit/
├── README.md                 ← you are here
├── SETUP.md                  ← 15-minute setup guide
├── prompts/
│   ├── system-prompt.md      ← the agent's operating instructions
│   └── scoring-rubric.md     ← EDIT THIS: your ICP, in plain English
├── src/
│   └── lead_qualifier.py     ← the CLI (Python 3.10+)
├── recipes/
│   └── no-code-recipe.md     ← run it without Python (Zapier / webhook)
├── examples/
│   └── leads.csv             ← sample input to try immediately
├── tests/
│   └── test_lead_qualifier.py
└── requirements.txt
```

## Quick start

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # from console.anthropic.com

python src/lead_qualifier.py examples/leads.csv -o scored.csv
```

Open `scored.csv`: every lead now has `score`, `tier`, `reasons`, `disqualifiers`, and
`next_step` columns, sorted best-first.

## Make it yours

The entire point of this kit is `prompts/scoring-rubric.md`. Describe your ideal
customer, your deal-breakers, and what "hot" means for your business — in plain English.
The agent applies *your* rubric, not a generic one. See SETUP.md for worked examples.

## Requirements & costs

- Python 3.10+ and an Anthropic API key (`https://console.anthropic.com`).
- API usage is billed by Anthropic to you. A typical lead (a few hundred words of
  context) costs on the order of a cent or two to score with the default model; use
  `--model claude-haiku-4-5` to cut cost further on high volumes.

## Support

14-day money-back guarantee. Questions: reply to your purchase receipt email.
