---
name: shared-typescript
description: TypeScript strict mode patterns, discriminated unions, unknown narrowing, and Zod boundary validation. Use when configuring tsconfig, typing APIs/state, or eliminating any/unsafe casts. Not for non-TS projects.
platform: shared
sections: [typescript, types, validation, architecture]
tags: [typescript, strict, zod, type-safety]
requires: []
---

# TypeScript Strict Patterns

## When to use
- Setting up `tsconfig.json`, modeling domain states/errors, or validating external JSON/API/env payloads.

## When NOT to use
- Pure JavaScript or Dart/Flutter projects.

## Steps
1. **Enable strict compiler flags**: `"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true` (where practical), and `"noEmit": true` for typecheck scripts.
2. **Replace `any` with `unknown` + narrowing**: parse external inputs (`fetch`, `JSON.parse`, `req.body`, `process.env`) with Zod or type guards at the boundary.
3. **Model states with discriminated unions**: use `{ status: "idle" } | { status: "loading" } | { status: "error"; error: string } | { status: "success"; data: T }` instead of multiple optional booleans.
4. **Use `satisfies` and `as const`**: preserve literal types for config maps and routes while still checking shape conformance.
5. **Exhaustive switches**: handle every union member with a `never` helper in `default` so new variants fail at compile time.

## Code / commands
```ts
export function assertNever(x: never): never {
  throw new Error(`Unexpected variant: ${String(x)}`);
}
```

## Pitfalls
- Using `as Foo` type assertions to silence compiler errors on unvalidated API data.
- Enabling `skipLibCheck: false` only to fight third-party `.d.ts` issues instead of fixing local types.
- Indexing arrays/records without handling `undefined` when `noUncheckedIndexedAccess` is enabled.

## Checklist
- [ ] `tsconfig.json` has `"strict": true` and `"noUncheckedIndexedAccess": true`
- [ ] Zero `any` without an inline justification comment
- [ ] External inputs are parsed with Zod or explicit type guards at boundaries
- [ ] Multi-state flows use discriminated unions with exhaustive `switch` checks
