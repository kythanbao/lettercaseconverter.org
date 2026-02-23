# ADR 0001: Minimal Active Scope

- Status: Accepted
- Date: 2026-02-23

## Context

Project had expanded into a very large tool/page surface, increasing maintenance and quality risk.

## Decision

Adopt a minimal active scope with two public tools:

- Remove Extra Spaces
- Reverse Text Generator

Keep trust/policy pages and core navigation/search pages.

## Consequences

Positive:

- Smaller maintenance surface
- Faster QA and release confidence
- Cleaner SEO/internal-link structure

Trade-offs:

- Lower immediate breadth of tools
- Requires explicit process for adding new tools
