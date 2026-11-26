---
name: web-react
description: React 19 component composition, state colocation, and render performance. Use when building React UIs, refactoring prop-heavy components, or fixing waterfalls/re-renders. Not for framework routing (use web-nextjs).
platform: web
sections: [ui, components, state, performance]
tags: [react, hooks, composition, performance, vercel-agent-skills]
requires: []
---

# React Composition & Performance

Distilled from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (`react-best-practices` & `composition-patterns`).

## When to use
- Building reusable React components, compound components, or custom hooks.
- Fixing unnecessary re-renders, request waterfalls, or boolean-prop proliferation.

## When NOT to use
- Next.js App Router, RSC boundaries, or SSR caching (pair with `web-nextjs`).
- Trivial static HTML/CSS with no interactive state.

## Steps
1. **Eliminate waterfalls**: start independent async work in parallel (`Promise.all`), defer `await` into the branch that uses it, and wrap slow subtrees in `<Suspense>`.
2. **Compose instead of boolean flags**: when a component accumulates `isCompact`, `withHeader`, `showFooter` props, split it into compound components (`Card.Header`, `Card.Body`, `Card.Footer`) or explicit variants.
3. **Colocate state**: keep ephemeral state local; derive computed values during render instead of syncing via `useEffect`.
4. **Minimize bundle & re-renders**: lazy-load heavy widgets (`React.lazy` for charts/editors), pass primitive props or memoized callbacks only where profiling shows a bottleneck, and never define components inside another component's render body.
5. **Clean up effects**: abort `fetch` requests (`AbortController`), clear timers, and unsubscribe listeners in `useEffect` return functions.

## Code / commands
```tsx
// Compound component instead of boolean-prop soup
export function Dialog({ children }: { children: React.ReactNode }) {
  return <div role="dialog" aria-modal="true">{children}</div>;
}
Dialog.Title = function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2>{children}</h2>;
};
Dialog.Actions = function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="dialog-actions">{children}</div>;
};
```

## Pitfalls
- Using `useEffect` to derive state from props/state (causes extra render pass; compute inline or `useMemo`).
- Barrel files (`index.ts`) re-exporting heavy modules and defeating tree-shaking.
- Using array index as `key` on reorderable/filterable lists.

## Checklist
- [ ] No `useEffect` used solely to mirror props or derive state
- [ ] Independent async calls run in parallel (`Promise.all`)
- [ ] Heavy non-critical components are code-split (`React.lazy` / dynamic import)
- [ ] All effects clean up subscriptions, timers, and `AbortController`s
- [ ] Interactive elements have accessible roles, labels, and keyboard support
