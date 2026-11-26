---
name: web-nextjs
description: Next.js App Router architecture, Server vs Client Components, streaming, Server Actions, and caching. Use when building Next.js routes, layouts, data fetching, or API handlers. Not for pure client-side SPAs.
platform: web
sections: [routing, app-router, data-fetching, seo, api]
tags: [nextjs, app-router, rsc, server-actions, vercel]
requires: [web-react]
---

# Next.js App Router

Distilled from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) and [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills).

## When to use
- Creating `src/app/` routes, layouts, loading/error boundaries, Server Actions, or Route Handlers.
- Deciding Server Component vs `"use client"` boundaries and caching/revalidation strategies.

## When NOT to use
- Vite/SPA projects without a Next.js server.

## Steps
1. **Default to Server Components**: keep `page.tsx` and `layout.tsx` as Server Components. Push `"use client"` down to the smallest interactive leaf (forms, toggles, animations).
2. **Stream with Suspense**: place `loading.tsx` or `<Suspense fallback={...}>` around slow data fetches so the shell renders immediately.
3. **Fetch in parallel on the server**: start independent fetches together (`Promise.all`), never sequentially inside nested components without `React.cache` deduplication.
4. **Secure Server Actions & Route Handlers**: always validate input with Zod, check authentication/authorization inside every action/handler (never trust client-passed IDs), and call `revalidatePath` / `revalidateTag` after mutations.
5. **Optimize assets**: use `next/image` (with `sizes` and `priority` on LCP hero only) and `next/font` for zero-CLS fonts.

## Code / commands
```tsx
// src/app/dashboard/page.tsx (Server Component)
import { Suspense } from "react";
import { StatsPanel } from "./StatsPanel";

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading stats...</p>}>
        <StatsPanel />
      </Suspense>
    </main>
  );
}
```

## Pitfalls
- Marking a top-level `layout.tsx` or `page.tsx` with `"use client"` (ships unnecessary JS and blocks server data fetching).
- Calling `cookies()` or `headers()` in a shared layout when only one leaf needs dynamic rendering (opts the whole tree out of static caching).
- Importing server-only secrets/DB clients into a `"use client"` module (use `import "server-only"` in server utilities).

## Checklist
- [ ] `"use client"` is pushed to interactive leaves only
- [ ] Every route has `error.tsx` and `loading.tsx` (or `<Suspense>`) where async data is fetched
- [ ] All Server Actions and Route Handlers validate input (Zod) and enforce auth
- [ ] Server-only modules import `"server-only"`
- [ ] `next build` succeeds with zero type or RSC boundary errors
