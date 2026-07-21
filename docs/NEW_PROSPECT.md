# New Prospect Workflow

## 1. Intake

Create a prospect workspace outside this master and copy `PROSPECT_INTAKE.example.yaml` into it. A send-ready preview requires:

- Real club name, location, league, links, and factual description
- Real full-color crest and, when available, a light crest
- Exact supplied color palette
- At least four real club photos
- Three manually supplied merchandise images
- Christian's approval of Codex-drafted club copy

Roster, staff, fixtures, results, statistics, and sponsors may be fictional sample content. Merchandise images are never generated automatically.

## 2. Generate locally

Create a clean snapshot of this master without its Git history. Add `src/config/clubs/<club-slug>/`, point `src/config/prospect.ts` to it, and replace `public/prospect/` with optimized copies of the supplied assets. Preserve all originals in the external intake folder.

Populate every `ProspectConfig.copy` field. Shared screens must remain unchanged. Update `template/brand-leak-terms.json` so it includes Meridian/reference terms and any prior-club terms that must not survive.

## 3. Verify

Run:

```bash
npm run validate
```

Then verify desktop and mobile behavior in a browser:

- Pro opens with no query parameter.
- Starter and Pro switch together across public and admin surfaces.
- Starter mounts no Pro-only content.
- Header, roster, schedule, match areas, store, admin navigation, and sample mutations work.
- Reduced-motion behavior remains usable.
- Metadata, social links, copy, palette, and assets belong to the prospect.

Do not mark the preview ready while required assets, approved copy, or any validation is missing.

## 4. Review and publish

Present the local preview and validation report to Christian. Stop. Only an explicit publishing approval authorizes creation of the public GitHub repository, push, or Vercel deployment.

Generated prospect repositories are independent snapshots. Master changes apply only to future prospects unless a fix is deliberately ported or the preview is regenerated.
