# Operations Runbook

## Deploy Checklist

1. `npm run check`
2. `npm run build`
3. Confirm sitemap contains expected active pages
4. Deploy using configured Cloudflare pipeline
5. Verify homepage and active tools in production

## Incident Triage (Basic)

- Scope: identify affected routes/tools
- Repro: capture exact input/output mismatch
- Mitigation: rollback or hotfix
- Postmortem: log root cause and prevention action

## Quick Verification URLs

- `/`
- `/cleanup/remove-extra-spaces`
- `/text/reverse-text-generator`
- `/tools`
- `/search`
