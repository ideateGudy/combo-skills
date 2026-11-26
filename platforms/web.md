# Platform: WEB

**Default stack**: Next.js (App Router) + TypeScript + Tailwind or CSS variables. Use Vite + React for a pure SPA/landing,
Astro for content-heavy static sites. Pick once, record it in `docs/decisions.md`.

**Folders**
```
src/app/                routes
src/components/sections/ HeroSection, ShowcaseSection ...
src/components/ui/      buttons, inputs, primitives
src/lib/                helpers (scrollVideo.ts, api.ts ...)
src/styles/tokens.css   design tokens
public/videos|images|fonts   shipped media
reference/              raw source media (not shipped)
```

**Allowed skills**: `web-*`, `shared-*`.
**Forbidden**: `mobile-*`, `desktop-*`, React Native packages, Node-only APIs in client code.
**Breakpoints**: 360 / 768 / 1024 / 1440. Mobile-first.
**Targets**: Lighthouse Perf >= 90, A11y >= 95, SEO >= 95.
