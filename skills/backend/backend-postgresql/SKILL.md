---
name: backend-postgresql
description: PostgreSQL schema design, indexing strategies, query optimization, migrations, and connection pooling. Use when writing SQL, designing Postgres schemas, or tuning slow queries. Not for NoSQL/MongoDB.
platform: backend
sections: [database, schema, migrations, performance]
tags: [postgresql, sql, indexing, migrations, prisma, drizzle, neon]
requires: []
---

# PostgreSQL Best Practices

Distilled from [neondatabase/postgres-skills](https://github.com/neondatabase/postgres-skills) (`postgres-best-practices`).

## When to use
- Designing relational tables, foreign keys, constraints, indexes, migrations, or optimizing slow SQL queries.

## When NOT to use
- Document-oriented MongoDB workloads (use `backend-mongodb`).

## Steps
1. **Model with strict types & constraints**: use `bigint GENERATED ALWAYS AS IDENTITY` or `uuid` (UUIDv7 when ordered), `timestamptz` (never `timestamp` without tz), `numeric` for money (never `float`), and `NOT NULL` / `CHECK` / `FOREIGN KEY` constraints in the DB—not only in app code.
2. **Index intentionally**:
   - Always index foreign key columns (Postgres does not auto-index FKs).
   - Order composite indexes equality-columns-first, range-columns-last.
   - Use partial indexes (`WHERE deleted_at IS NULL`) for soft-delete/active rows and `GIN` for `jsonb` / full-text search.
3. **Avoid N+1 & lock contention**: use joins/CTEs or batched `WHERE id = ANY($1)` instead of loops; use `CREATE INDEX CONCURRENTLY` on live tables.
4. **Inspect real plans**: run `EXPLAIN (ANALYZE, BUFFERS)` on critical queries to catch sequential scans on large tables.
5. **Pool connections**: size pools sensibly (e.g. `pg.Pool` or PgBouncer/Neon pooler for serverless) and always use parameterized queries (`$1, $2`).

## Code / commands
```sql
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'canceled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
```

## Pitfalls
- String-interpolating SQL (SQL injection) or using `OFFSET` for deep pagination (use keyset/cursor pagination `WHERE id > $last_id ORDER BY id LIMIT 20`).
- Running `ALTER TABLE ... ADD COLUMN ... DEFAULT ...` or unindexed deletes on huge tables without checking lock impact.
- Storing unbounded `jsonb` blobs when relational columns would enforce integrity and indexability.

## Checklist
- [ ] All queries are parameterized (zero string interpolation)
- [ ] Foreign keys have explicit `ON DELETE` behavior and supporting indexes
- [ ] Timestamps use `TIMESTAMPTZ`; money uses integer cents or `NUMERIC`
- [ ] Migrations are reversible/forward-safe and committed to version control
- [ ] Critical queries verified with `EXPLAIN (ANALYZE, BUFFERS)`
