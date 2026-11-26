---
name: web-responsive-layout
description: Mobile-first responsive layout system - container, grid, fluid type, spacing and breakpoints. Use when building or fixing page layout at any size. Not needed for single fixed-size components.
platform: web
sections: [layout, grid, navigation, any]
tags: [css, responsive, grid, tailwind]
requires: []
---

# Responsive Layout

## System
- Breakpoints: 360 (base) / 768 / 1024 / 1440. Write base styles for mobile, enhance upward.
- Container: `width: min(100% - 2*var(--gutter), var(--container-max)); margin-inline: auto;` Gutter 16px mobile, 24px tablet, 32px desktop.
- Section rhythm: one `--section-space` token (e.g. `clamp(64px, 10vw, 160px)`).
- Fluid type: `font-size: clamp(min, preferred, max)` from the type scale tokens.
- Grid: CSS Grid with `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` for card sets; 12-col grid only for editorial layouts.
- Units: `svh/dvh` for full-height, `rem` for type, `ch` for measure, `%`/`fr` for layout. Avoid fixed widths.
- Media: `aspect-ratio`, `object-fit`, `max-width: 100%`. Reserve space to prevent CLS.

## Patterns
- Navigation: inline links >= 768px, sheet/drawer below; trap focus in the drawer; close on route change.
- Hover styles only inside `@media (hover: hover)`.
- Tables/code scroll inside their own `overflow-x: auto` wrapper; the page never scrolls sideways.

## Checklist
- [ ] No horizontal scroll at 360 / 768 / 1024 / 1440
- [ ] Tap targets >= 44px on touch layouts
- [ ] Type scales fluidly; line length 45-75ch
- [ ] No fixed pixel widths on containers; no `100vh` hacks
