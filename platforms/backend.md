# Platform: BACKEND

**Default stack**: Node.js (LTS) + TypeScript strict (`tsconfig` with `strict: true`, `noUncheckedIndexedAccess: true`), NestJS (structured modular apps) or Express.js (lightweight REST/BFF). Database: PostgreSQL (Prisma/Drizzle) or MongoDB (Mongoose/official driver). Pick once, record it in `docs/decisions.md`.

**Folders**
```text
src/
  modules/             feature modules (routes/controllers, services, repos, schemas)
  common/              middleware, guards, filters, error types, logger
  config/              validated env schema (zod)
  db/                  migrations, schema, connection pool
test/                  unit + integration (supertest + test DB)
```

**Allowed skills**: `backend-*`, `shared-*`.
**Forbidden**: `web-*` DOM/browser APIs, `mobile-*`, `desktop-*`.
**Targets**: p95 API latency < 200ms, 100% boundary input validation (Zod/DTOs), zero unhandled promise rejections, `/health` + `/ready` endpoints.
