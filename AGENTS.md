# AGENTS.md - Operating Contract

You build software with a **section-scoped skill system**. These rules are binding.

## Read order (every session)
1. `AGENTS.md` (this file)
2. `DESIGN.md` - design law. Fill the **Design Brief** before building any UI.
3. `SKILLS.md` - selection protocol and registry.
4. `.agent/rules/*.md` - engineering rules. Short. Read them all once per session.
5. `.agent/rules/platform-<platform>.md` - stack defaults and firewall for this project.
6. ONLY the `SKILL.md` of skills listed for the section currently in progress.

## Non-negotiables
- **One platform per project** (web, mobile or desktop). Skills from other platforms are forbidden
  unless the user approved `--allow-cross` and it is recorded in `.agent/ACTIVE_SKILLS.md`.
- **Section by section.** Decompose the app into sections, build one at a time, verify, then continue.
- **Minimal loading.** At most 3 skills per section (prefer 1-2). Do not open, read or apply any skill that is
  not listed in `.agent/ACTIVE_SKILLS.md` for the current section.
- **No skill fits? Say so,** continue with rules only. Never improvise by borrowing a skill from another platform.
- **Plan before install, install before build.** Record the plan in `.agent/ACTIVE_SKILLS.md`.
- **Design tokens only.** No hard-coded colors, font sizes or spacing outside the tokens file.
- **Verify before claiming done.** Run the checklist in `.agent/rules/02-quality-gates.md`.
- **Never fabricate** APIs, package names or versions. Check `package.json`, docs or run the command.

## Section loop
```
PLAN     list sections -> pick skills (SKILLS.md) -> write .agent/ACTIVE_SKILLS.md
INSTALL  node .agent/.skills-source/scripts/install.mjs --platform <p> --skills <a,b> --section "<name>" --target .
BUILD    read installed SKILL.md(s) -> implement -> follow DESIGN.md
VERIFY   quality gates (rules/02) + the skill's own checklist
LOG      mark section done in .agent/ACTIVE_SKILLS.md, commit with a conventional message
```

## Adding a skill later
```bash
git -C .agent/.skills-source pull
node .agent/.skills-source/scripts/install.mjs --list --platform <p>
node .agent/.skills-source/scripts/install.mjs --platform <p> --skills <name> --section "<section>" --target .
```

## Commands (new or existing projects)
When the user invokes a command (optionally scoped with `full project` or `<section>`), install and follow the matching skill:
- **`/analyse [full project | <section>]`** (or `/analyze`): install `shared-project-audit` — inspect the target read-only (stack, architecture, bottlenecks) and report findings before editing.
- **`/audit [full project | <section>]`**: install `shared-project-audit` — audit architecture, security, performance, a11y, and `DESIGN.md` compliance, then write a section-by-section fix plan to `.agent/ACTIVE_SKILLS.md`.
- **`/design [full project | <section>]`**: install `shared-redesign-and-refactor` — fill/update `DESIGN.md` Design Brief and upgrade UI/UX, tokens, and component architecture. With **`full project`**, list all sections in `.agent/ACTIVE_SKILLS.md` and run the section loop across every section sequentially until the entire project is upgraded.
