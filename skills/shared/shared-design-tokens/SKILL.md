---
name: shared-design-tokens
description: Create the single source of design tokens (color, type, spacing, radius, shadow, motion) with semantic layers and dark mode, exported as CSS variables (web/desktop) or a theme object (mobile). Use at the start of any UI project.
platform: shared
sections: [design-system, foundation, theming]
tags: [tokens, theme, css-variables, dark-mode]
requires: []
---

# Design Tokens

## Layers
1. **Primitive**: raw values (`--blue-500`, `--space-4`).
2. **Semantic**: purpose (`--color-bg`, `--color-text`, `--color-accent`, `--color-border`, `--color-danger`).
3. **Component** (optional): `--button-radius`.
Components only consume semantic/component tokens.

## Required token groups
- Color: neutral ramp (9-11 steps), primary, accent, semantic states; light + dark mappings.
- Type: families (max 2), scale (ratio 1.2-1.333), weights (max 3), line-heights, letter-spacing.
- Space: 4-based scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128) + `--section-space`.
- Radius, border widths, shadows/elevation (3-4 levels), z-index scale.
- Motion: durations (150/250/400/800ms), easings (`ease-out`, `ease-in-out`, spring presets).

## Output
**Web / desktop UI** `src/styles/tokens.css`
```css
:root { --color-bg: #0b0b0c; --color-text: #f4f4f2; --space-4: 1rem; --ease-out: cubic-bezier(.22,1,.36,1); }
@media (prefers-color-scheme: light) { :root { --color-bg: #fafaf8; --color-text: #111; } }
```
**Mobile** `src/theme/tokens.ts`: exported `light`/`dark` objects + `spacing`, `radius`, `type`; consumed through `useTheme()`.

Derive values from the Design Brief in `DESIGN.md`; write the chosen values back into the brief.

## Checklist
- [ ] Contrast of every text/background pair >= 4.5:1 (3:1 large)
- [ ] Dark/light mappings both defined (or explicitly single-theme)
- [ ] Components contain no raw hex/px
- [ ] Tokens documented in the Design Brief
