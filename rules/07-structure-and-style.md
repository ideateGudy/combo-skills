# 07 - Structure & Code Style

- TypeScript strict. No `any` without a comment explaining why.
- One component per file; section components are named `<Name>Section` and live in `components/sections/`.
- Feature code is colocated; shared code lives in `lib/` (web), `src/lib` (mobile) or `src/shared` (desktop).
- Names: components `PascalCase`, files `kebab-case` or framework convention, hooks `useThing`, constants `SCREAMING_SNAKE`.
- Pure functions for logic; side effects in effects/handlers; always clean up listeners, timers, tickers and animation contexts.
- Comments explain *why*, not *what*. No commented-out code.
- Formatter + linter configured (Biome or ESLint + Prettier) and run before every commit.
- Document non-obvious decisions in `docs/decisions.md` (3 lines each).
