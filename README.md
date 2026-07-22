# Yorba Linda FC — Onzio Sales Preview

An interactive concept preview for Yorba Linda FC (Yorba Linda, CA), generated from the reusable Onzio prospect template. It presents a premium public website and a shared-state admin concept in Starter and Pro versions, without authentication, a database, payments, or persistent data.

This is an independent snapshot, not the reusable template. It does not automatically receive later changes made to the master template.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pro is the default experience. Use `?tier=starter` to review Starter explicitly.

## What's real vs. sample

- **Real:** club name, crest, city, contact details, league/venue facts, real training-program details, club/player photos, two supplied merchandise products (with real transparent front + back photos), 7 real sponsor logos, and 3 real governing-body/league affiliation marks (US Soccer, FIFA, SWPL).
- **Sample only:** roster, staff, fixtures/results, and league standings — opponent clubs are invented, not this club's actual current opponents.

## Club-specific configuration

All club-specific information lives in:

- `src/config/clubs/yorba-linda-fc/`
- `public/prospect/`
- The single active import in `src/config/prospect.ts`

This snapshot also has the optional **Standings** feature enabled (most future prospects won't) — it's an interactive, sortable table on the homepage rather than a separate page section. See `CLAUDE.md` for details on where that code lives and how to change it.

## Validation

```bash
npm run validate:template
npm run validate
```

`validate:template` confirms the active configuration, referenced assets, Pro default, prospect-driven metadata, noindex policy, and shared-code brand isolation. `validate` also runs Next.js type generation, strict TypeScript, ESLint, and a production build.

## Publishing status

Not yet published. No GitHub push or Vercel deployment happens without Christian's explicit approval. Full intake, research sources, and round-by-round review history live outside this repo in the sibling `intake/` folder (`PROSPECT_INTAKE.yaml`, `LOCAL_REVIEW.md`).
