---
name: backend-express
description: Express.js TypeScript API architecture with layered routes/controllers/services, Zod validation, async error middleware, and security headers. Use when building lightweight Node REST APIs or BFFs. Not for NestJS apps.
platform: backend
sections: [architecture, api, validation, security]
tags: [express, nodejs, typescript, rest, zod, backend]
requires: [shared-typescript]
---

# Express.js Production API

## When to use
- Building a lightweight REST API, webhook receiver, or BFF with Express 4/5 and TypeScript.

## When NOT to use
- Large multi-team enterprise backends needing built-in DI and module boundaries (use `backend-nestjs`).

## Steps
1. **Layer cleanly**: `routes/` (HTTP verbs + middleware) -> `controllers/` (parse `req`, call service, send `res`) -> `services/` (business logic) -> `repositories/` (DB queries).
2. **Validate every request**: use a Zod middleware helper (`validate({ body, query, params })`) before controllers; reject invalid payloads with `400` and structured field errors.
3. **Centralize error handling**: wrap async route handlers (or use Express 5 native async error forwarding) and terminate with a single `(err, req, res, next)` error middleware returning `{ error: { code, message } }`.
4. **Harden defaults**: mount `helmet()`, strict `cors({ origin })`, `express.json({ limit: "100kb" })`, rate limiting on auth/public routes, and graceful shutdown on `SIGTERM`/`SIGINT`.
5. **Expose health checks**: `/health` (liveness) and `/ready` (DB ping).

## Code / commands
```ts
// src/middleware/validate.ts
import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.flatten() });
    }
    req.body = parsed.data;
    next();
  };
```

## Pitfalls
- Forgetting `next(err)` in Express 4 async handlers (causes hanging requests / unhandled rejections).
- Returning raw stack traces or database error messages in production responses.
- Leaving `app.use(cors())` wide open (`*`) when credentials/cookies are used.

## Checklist
- [ ] All inputs (`body`, `query`, `params`) validated with Zod before reaching services
- [ ] Central error middleware handles `AppError` and unexpected errors without leaking stacks
- [ ] `helmet`, scoped `cors`, body size limit, and rate limiting configured
- [ ] Graceful shutdown closes HTTP server and DB pools on `SIGTERM`
- [ ] Integration tests (`supertest` + `vitest`) cover happy path, 400 validation, and 401/404
