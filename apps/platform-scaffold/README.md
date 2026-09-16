# Platform scaffold (not part of the current build)

This directory holds the unfinished CreAI *platform* code (NextAuth sign-in, dashboard,
Stripe subscription checkout, agents/executions API routes) that was scaffolded for the
long-term SaaS vision. It was moved out of `apps/web` because:

- It depends on packages that don't exist yet (`@creai/db` has no package definition,
  no database is provisioned, `next-auth`/`stripe` were never wired to real accounts).
- With it in the app tree, `apps/web` could not compile, so nothing was deployable.

The current `apps/web` is the **storefront** for CreAI Automation Kits (see
`/REVENUE-DECISION.md` and `/LAUNCH-CHECKLIST.md`). When kit revenue justifies building
the platform, this code is the starting point: move pieces back into `apps/web`
incrementally, adding the real dependencies and a provisioned database as you go.
