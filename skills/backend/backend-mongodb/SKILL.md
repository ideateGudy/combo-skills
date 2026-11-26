---
name: backend-mongodb
description: MongoDB document schema design, ESR indexing, aggregation pipelines, and query optimization. Use when modeling collections, writing aggregations, or tuning MongoDB queries. Not for relational SQL/Postgres.
platform: backend
sections: [database, schema, performance, queries]
tags: [mongodb, nosql, mongoose, aggregation, indexing]
requires: []
---

# MongoDB Schema & Query Optimization

Distilled from [mongodb/agent-skills](https://github.com/mongodb/agent-skills) (`mongodb-schema-design` & `mongodb-query-optimizer`).

## When to use
- Designing MongoDB collections (embedding vs referencing), creating compound indexes, or optimizing slow queries/aggregations.

## When NOT to use
- Relational SQL databases (use `backend-postgresql`).

## Steps
1. **Embed vs Reference by access pattern**:
   - **Embed** bounded 1:1 or 1:few data that is always read/updated together.
   - **Reference** 1:many (unbounded growth) or many:many data to avoid hitting the 16MB document limit and bloated working sets.
2. **Follow the ESR rule for compound indexes**: order index keys **E**quality -> **S**ort -> **R**ange (e.g., `{ tenantId: 1, createdAt: -1, status: 1 }` when filtering by `tenantId`, sorting by `createdAt`, ranging on `status`).
3. **Project only needed fields**: pass projections (`{ name: 1, email: 1 }`) and use `.lean()` in Mongoose for read-only paths.
4. **Optimize aggregations**: place `$match` and `$sort` as early as possible so they hit indexes before `$lookup` or `$group`.
5. **Reuse one client/pool**: create a single `MongoClient` / Mongoose connection at startup; never connect per-request.

## Code / commands
```js
// ESR index example: filter by orgId (E), sort by createdAt (S), range on score (R)
db.events.createIndex({ orgId: 1, createdAt: -1, score: 1 });
```

## Pitfalls
- Unbounded arrays inside a single document (e.g. storing every user activity log inside `users`).
- Leading-wildcard regex queries (`/foo/`) that cannot use an index (prefer Atlas Search or anchored prefix `/^foo/`).
- Missing `explain("executionStats")` check when a query does `COLLSCAN` on large collections.

## Checklist
- [ ] No unbounded arrays in embedded documents
- [ ] Compound indexes follow Equality -> Sort -> Range (ESR) order
- [ ] Queries use projections and avoid `COLLSCAN` (`explain("executionStats")` checked)
- [ ] Single shared connection pool with graceful shutdown
- [ ] Schema validation (`$jsonSchema` or Mongoose/Zod) enforced on writes
