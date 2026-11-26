---
name: shared-dsa-and-simplicity
description: Choose the simplest data structure and algorithm for each app section without over-engineering. Use when implementing search, caching, trees, queues, lookups, or data transforms. Not for trivial 1-to-1 CRUD.
platform: shared
sections: [architecture, search, caching, navigation, state, performance]
tags: [algorithms, data-structures, simplicity, yagni, complexity]
requires: []
---

# Data Structures, Algorithms & Simplicity

Pick the **simplest** structure and algorithm that meets the section's real scale. Five clear lines using built-ins beat 100 lines of premature "enterprise" abstraction.

## When to use
- Implementing search/filtering, caching, trees/menus, queues, deduplication, pagination, or dependency resolution.
- Reviewing code that feels nested, slow ($O(n^2)$), or over-engineered.

## When NOT to use
- Straightforward CRUD or static UI with small fixed lists (< 50 items).

## Section -> Data Structure & Algorithm Guide

| Section / Problem | Use this | Avoid | Complexity |
|---|---|---|---|
| Dedup, membership, ID joins | `Set` / `Map` | Nested `.find()` / `.includes()` | $O(n)$ vs $O(n^2)$ |
| Small-N LRU cache | JS `Map` (`delete` + `set` moves to end) | External LRU npm package or doubly-linked-list boilerplate | $O(1)$ |
| Autocomplete / search | SQL `LIKE 'q%'` + B-tree, or `.filter(x => x.startsWith(q))` | Custom Trie unless > 50k in-memory terms | $O(k)$ / indexed |
| Nested menus, comments, org trees | Flat `Map<id, node>` + single $O(n)$ pass to link children | Recursive DB queries (N+1) or deep mutation | $O(n)$ |
| Feeds & large tables | Keyset/cursor pagination (`WHERE id > $c LIMIT k`) | `OFFSET` on large tables | $O(\log n)$ |
| Task order / dependencies | Adjacency list + Kahn's topological sort (BFS) | Ad-hoc nested `while` loops without cycle check | $O(V + E)$ |
| Rate limiting / sliding window | Timestamp `Array`/ring buffer (or Redis `ZSET` distributed) | Polling timers per user | $O(1)$ amortized |
| Undo / Redo / History | Two stacks (`past[]`, `future[]`) | Deep-cloning entire app state on every keystroke | $O(1)$ push/pop |

## Simplicity Rules (5 lines > 100 lines)
1. **Use built-ins first**: `Set`, `Map`, `URLSearchParams`, `Intl.NumberFormat`, `Intl.DateTimeFormat`, `structuredClone`, `crypto.randomUUID`, `Object.groupBy`.
2. **Don't wrap one-liners**: no `ArrayUtils.isEmpty(arr)` or 3-layer factory/strategy patterns for a single `switch` or `Map` lookup.
3. **Optimize only at real scale**: for $N < 100$, `.filter()` / `.sort()` is fast, readable, and bug-free. Switch to heaps, tries, or indexes when $N$ or profiling justifies it.
4. **Flat over nested**: early returns and `Map` lookups beat 4 levels of `if/for` nesting.

## Example: 8-line LRU Cache (no extra dependency)
```ts
export function createLru<K, V>(max = 100) {
  const cache = new Map<K, V>();
  return {
    get(k: K) {
      if (!cache.has(k)) return undefined;
      const v = cache.get(k)!;
      cache.delete(k); cache.set(k, v);
      return v;
    },
    set(k: K, v: V) {
      if (cache.has(k)) cache.delete(k);
      else if (cache.size >= max) cache.delete(cache.keys().next().value!);
      cache.set(k, v);
    },
  };
}
```

## Checklist
- [ ] No accidental $O(n^2)$ loops (e.g. `.find()` inside `.map()`) on unbounded lists
- [ ] Standard library primitives used before adding helpers or dependencies
- [ ] No over-engineered abstractions (factories/wrappers) for single-use logic
- [ ] Tree/graph operations handle cycles and empty inputs cleanly
