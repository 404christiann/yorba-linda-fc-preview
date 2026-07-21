# Agent Handoff

## Status

This is the clean Onzio prospect master template. Meridian United is fictional reference data used to verify the design. Do not turn this repository into a real prospect or publish a generated prospect without Christian's explicit approval.

## Commands

```bash
npm run dev
npm run lint
npx next typegen
npx tsc --noEmit --pretty false
npm run build
npm run validate:template
npm run validate
```

## Architecture

- Next.js App Router, React, strict TypeScript, Tailwind CSS v4, GSAP/ScrollTrigger, and Framer Motion.
- Geist Sans and Geist Mono are checked in under `src/app/fonts/` and loaded with `next/font/local` so clean builds do not require network access.
- `src/app/(public)/` contains the public club experience.
- `src/app/admin/` contains the sample admin experience.
- `src/config/types.ts` defines the prospect contract, including all identity-driven copy.
- `src/config/prospect.ts` is the only active-club import.
- `src/lib/tiers.ts` owns Starter/Pro feature gates.
- `src/lib/store/MockDataProvider.tsx` owns shared in-memory sample mutations.
- `public/prospect/` contains only the active prospect's optimized site assets.
- `scripts/validate-template.mjs` enforces the reusable boundary.

Before editing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` as required by `AGENTS.md`.

## Locked product behavior

- Pro opens when the URL has no `tier` query.
- `?tier=starter` and `?tier=pro` are shareable.
- Starter suppresses sponsor, store, statistics, seasons, and analytics content.
- Public and admin surfaces share the same tier and in-memory sample state.
- Sample changes reset on refresh.
- The concept-preview disclosure and `noindex`/`nofollow` metadata are mandatory.
- The supplied prospect palette is exact; only neutral white, black, and gray may supplement it.

## Non-goals

Do not add authentication, persistence, databases, API routes, server actions, payments, tracking, multi-tenancy, or production operations. A signed client graduates to a separately scoped production project.

## Publishing gate

Generation, local verification, and user review do not authorize GitHub or Vercel publication. Publishing requires an explicit green light from Christian.
