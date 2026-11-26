---
name: shared-state-management
description: Decide where state lives - server cache (TanStack Query), client state (Zustand), URL state and local component state. Use when state crosses sections or screens. Not for trivial local state.
platform: shared
sections: [state, architecture]
tags: [zustand, tanstack-query, state, url-state]
requires: []
---

# State Management

## Decision table
| State | Home |
|---|---|
| Data from the server | TanStack Query (never copy into a global store) |
| Filters, tabs, pagination, selected item | URL (search params / route params) |
| UI preferences, session, cross-screen client state | Zustand (small slices) |
| Form state | react-hook-form (web) / local state |
| Ephemeral UI (open/closed, hover) | `useState` in the component |

## Rules
- Lowest level wins: start local, lift only when two distant components need it.
- Zustand: one store per domain, selectors to avoid re-renders (`useStore(s => s.x)`), actions inside the store, persist only what must survive restarts (web: `localStorage` via middleware; mobile: MMKV).
- Derived data is computed (selectors/`useMemo`), not stored.
- No global store for server data; no prop drilling beyond 2 levels (use context for stable values like theme).
- State transitions for complex flows (checkout, onboarding) are explicit (`status: "idle" | "loading" | "error"` or a small state machine).

## Checklist
- [ ] Each piece of state has exactly one owner
- [ ] Persisted state is versioned and has a reset path
- [ ] Components subscribe only to what they render
