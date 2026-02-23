# Letter Case Converter

Official codebase for [lettercaseconverter.org](https://lettercaseconverter.org/).

`Letter Case Converter` is a fast, browser-based text utility site focused on practical everyday text cleanup and transformation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)

## Quick Links

- Website: [https://lettercaseconverter.org/](https://lettercaseconverter.org/)
- All Tools: [https://lettercaseconverter.org/tools](https://lettercaseconverter.org/tools)
- Search: [https://lettercaseconverter.org/search](https://lettercaseconverter.org/search)

## Live Website

- Production: [https://lettercaseconverter.org/](https://lettercaseconverter.org/)

## Online Tools (Deep Links)

- Letter Case Converter (homepage): [https://lettercaseconverter.org/](https://lettercaseconverter.org/)
- Remove Extra Spaces: [https://lettercaseconverter.org/cleanup/remove-extra-spaces](https://lettercaseconverter.org/cleanup/remove-extra-spaces)
- Reverse Text Generator: [https://lettercaseconverter.org/text/reverse-text-generator](https://lettercaseconverter.org/text/reverse-text-generator)

## Active Tool Scope

This repository is currently streamlined to a minimal, high-maintenance scope:

- Homepage case converter widget: `/`
- Remove Extra Spaces: `/cleanup/remove-extra-spaces`
- Reverse Text Generator: `/text/reverse-text-generator`

## Core Pages

- All tools directory: `/tools`
- Search: `/search`
- About: `/about`
- Contact: `/contact`
- Trust center: `/trust`
- Editorial policy: `/editorial-policy`
- Privacy / Terms / Cookie / US privacy pages

## Stack

- Astro 5
- Tailwind CSS
- Cloudflare adapter (`@astrojs/cloudflare`)

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md)
- [Operations Runbook](./docs/OPERATIONS.md)
- [Release Process](./docs/RELEASE_PROCESS.md)
- [Security Model](./docs/SECURITY_MODEL.md)
- [ADR 0001: Minimal Active Scope](./docs/adr/0001-minimal-active-scope.md)

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:4321`.

## Environment Variables

Use `.env.example` as reference.

- `OPENAI_API_KEY` (optional, only for AI API routes if enabled)
- `PUBLIC_GA_MEASUREMENT_ID` (optional)
- `PUBLIC_ADSENSE_CLIENT` (optional)
- `PUBLIC_FUNDING_CHOICES_PUBLISHER` (optional)
- `PUBLIC_GOOGLE_SITE_VERIFICATION_ID` (optional)

## Validation

```bash
npm run check:astro
npm run build
```

## Deployment

```bash
npm run build
npm run deploy
```

Project is configured for Cloudflare deployment.

## Project Structure

```text
src/
  components/
    common/
    widgets/
  layouts/
  pages/
    cleanup/remove-extra-spaces.astro
    text/reverse-text-generator.astro
    index.astro
    tools.astro
    search.astro
  utils/
```

## Repo Policies

- [Contributing Guide](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Changelog](./CHANGELOG.md)

## License

Licensed under [LICENSE.md](./LICENSE.md).
