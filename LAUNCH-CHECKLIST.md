# Launch Checklist — CreAI Automation Kits

Everything is built and tested. Two human steps stand between this branch and a live
storefront; everything else is done or agent-executable on request.

## ✅ Done (this branch)

- [x] Three sellable kits in `products/` (prompt systems, runnable CLIs, no-code
      recipes, sample data, 16 passing tests — run `python -m pytest products/`)
- [x] Storefront at `apps/web` rewritten from waitlist → checkout, **builds clean**
      (`cd apps/web && npm install && npm run build`) — fully static, deployable anywhere
- [x] Fabricated stats and fake waitlist form removed from the page
- [x] Unfinished platform code moved to `apps/platform-scaffold/` (documented there)
- [x] Launch post drafts in `launch/` (awaiting approval — nothing auto-posts)
- [x] Free sample skill (Meeting Actions) downloadable from the live site with no
      email gate — the site delivers real value before checkout even exists

## 👤 Human step 1 — payment rail (~15 min, blocks everything)

1. Create a merchant account: **Gumroad** (simplest) or **Lemon Squeezy** (nicer
   checkout, also a merchant of record). Complete payout/KYC.
2. Package the products: run the zip commands in `products/README.md`, upload the
   five zips at $29 (skills pack) / $49 / $39 / $49 / $99 (bundle), enable "14-day
   refund" in settings.
3. Copy each product's checkout URL.

**High-leverage extra (~20 min):** also list the Agent Skills Pack on the skills
marketplaces that have their own buyer traffic — Agensi (curated, creators keep 70%)
and KissMySkills — plus Gumroad Discover. Marketplace distribution is the strongest
demand channel we found; it needs a human-owned seller account on each platform.

## 👤 Human step 2 — hand the links back

Paste into `apps/web/lib/products.ts`:

- the four checkout URLs (replace each `PAYMENT_LINK_PENDING`)
- a public sales email (replace `CONTACT_EMAIL_PENDING`) for the done-for-you tier

Then tell the agent "links are in" — or do it yourself:
buy buttons flip on automatically once the sentinels are replaced.

## 🤖 Agent-executable once unblocked (say the word)

- Deploy the storefront (static export works on Render/Vercel/Netlify; `render.yaml`
  exists in the repo). Custom domain optional — a default subdomain is fine for day one.
- Final pre-launch pass: run every kit once against the live API key end-to-end,
  re-zip, re-upload instructions.
- Post launch content — **only after you approve the drafts in `launch/`**, and each
  post goes out under your accounts, by you or with your explicit go-ahead per channel.

## Standing rules (unchanged from REVENUE-DECISION.md)

No cold email. No auto-posting without per-channel approval. No ad spend without
sign-off. Refunds honored, no questions asked.
