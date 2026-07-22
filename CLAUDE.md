# Agent Handoff

## Status

This is the **Yorba Linda FC** prospect snapshot — a generated Onzio sales preview, not the master template. It is an independent copy: it does not automatically receive later changes made to the master template at `onzioProspectTemplate`, and it must not be treated as reusable reference data for other clubs.

Real: club name, crest, city, contact info, league/venue facts, club/player photos, real training-program details (`about.training`), two supplied merchandise products with real transparent front + back photos (navy home jersey, white away jersey), 7 real sponsor logos, 3 real governing-body/league affiliation marks (US Soccer, FIFA, SWPL), and a real recruiting/store hero photo. Fictional sample content: roster, staff, fixtures/results, and league standings (opponent clubs are invented, not the club's real current opponents).

Not yet published. No GitHub repository push or Vercel deployment happens without Christian's explicit green light — see `docs/PROSPECT_INTAKE.example.yaml`'s equivalent for this club at `../intake/PROSPECT_INTAKE.yaml` (outside this repo) for full intake and round-by-round review history.

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
- Sora (display/headings), Inter (body/UI), and Geist Mono (numeric/label accents) are checked in as static files under `src/app/fonts/` and loaded with `next/font/local` so clean builds do not require network access. (Geist Sans was replaced by Sora + Inter; Geist Mono is unchanged.)
- `src/app/(public)/` contains the public club experience.
- `src/app/admin/` contains the sample admin experience.
- `src/config/types.ts` defines the prospect contract, including all identity-driven copy.
- `src/config/clubs/yorba-linda-fc/index.ts` is this club's only config — the single source of truth for identity, copy, roster, fixtures, and standings.
- `src/config/prospect.ts` is the only active-club import.
- `src/lib/tiers.ts` owns Starter/Pro feature gates.
- `src/lib/store/MockDataProvider.tsx` owns shared in-memory sample mutations.
- `public/prospect/` contains only this club's optimized site assets.
- `scripts/validate-template.mjs` enforces the reusable boundary (still runs here even though this isn't the master — it checks this repo's own shared-code isolation).

## Site header

- Nav order: Home, About (`/club`), Roster, Schedule, Store (Store hidden under `?tier=starter`).
- `SiteHeader.tsx`'s `TRANSPARENT_HERO_PATHS` (`/`, `/store`, `/sponsors`, `/club`) lists every route that opens on a full-bleed dark hero — the header is transparent with light text there, then goes solid/frosted-white on scroll. Any other route stays solid at all times.
- The crest is always visible in the header (no fade-in-on-scroll). Next to it, `branding.affiliations` (US Soccer, FIFA, SWPL — real governing-body/league marks, sourced from a live club site reference, `roseCityWebsite` in Downloads, for the visual pattern) renders as a small logo cluster with a divider, swapping between white and color logo variants with the same transparent/solid header state.

## Feature specific to this club: league standings

Unlike the base template, this snapshot has the **Standings** feature turned on (`standings` is populated in the club config) because Yorba Linda FC's real site has a league table on its About page and Christian asked to replicate it. This is an *optional* master-template feature — most future prospects will not have `standings` configured and will not show this nav item, admin tab, or page section at all.

- Admin: `/admin/standings` — add/edit/remove teams (team name, logo, GP, W, D, L, GD, Points), auto-sorted by points.
- Public: lives entirely on the homepage now (`StandingsTable.tsx`, rendered after the sponsors section) — there is no standings content on `/club` anymore. The table is interactive: click any stat column header to sort by it (active column shows a ▲/▼ indicator), rows animate to their new position (Framer Motion, respects `prefers-reduced-motion`), and the `#` rank column always stays pinned to the official points/GD standing regardless of which column is being sorted. On mobile it collapses to just Team + Points to avoid horizontal scroll.
- Pro-tier gated, same as Stats/Sponsors/Seasons/Analytics — hidden entirely under `?tier=starter`.

If this feature needs changes beyond this club's own data (copy, styling, new columns, new behavior), the underlying code lives in the master template's shared components (`HomeScreen.tsx`, `StandingsTable.tsx`, `StandingsAdmin.tsx`, `AdminShell.tsx`, `AdminScreen.tsx`, `MockDataProvider.tsx`, `types.ts`, `tiers.ts`) — fix it there first, then port the change into this snapshot, the same way the feature was originally built.

## Homepage section order

Hero → Shop the collection (Starter-hidden) → Next match → Sponsors (logo carousel + "Get involved" CTA) → League standings → Matchday photo gallery → "Ready to compete?" recruiting CTA (closing section, real photo + real training copy, links to `/club`).

There is no "Our identity" section on the homepage anymore — that content now lives on `/club` as a "What defines us" section (styled to match the Training section's bullet-list treatment), placed right after the manifesto.

This order is currently specific to this snapshot's `HomeScreen.tsx` — the master template's `HomeScreen.tsx` has drifted out of sync (older section order, missing the sponsor-carousel conversion and other rounds' worth of changes) and was not updated when this reorder happened, to avoid compounding that drift. Treat master's homepage layout as stale until a dedicated reconciliation pass.

## Club page (`/club`) group photo

`about.groupPhoto` (optional, master-template feature) renders a real team photo directly below the mission pull-quote in the `.manifesto` section — a compact rounded card (`max-height:42vh`, so it can never grow oversized regardless of monitor size), not a full-bleed band. The founding-year number mark that used to sit to the left of the story text has been removed; the story column now starts flush left. Built in both the master template (with a placeholder sample on Meridian's reference config) and this snapshot (with the real `group_photo.jpg`).

## Sponsors (`/sponsors`)

Real sponsor logos (7: Fidelity, Flowable, IBM, Mark43, Pega, Shift Sports, Azure), sourced from Supabase, shown as a continuously scrolling carousel (same component used on the homepage). The page has no separate hero anymore — it opens directly into the sponsor carousel, followed by a "Get involved" contact block (Find us / Get in touch / real training hours / a message form) styled with the site's navy-to-gold gradient.

## Store (`/store`)

- Front jersey photos are real, transparent-cutout PNGs (not the old opaque studio photos). Each jersey also has an optional `backImage` — a Front/Back toggle appears in the product detail modal only; grid/card views always show the front.
- The featured product panel shows a real player photo (not a flat product shot), rendered with `object-fit:contain` plus a separate overlay fade `<div>` (not a `mask-image`) and no hover-zoom transform on that element — this replaced an earlier `mask-image` + `transform:scale()` combination that caused a WebKit/Chromium compositing artifact on hover.
- The two jersey cards (grid/card view, on both `/store` and the homepage's "Shop the collection") each carry a 2px gold border so they read as distinct objects against their own card backgrounds (the away jersey's card background is near-white, the home jersey's is navy — without a border each jersey visually merged into its own card). Centered as a group via `grid-template-columns:repeat(auto-fit,minmax(...))` + `justify-content:center` rather than a fixed 3-column split, so it stays centered regardless of how many products exist. On mobile, `.kit-collection` (homepage only) becomes a horizontal scroll-snap carousel — its `justify-content` must stay `start` there, since inheriting the desktop `center` value makes the carousel load scrolled to its midpoint instead of showing the first card.

## Locked product behavior

- Pro opens when the URL has no `tier` query.
- `?tier=starter` and `?tier=pro` are shareable.
- Starter suppresses sponsor, store, statistics, seasons, standings, and analytics content.
- Public and admin surfaces share the same tier and in-memory sample state.
- Sample changes reset on refresh.
- The concept-preview disclosure and `noindex`/`nofollow` metadata are mandatory.
- The supplied prospect palette is exact (`#2A2E54` navy, `#DAAE2B` gold, `#FEFEFE` used as the on-dark accent role); only neutral white, black, and gray may supplement it.

## Non-goals

Do not add authentication, persistence, databases, API routes, server actions, payments, tracking, multi-tenancy, or production operations. A signed client graduates to a separately scoped production project.

## Publishing gate

Generation, local verification, and Christian's review do not authorize GitHub or Vercel publication on their own. Publishing requires his explicit green light, tracked separately per round in the intake folder's `LOCAL_REVIEW.md`.
