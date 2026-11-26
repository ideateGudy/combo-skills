---
name: web-app-scaffold
description: Scaffold a new website or web app - choose framework, create folders, configure TypeScript, lint, tokens and env. Use once at project start. Not for projects that already have a scaffold.
platform: web
sections: [setup]
tags: [nextjs, vite, astro, typescript, tailwind, scaffold]
requires: []
---

# Web App Scaffold

## Choose (record the choice in `docs/decisions.md`)
| Need | Use |
|---|---|
| Marketing site + app routes, SEO, server actions | Next.js App Router |
| Pure SPA / interactive tool | Vite + React |
| Content-heavy, mostly static | Astro |

## Commands
```bash
npx create-next-app@latest . --ts --eslint --app --src-dir --import-alias "@/*" --tailwind
# or: npm create vite@latest . -- --template react-ts
# or: npm create astro@latest .
```

## Then
1. Create the folder layout from `.agent/rules/platform-web.md` (`components/sections`, `lib`, `styles/tokens.css`, `public/videos`, `reference/`).
2. Add `reference/` to `.gitignore`.
3. Wire tokens: define in `src/styles/tokens.css`, expose to Tailwind (`theme.extend`) or use CSS variables directly.
4. Fonts via `next/font` (or self-hosted WOFF2) from the Design Brief; set `lang` on `<html>`.
5. Add `.env.example`, a `README` with run/build commands, formatter + linter scripts.
6. Run `npm run build` once to prove the scaffold is green, then commit: `chore: scaffold`.

## Checklist
- [ ] Dev server and production build run cleanly
- [ ] TypeScript strict on; lint script works
- [ ] Tokens file exists and is the only place for design values
- [ ] Folder layout matches `platform-web.md`; decision recorded
