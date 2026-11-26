---
name: web-hero-section
description: Compose the first viewport of a website - headline hierarchy, one primary CTA, supporting media and LCP-safe loading. Use for any hero or above-the-fold section. For scroll-scrubbed hero video also use web-scroll-scrubbed-video.
platform: web
sections: [hero, above-the-fold]
tags: [hero, layout, copy, lcp]
requires: []
---

# Hero Section

## Structure (pick one composition, do not mix)
1. **Statement**: oversized headline, short subline, one CTA, minimal media. Best for confident brands.
2. **Split**: copy left, media right (stack on mobile, copy first). Best for products.
3. **Full-bleed media**: media fills `100svh`, text overlaid with a scrim. Best for visual/architecture brands.
4. **Scroll story**: pinned scrubbed media with text steps (use `web-scroll-scrubbed-video`).

## Rules
- Headline: states the benefit or a point of view, <= 12 words; sized with `clamp()` from tokens.
- Exactly one primary CTA plus at most one secondary (text link style).
- First viewport shows the product/outcome, not a logo wall. Trust signals go directly below.
- The LCP element (hero image or poster) is preloaded/`priority`; no layout shift; set dimensions.
- Overlay text on media needs a scrim to reach 4.5:1 contrast.
- Navigation is quiet: logo, 3-5 links, one CTA; collapses <= 768px.
- Entrance animation <= 800ms total; content visible without JS animation completing.

## Checklist
- [ ] One focal point, one primary CTA
- [ ] LCP asset optimized and prioritized; CLS = 0
- [ ] Correct at 360 / 768 / 1024 / 1440; `100svh` used
- [ ] Contrast verified over media; reduced-motion fallback
- [ ] Real copy and real media (no placeholders)
