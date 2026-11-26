---
name: shared-project-audit
description: Analyze and audit an existing codebase for architecture, performance, security, accessibility, and DESIGN.md compliance. Triggered by /analyse, /analyze, or /audit on existing projects before making changes.
platform: shared
sections: [audit, analysis, architecture, refactoring]
tags: [analyse, audit, architecture, code-review, existing-project]
requires: []
---

# Existing Project Analysis & Audit (`/analyse`, `/audit`)

Use this skill when handed an **existing codebase** to understand, diagnose, and plan improvements without breaking working behavior.

## When to use
- User invokes `/analyse`, `/analyze`, or `/audit`.
- Onboarding onto an existing repository before refactoring architecture or redesigning UI.

## When NOT to use
- Greenfield project with no source code yet.

## Mode 1: `/analyse` (Read-Only Architecture & Stack Map)
Do **not** edit files. Produce a concise report covering:
1. **Stack & Entrypoints**: framework, language/TS strictness, state/DB layer, build & test commands from `package.json` / `pubspec.yaml`.
2. **Module & Dependency Map**: how routes, UI, services, and data layers connect; flag circular dependencies, god files (> 400 lines), and tight coupling.
3. **Complexity & Performance Hotspots**: $O(n^2)$ loops, N+1 DB/API calls, request waterfalls, unvirtualized lists, missing indexes, heavy un-split bundles.
4. **Top 5 Leverage Points**: ranked by impact vs effort.

## Mode 2: `/audit` (Full Quality, Security & Design Compliance)
Check the codebase against `DESIGN.md` and `.agent/rules/*`:
1. **Design & UI**: hard-coded colors/sizes/spacing instead of tokens, missing states (loading/empty/error), contrast/a11y gaps, anti-patterns (`DESIGN.md` section 3).
2. **Architecture & Simplicity**: over-engineered abstractions that 5–10 lines would replace, duplicated logic, mixed UI + data-fetching concerns.
3. **Security & Validation**: unvalidated external inputs, secrets in client/repo, unsafe HTML injection, missing auth/authz checks.
4. **Verification**: run existing `typecheck`, `lint`, `test`, and `build` commands and record actual failures.

## Output format (both modes)
1. **Findings table**: `Severity (Critical/High/Medium/Low)` | `Area` | `File:Line` | `Issue` | `Fix`
2. **Section plan**: propose the sections to fix in `.agent/ACTIVE_SKILLS.md` and which 1–2 skills each section needs. Wait for user confirmation (or proceed if asked to fix).

## Checklist
- [ ] Read-only during `/analyse` (zero unrequested edits)
- [ ] Real file paths, line numbers, and observed command outputs cited
- [ ] Findings prioritized by impact (Critical/High first)
- [ ] Improvement plan mapped to sections in `.agent/ACTIVE_SKILLS.md`
