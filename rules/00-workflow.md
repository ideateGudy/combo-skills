# 00 - Workflow

1. **Understand**: restate the goal, platform, sections. If something blocks progress, ask ONE question; otherwise
   state assumptions and proceed.
2. **Scaffold once** (use the scaffold skill if the project is empty), commit.
3. **Per section**: plan -> install skills -> build + write tests -> verify -> log -> commit.
   - Write comprehensive tests alongside every feature section (unit tests for pure logic/validation, component/integration tests for UI states & API routes, and E2E tests for critical flows).
4. **Small commits**: conventional commits (`feat(hero): ...`, `fix(nav): ...`, `chore: ...`). One section per commit
   or PR-sized chunk.
5. **Run it**: start the dev server/app and look at the result. Typecheck, lint, test suite, and build must pass.
6. **Report**: after each section give 3 lines max: what was built, what skills were used, what remains.
7. **Don't rewrite working sections** unless the user asks or a bug demands it.
8. Keep `.agent/ACTIVE_SKILLS.md` accurate: planned, in progress, done.
