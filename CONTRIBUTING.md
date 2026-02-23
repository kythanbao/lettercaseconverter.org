# Contributing Guide

Thanks for contributing.

## Branch and PR

- Create a branch from `main`.
- Keep PR scope small and focused.
- Use clear PR titles and descriptions.

## Local Setup

```bash
npm install
npm run dev
```

## Required Checks

Before opening a PR, run:

```bash
npm run check:astro
npm run build
```

## Coding Rules

- Keep ASCII by default unless file already uses Unicode.
- Avoid adding large generic abstractions for small features.
- Prefer simple, explicit logic.
- Update docs when behavior changes.

## Commit Style

Use concise, descriptive commit messages, for example:

- `fix: normalize reverse-text mode handling`
- `chore: remove unused widget files`
- `docs: update setup and env instructions`

## What to Include in PR Description

- What changed
- Why it changed
- How it was tested
- Any follow-up work
