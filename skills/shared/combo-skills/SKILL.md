---
name: combo-skills
description: Section-scoped skill router and command hub for building new apps or upgrading existing projects. Use when the user invokes /combo-skills (analyse, audit, design, build, list, install).
platform: shared
sections: [workflow, audit, design, build]
tags: [router, commands, slash-command, workflow]
requires: []
user-invocable: true
argument-hint: "[analyse | audit | design | build | list | install] [full project | <section>]"
---

# `/combo-skills` Command Hub

Routes `/combo-skills <command> [target]` to the right section-scoped workflow and skills.

## Commands

| Command | Action | Target / Scope |
|---|---|---|
| `analyse [full project \| <section>]` | Alias `analyze`. Install & run `shared-project-audit` in **read-only** Mode 1 (stack, module map, complexity/perf hotspots). | Whole repo or named section |
| `audit [full project \| <section>]` | Install & run `shared-project-audit` in Mode 2 (architecture, security, perf, a11y, `DESIGN.md` compliance) and log a section fix plan in `.agent/ACTIVE_SKILLS.md`. | Whole repo or named section |
| `design [full project \| <section>]` | Install & run `shared-redesign-and-refactor` + `shared-design-tokens`. Lock `DESIGN.md` Brief and upgrade UI/UX, tokens, and architecture section-by-section. | `full project` runs the section loop across every section sequentially |
| `build <description>` | Decompose into sections in `.agent/ACTIVE_SKILLS.md`, install 1–2 skills per section, build, verify, and commit per section. | New feature or project |
| `list` | Run `node .agent/.skills-source/scripts/install.mjs --list --platform <p>` and show available skills. | Current platform |
| `install <a,b> --section <name>` | Install the requested skills into `.agent/skills/` for `<name>` (respecting platform firewall). | Named section |

## Routing
- **No argument**: present the Commands table above and ask which command to run. Never auto-edit files.
- **With argument**:
  1. Ensure `.agent/rules/` and `DESIGN.md` exist (if not, run `--baseline` first).
  2. Install only the skill(s) needed for the command/section using `node .agent/.skills-source/scripts/install.mjs`.
  3. Read only the installed `SKILL.md` for the active section and execute it.
  4. Verify with `.agent/rules/02-quality-gates.md` before marking done.

## Checklist
- [ ] Correct subcommand routed (`analyse` / `audit` / `design` / `build` / `list` / `install`)
- [ ] Only the skills needed for the active section are installed and read
- [ ] Platform firewall respected
- [ ] `.agent/ACTIVE_SKILLS.md` updated
