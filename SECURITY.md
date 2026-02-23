# Security Policy

## Supported Versions

Only the latest `main` branch is supported.

## Reporting a Vulnerability

Please do **not** open public issues for security vulnerabilities.

Report privately to:

- `contact@lettercaseconverter.org`

Include:

- Affected endpoint/file/feature
- Reproduction steps
- Impact assessment
- Suggested mitigation (if available)

## Response Targets

- Initial acknowledgment: within 72 hours
- Triage decision: within 7 business days
- Fix timeline: based on severity and exploitability

## Scope Notes

Current high-priority areas:

- API routes under `src/pages/api`
- Middleware and redirect behavior
- Consent/privacy logic
- Dependency vulnerabilities in production path
