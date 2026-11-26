---
name: backend-nestjs
description: NestJS modular architecture, dependency injection boundaries, DTO validation, guards/interceptors, and testing. Use when building or refactoring NestJS backend services. Not for Express or frontend apps.
platform: backend
sections: [architecture, api, validation, auth, testing]
tags: [nestjs, typescript, modular-monolith, di, backend]
requires: [shared-typescript]
---

# NestJS Architecture & Patterns

Distilled from [amirtaherkhani/nestjs-skills](https://github.com/amirtaherkhani/nestjs-skills) and [Kadajett/agent-nestjs-skills](https://github.com/Kadajett/agent-nestjs-skills).

## When to use
- Designing NestJS feature modules, controllers, providers, DTOs, guards, interceptors, or exception filters.
- Preventing circular dependencies and enforcing clean module boundaries.

## When NOT to use
- Lightweight single-file scripts or Express.js apps (use `backend-express`).

## Steps
1. **Cohesive feature modules**: group by business capability (`users/`, `orders/`, `auth/`). Export only the public service/port; keep repositories internal to the module.
2. **Validate at the edge**: enable global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` in `main.ts` with `class-validator` or Zod DTOs.
3. **Keep controllers thin**: controllers parse/validate DTOs, call one service method, and return response DTOs (never leak ORM entities directly).
4. **Avoid circular dependencies**: never reach for `forwardRef()` first — extract shared domain logic into a lower-level module or use domain events (`@nestjs/event-emitter`).
5. **Centralize cross-cutting concerns**: use `Guard` for auth/RBAC, `ExceptionFilter` for uniform error shapes, and `ConfigModule` with schema validation for env vars.

## Code / commands
```bash
npx @nestjs/cli new api --strict
npm run start:dev
npm run test && npm run test:e2e
```

## Pitfalls
- Injecting repositories across module boundaries instead of going through the owning module's exported service.
- Missing `whitelist: true` on `ValidationPipe` (allows mass-assignment of unexpected fields).
- Swallowing errors in `try/catch` without throwing `HttpException` subclasses or logging context.

## Checklist
- [ ] Global `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`) enabled
- [ ] Zero `forwardRef()` circular dependencies
- [ ] Controllers do not contain business logic or direct DB queries
- [ ] Env variables validated at startup (`ConfigModule` + Joi/Zod)
- [ ] Unit tests mock repositories; e2e tests (`supertest`) cover auth + validation paths
