# Release Process

## Versioning

Use semantic version tags:

- `vMAJOR.MINOR.PATCH`

## Release Steps

1. Update `CHANGELOG.md` under `[Unreleased]` and prepare release notes
2. Merge to `main` with green CI
3. Create tag (example: `v1.2.0`)
4. Push tag to GitHub
5. Release workflow builds and publishes `dist.tar.gz`

## Rollback

- Revert problematic commit(s)
- Cut patch release tag (for example `v1.2.1`)
- Redeploy and verify key pages
