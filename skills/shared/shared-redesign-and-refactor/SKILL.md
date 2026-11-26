---
name: shared-redesign-and-refactor
description: Upgrade an existing project's UI/UX design system and architecture section-by-section. Triggered by /design or requests to redesign, polish, or simplify an existing app without regressions.
platform: shared
sections: [design, redesign, refactoring, polish, ui]
tags: [design, redesign, refactor, tokens, simplify, existing-project]
requires: [shared-design-tokens]
---

# Redesign & Architecture Upgrade (`/design`)

Use this skill to transform an existing codebase's **design** and **architecture** incrementally without breaking working features.

## When to use
- User invokes `/design`, `/design <section>`, or `/design full project`, or asks to improve/modernize an existing app's UI, UX, or architecture.
- Migrating ad-hoc styles and tangled components onto `DESIGN.md` tokens and clean section boundaries.

## Scope handling (`/design full project` vs `/design <section>`)
- **`/design <section>`**: lock `DESIGN.md` Brief, centralize tokens if missing, upgrade and verify that section.
- **`/design full project`**: lock `DESIGN.md` Brief once, decompose the entire app into sections in `.agent/ACTIVE_SKILLS.md` (starting with `tokens` & `layout/navigation`), then execute **Steps 2–5 sequentially for every section** (installing 1–2 relevant skills per section, verifying, logging, and committing each section) until the full project is upgraded.

## When NOT to use
- Before understanding the existing app (run `shared-project-audit` `/analyse` first if unfamiliar).

## Steps
1. **Lock the Design Brief**: fill or update the **Design Brief** in `DESIGN.md` (tone, palette, typography, signature element). State assumptions if the user gave none.
2. **Centralize tokens first**: extract scattered hex colors, font sizes, radii, and spacing into the single tokens file (`shared-design-tokens`), keeping existing visuals working while eliminating magic numbers.
3. **Upgrade one section at a time**:
   - **UI/UX**: establish clear hierarchy (one focal point, one primary CTA), add missing loading/empty/error/focus-visible states, fix mobile responsiveness (360px+), and remove `DESIGN.md` section 3 anti-patterns.
   - **Architecture**: separate pure logic from UI, replace over-engineered wrappers with simple built-ins, and fix $O(n^2)$ / waterfall bottlenecks.
4. **Protect behavior**: add or run tests on the section *before* and *after* refactoring. Do not rewrite unrelated working sections.
5. **Verify**: run `DESIGN.md` section 5 checklist and `.agent/rules/02-quality-gates.md`, then commit per section.

## Pitfalls
- Doing a "big-bang rewrite" of the whole app at once (breaks features and blows context).
- Changing visual tokens and business logic in the same commit (makes regressions hard to isolate).
- Keeping dead CSS/components after replacing them.

## Checklist
- [ ] `DESIGN.md` Design Brief is filled
- [ ] Hard-coded colors/sizes/spacing in the target section replaced with tokens
- [ ] All interactive & async states (hover, focus-visible, loading, empty, error) implemented
- [ ] Existing tests pass (and new regression tests added for refactored logic)
- [ ] Typecheck, lint, and production build pass
