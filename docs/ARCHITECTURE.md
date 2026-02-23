# Architecture

## Overview

Letter Case Converter is an Astro + Cloudflare project with a deliberately small runtime surface.

Current product scope is centered on:

- Homepage case conversion widget
- Remove Extra Spaces
- Reverse Text Generator

## Runtime Flow

1. Request enters Astro app.
2. `src/middleware.ts` enforces normalization/redirect rules.
3. Matching page renders via `src/layouts/PageLayout.astro`.
4. Widget-level logic runs in-browser for text processing.

## Key Layers

- Routing/pages: `src/pages/`
- Shared layouts: `src/layouts/`
- Widgets: `src/components/widgets/`
- SEO/permalinks/helpers: `src/utils/`
- Site config: `src/config.yaml`, `astro.config.ts`

## SEO and Indexing Constraints

- Only active tool paths are included in sitemap.
- Legacy/removed paths are redirected by middleware/config redirects.
- Canonical normalization is applied for slash/index variants.

## Security and Privacy Boundaries

- Most tool transformations are browser-local.
- API routes are optional and env-gated.
- Consent controls are handled in `ConsentManager`.
