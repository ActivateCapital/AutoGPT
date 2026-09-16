# CreAI Automation Kits

Sellable digital products: complete, ready-to-run AI agent automations. Each kit contains
a prompt system, a runnable Python CLI built on the Claude API, a no-code recipe, sample
data, a test suite, and a 15-minute setup guide.

| Product | Price | What it does |
|---|---|---|
| [`agent-skills-pack/`](agent-skills-pack/) | $29 | Five SKILL.md skills for Claude Code/Cursor/20+ agents: lead scoring, inbox triage, content repurposing, meeting actions, weekly review — zero-install-friction format |
| [`lead-qualifier-kit/`](lead-qualifier-kit/) | $49 | Scores, ranks, and routes inbound leads from a CSV with written reasoning per lead |
| [`inbox-triage-kit/`](inbox-triage-kit/) | $39 | Classifies and prioritizes exported email, drafting replies for everything that needs one |
| [`content-repurposer-kit/`](content-repurposer-kit/) | $49 | Turns one post/transcript into an X thread, LinkedIn post, newsletter section, and YouTube description |

Everything Bundle: all four for $99 (save $67).

The Agent Skills Pack is also listable on skills marketplaces (Agensi ~70% creator
share, KissMySkills, Gumroad Discover) — those carry their own buyer traffic, which
our storefront doesn't have yet. Listing requires a human-owned seller account on
each platform.

## Packaging for sale

Each kit directory is the deliverable. To package for the storefront (Gumroad /
Lemon Squeezy):

```bash
cd products
mkdir -p dist
for kit in agent-skills-pack lead-qualifier-kit inbox-triage-kit content-repurposer-kit; do
  zip -r "dist/creai-${kit}-v1.0.zip" "$kit" -x "*/__pycache__/*" "*.pyc"
done
zip -r dist/creai-everything-bundle-v1.0.zip agent-skills-pack lead-qualifier-kit inbox-triage-kit content-repurposer-kit -x "*/__pycache__/*" "*.pyc"
```

Upload each zip as the product file, paste the checkout links into
`apps/web/lib/products.ts`, and redeploy the storefront (see `/LAUNCH-CHECKLIST.md`).

## Development

Run the full test suite (no API key needed — tests use a stubbed client):

```bash
pip install -r products/requirements-dev.txt
python -m pytest products/ -v
```
