# Onzio Prospect Template

A reusable Next.js sales-preview template for semi-professional soccer clubs. It presents a premium public website and a shared-state admin concept in Starter and Pro versions without authentication, a database, payments, or persistent data.

The master runs against the fictional Meridian United reference configuration. Every real prospect must be generated as a separate repository and deployment; the master is never customized in place.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pro is the default experience. Use `?tier=starter` to review Starter explicitly.

## Prospect boundary

All prospect-specific information belongs in:

- `src/config/clubs/<club-slug>/`
- `public/prospect/`
- The single active import in `src/config/prospect.ts`

Identity-driven writing belongs in `ProspectConfig.copy`. Shared components must not contain club names, cities, slogans, seasons, product claims, or brand colors.

If a new prospect requires editing a shared component, treat it as a template defect and fix the master before generating the snapshot.

## Validation

```bash
npm run validate:template
npm run validate
```

`validate:template` confirms the active configuration, referenced assets, Pro default, prospect-driven metadata, noindex policy, and shared-code brand isolation. `validate` also runs Next.js type generation, strict TypeScript, ESLint, and a production build.

See [docs/NEW_PROSPECT.md](docs/NEW_PROSPECT.md) for the complete Codex-assisted workflow and [docs/PROSPECT_INTAKE.example.yaml](docs/PROSPECT_INTAKE.example.yaml) for the intake shape.
