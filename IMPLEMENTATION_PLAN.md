# Onzio Prospect Master — Implementation Record

## Objective

Maintain one clean master that can generate separate, deployment-ready sales previews for interested soccer clubs without changing shared components.

## Implemented boundary

- Fictional Meridian United reference configuration
- One active prospect import
- Prospect-driven identity, metadata, editorial copy, store copy, fallbacks, data, and assets
- Exact prospect colors injected through CSS custom properties
- Pro default with explicit Starter/Pro URL selection
- Shared in-memory public/admin behavior
- Static, noindex, sample-only architecture
- Automated active-config, asset, metadata, tier-default, and brand-leak validation

## Snapshot policy

The Lions FC preview is a separate sales snapshot and is not part of this master. New prospect repositories are also snapshots. They do not automatically receive later master changes.

## Release definition

A prospect is ready only after intake completion, copy approval, template validation, type generation, strict TypeScript, ESLint, production build, and desktop/mobile browser verification. External publishing requires Christian's explicit approval.

## Future work

The companion `onzio-prospect-builder` Codex skill will orchestrate intake, research, snapshot creation, asset optimization, configuration, validation, local review, and the separate publishing gate. It should reference this repository rather than bundle a duplicate application.
