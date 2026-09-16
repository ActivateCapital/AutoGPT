# Content Repurposer Kit

One blog post or transcript in — an X thread, LinkedIn post, newsletter section, and
YouTube description out, in your voice.

**What it does:** you point it at any piece of long-form content you've made (blog post,
podcast/video transcript, talk notes). It produces four channel-native drafts that pull
the strongest ideas out of the piece — not a summary chopped four ways. A voice-profile
file you edit once keeps everything sounding like you.

## What's in the box

```
content-repurposer-kit/
├── README.md                 ← you are here
├── SETUP.md                  ← 15-minute setup guide
├── prompts/
│   ├── system-prompt.md      ← the agent's repurposing instructions
│   ├── voice-profile.md      ← EDIT THIS: how you sound
│   └── channel-guides.md     ← what "native" means per channel (tweakable)
├── src/
│   └── repurpose.py          ← the CLI (Python 3.10+)
├── examples/
│   └── sample-post.md        ← sample input to try immediately
├── tests/
│   └── test_repurpose.py
└── requirements.txt
```

## Quick start

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...   # from console.anthropic.com

python src/repurpose.py examples/sample-post.md -o drafts/
```

`drafts/` now contains `x-thread.md`, `linkedin.md`, `newsletter.md`,
`youtube-description.md`, and `all-drafts.md` (everything in one file for review).

## Make it yours

Edit `prompts/voice-profile.md` once — tone, phrases you use, phrases you'd never use,
how you open and close. Every draft after that carries your voice. Tune
`prompts/channel-guides.md` if your X or LinkedIn style differs from the defaults.

## Requirements & costs

- Python 3.10+ and an Anthropic API key. Repurposing a typical 1,500-word post costs on
  the order of a few cents with the default model.

## Support

14-day money-back guarantee. Questions: reply to your purchase receipt email.
