# Setup — 15 minutes to your first four drafts

## 1. Get a Claude API key (5 min)

1. Go to https://console.anthropic.com and sign up (or sign in).
2. Add a payment method under **Billing** (usage-based; repurposing a 1,500-word post
   costs on the order of a few cents).
3. Create a key under **API Keys** and copy it.

## 2. Install and smoke-test (5 min)

```bash
cd content-repurposer-kit
pip install -r requirements.txt

# macOS / Linux
export ANTHROPIC_API_KEY=sk-ant-...
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-..."

python src/repurpose.py examples/sample-post.md -o drafts/
```

Open `drafts/all-drafts.md`. Notice the four drafts lead with *different* ideas from the
same post — that's repurposing, not summarizing. The CLI also prints a warning if any
generated tweet exceeds 280 characters.

## 3. Write your voice profile (5 min, highest-leverage step)

Open `prompts/voice-profile.md` and replace the example. The two sections that matter
most:

- **Things I say** — paste 3–5 real phrases from your own writing.
- **Things I never say** — the words that make you cringe. The agent treats this as law.

Optionally adjust `prompts/channel-guides.md` (thread length, hashtag policy, etc.).

## 4. Run it on your real content

```bash
python src/repurpose.py my-post.md -o drafts/
python src/repurpose.py podcast-transcript.txt -o drafts/ --channels x,newsletter
```

Anything text works: blog posts, YouTube/podcast transcripts, talk notes, long README
files. For transcripts over ~15,000 words, split by topic first — drafts get sharper.

## 5. Publish (you, not the bot)

Deliberate design choice: this kit writes drafts, it doesn't post them. Read every
draft, fix the one weird sentence (there's usually one), and publish through your normal
tools. Your audience follows you, not your automation.

## Troubleshooting

- **`AuthenticationError`** — key not set in this terminal, or revoked.
- **Sounds generic** — your voice profile is still the example. Paste your real phrases.
- **A tweet is flagged over 280 chars** — the CLI told you which one; trim it by hand or
  just rerun.
