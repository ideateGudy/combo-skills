---
name: shared-api-client
description: Typed API client with zod parsing at the boundary, a consistent error model, retries, auth token handling and TanStack Query hooks. Use when the app talks to an HTTP API.
platform: shared
sections: [data-layer, api, networking]
tags: [api, fetch, zod, tanstack-query, errors]
requires: []
---

# API Client

## Structure
```
lib/api/client.ts      fetch wrapper (base URL, auth header, timeout, retry, error mapping)
lib/api/schemas.ts     zod schemas = source of truth for types (z.infer)
lib/api/<feature>.ts   typed functions (getProjects, createProject)
hooks/use<Feature>.ts  TanStack Query hooks
```

## Rules
- Parse every response with zod (`schema.parse`) - never trust the wire. Types come from `z.infer`.
- One error model: `ApiError { status, code, message, details? }`. Map network/timeouts to the same shape.
- Retries: only idempotent requests (GET), exponential backoff, max 2-3; never auto-retry POST without an idempotency key.
- Base URL and keys from env (`NEXT_PUBLIC_*` / `EXPO_PUBLIC_*` only for non-secrets). Secrets stay server-side.
- Auth: access token in memory (web: HttpOnly cookie preferred; mobile: secure storage); refresh once on 401, then sign out.
- UI always handles loading, empty, error and stale states from query status.
- Query keys are structured (`["projects", { status }]`); invalidate precisely after mutations; use optimistic updates only with rollback.

## Checklist
- [ ] All responses zod-validated; no `any`
- [ ] Single `ApiError` shape used by UI
- [ ] No secrets in client bundle
- [ ] 401, 429, 5xx and offline cases handled
