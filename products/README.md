# CreAI Automation Kits

Sellable digital products: complete, ready-to-run AI agent automations. Each kit contains
a prompt system, a runnable Python CLI built on the Claude API, a no-code recipe, sample
data, a test suite, and a 15-minute setup guide.

| Kit | Price | What it does |
|---|---|---|
| [`lead-qualifier-kit/`](lead-qualifier-kit/) | $49 | Scores, ranks, and routes inbound leads from a CSV with written reasoning per lead |
| [`inbox-triage-kit/`](inbox-triage-kit/) | $39 | Classifies and prioritizes exported email, drafting replies for everything that needs one |
| [`content-repurposer-kit/`](content-repurposer-kit/) | $49 | Turns one post/transcript into an X thread, LinkedIn post, newsletter section, and YouTube description |

Bundle: all three for $99.

## Packaging for sale

Each kit directory is the deliverable. To package for the storefront (Gumroad /
Lemon Squeezy):

```bash
cd products
for kit in lead-qualifier-kit inbox-triage-kit content-repurposer-kit; do
  zip -r "dist/creai-${kit}-v1.0.zip" "$kit" -x "*/__pycache__/*" "*.pyc"
done
zip -r dist/creai-all-kits-bundle-v1.0.zip lead-qualifier-kit inbox-triage-kit content-repurposer-kit -x "*/__pycache__/*" "*.pyc"
```

Upload each zip as the product file, paste the checkout links into
`apps/web/lib/products.ts`, and redeploy the storefront (see `/LAUNCH-CHECKLIST.md`).

## Development

Run the full test suite (no API key needed — tests use a stubbed client):

```bash
pip install -r products/requirements-dev.txt
python -m pytest products/ -v
```
