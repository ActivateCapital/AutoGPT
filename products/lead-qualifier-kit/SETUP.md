# Setup — 15 minutes to your first scored lead list

## 1. Get a Claude API key (5 min)

1. Go to https://console.anthropic.com and sign up (or sign in).
2. Add a payment method under **Billing** (usage-based; scoring a lead costs on the
   order of a cent or two with the default model).
3. Create a key under **API Keys** and copy it.

## 2. Install and smoke-test (5 min)

```bash
cd lead-qualifier-kit
pip install -r requirements.txt

# macOS / Linux
export ANTHROPIC_API_KEY=sk-ant-...
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-..."

python src/lead_qualifier.py examples/leads.csv -o scored.csv
```

Open `scored.csv`. You should see Dana and Priya near the top with written reasons, the
spam and student rows at the bottom with disqualifiers. That's the agent working with the
*example* rubric — now point it at your business.

## 3. Write your rubric (5 min, highest-leverage step)

Open `prompts/scoring-rubric.md` and replace the example with your reality:

- **Our business** — what you sell, price point, who buys it.
- **Ideal customer** — the signals that make a lead great, as bullet points.
- **Deal-breakers** — what makes a lead worthless no matter what.
- **Gray areas** — where you want measured judgment, tell it how to lean.

Rules of thumb: concrete beats abstract ("50–1,000 employees" beats "mid-size");
name real titles; put anything that has actually wasted your sales team's time in
deal-breakers.

## 4. Run it on your real leads

Export leads to CSV from your CRM or form tool — any columns work; the agent reads them
all. Then:

```bash
python src/lead_qualifier.py my-leads.csv -o my-leads-scored.csv
```

Useful flags:

- `--limit 10` — trial run on the first 10 rows before a big batch
- `--model claude-haiku-4-5` — ~5x cheaper per lead for high volume (slightly less nuanced)
- `--prompts-dir path/` — keep separate rubrics per product line or region

## 5. (Optional) Wire it into your CRM

See `recipes/no-code-recipe.md` to score leads automatically as they arrive, with no
Python involved.

## Troubleshooting

- **`AuthenticationError`** — the key isn't set in this terminal session, or was revoked.
- **Rows marked `rate limited`** — you hit your API tier's requests-per-minute cap; rerun
  the same command, already-scored rows are cheap to re-score, or upgrade your tier.
- **Scores feel wrong** — 95% of the time the fix is a sharper rubric. Add the lead that
  was misjudged to the rubric as an explicit example of what you do or don't want.
