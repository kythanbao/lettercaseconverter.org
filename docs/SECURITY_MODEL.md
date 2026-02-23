# Security Model

## Threat Surface

- Client-side input handling in tool widgets
- Optional API routes
- Third-party scripts enabled via consent

## Controls

- Input size/shape validation for API endpoints
- Redirect normalization in middleware
- HTTPS enforcement in production
- No secrets committed in repo (`.env` ignored)

## Secrets Management

- Store runtime secrets in deployment platform secrets
- Rotate keys if exposure is suspected
- Keep `.env.example` placeholder-only
