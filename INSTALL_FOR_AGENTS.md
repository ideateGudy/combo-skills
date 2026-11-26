# INSTALL_FOR_AGENTS.md

You were given the URL of this repository. Do exactly this, in order. Do not read every skill.

## 1. Clone into the user's project (keep it for later installs)

```bash
git clone --depth 1 <THIS_REPO_URL> .agent/.skills-source
```

If `.agent/.skills-source` already exists, run `git -C .agent/.skills-source pull` instead.

## 2. Establish the platform and the brief

From the user's message determine:
- **platform**: `web` | `mobile` | `desktop` | `backend` (ask ONE short question if unclear)
- **what is being built** (one paragraph)

## 3. Install the baseline (rules only, zero skills yet)

```bash
node .agent/.skills-source/scripts/install.mjs --platform <platform> --baseline --target .
```

This copies `AGENTS.md`, `GEMINI.md`, `DESIGN.md`, `SKILLS.md` and the rules into the project
(`.agent/rules/`). It never overwrites an existing `DESIGN.md`.

## 4. Read, in this order

`AGENTS.md` -> `DESIGN.md` -> `SKILLS.md` -> `.agent/rules/*.md`

## 5. Plan sections, then select skills

Follow the protocol in `SKILLS.md` section "Selection protocol". Write the plan to
`.agent/ACTIVE_SKILLS.md` BEFORE installing anything, then install per section:

```bash
node .agent/.skills-source/scripts/install.mjs --platform <platform> --skills <a,b> --section "<section>" --target .
```

## 6. Build (or improve an existing project)

- **New project**: build one section at a time using only the skills installed for that section.
- **Existing project**: run `/analyse [full project | <section>]` or `/audit [full project | <section>]` (`shared-project-audit`) first to map the codebase and log a fix plan in `.agent/ACTIVE_SKILLS.md`, then use `/design [full project | <section>]` (`shared-redesign-and-refactor`) and section skills to upgrade one section at a time (or across every section sequentially with `full project`).

Run the quality gates (`.agent/rules/02-quality-gates.md`) before moving on.

Never install the whole library. Never use skills from another platform.
