# Setup — 15 minutes to your first triaged inbox

## 1. Get a Claude API key (5 min)

1. Go to https://console.anthropic.com and sign up (or sign in).
2. Add a payment method under **Billing** (usage-based; triaging an email costs on the
   order of a cent with the default model).
3. Create a key under **API Keys** and copy it.

## 2. Install and smoke-test (5 min)

```bash
cd inbox-triage-kit
pip install -r requirements.txt

# macOS / Linux
export ANTHROPIC_API_KEY=sk-ant-...
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-..."

python src/inbox_triage.py examples/ -o triage/
```

Open `triage/triage-report.md`. The customer outage should be at the top as act_now, the
"URGENT growth hacks" newsletter at the bottom as archive (screaming subject lines don't
fool it), and drafts for the emails that deserve replies in `triage/replies/`.

## 3. Write your context (5 min, highest-leverage step)

Open `prompts/your-context.md` and replace the example: who you are, what genuinely
counts as urgent for you, who you delegate what to, and your reply style with your real
sign-off. This single file is what turns generic triage into *your* triage.

## 4. Run it on your real email

Export mail without granting anyone inbox access:

- **Gmail**: select messages → ⋮ → "Download message" for a few, or Google Takeout →
  Mail for a full `.mbox`.
- **Outlook / Apple Mail / Thunderbird**: drag messages to a folder to get `.eml` files.

```bash
python src/inbox_triage.py ~/Downloads/inbox-export/ -o triage/
python src/inbox_triage.py takeout.mbox -o triage/ --limit 50
```

Useful flags: `--limit N` (trial run), `--model claude-haiku-4-5` (~5x cheaper per
email), `--prompts-dir` (separate contexts for separate inboxes).

## 5. (Optional) Auto-label live Gmail

When you trust the categories, `recipes/gmail-recipe.md` shows how to label incoming
mail automatically. It's optional by design — the exported-file workflow keeps your
credentials entirely out of the loop.

## Troubleshooting

- **`AuthenticationError`** — key not set in this terminal, or revoked.
- **A category call you disagree with** — add the case to `your-context.md` explicitly
  ("emails from my accountant are never archive"). The agent follows your file.
- **Reply drafts have [FILL IN: ...] markers** — that's intentional: the agent refuses
  to invent facts it doesn't have. Fill them before sending.
