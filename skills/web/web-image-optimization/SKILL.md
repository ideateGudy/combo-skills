---
name: web-image-optimization
description: Optimized images for the web - AVIF/WebP, responsive sizes, LCP priority, blur placeholders, SVG usage. Use for hero images, galleries and cards. Not for video (see scroll-scrubbed-video) or sites with no images.
platform: web
sections: [hero, gallery, cards, media]
tags: [images, avif, webp, lcp, next-image]
requires: []
---

# Image Optimization

## Rules
- Use the framework image component (`next/image`, Astro `<Image>`) so formats/sizes are generated automatically.
- Always set `width` and `height` (or `fill` inside an aspect-ratio box). `sizes` must reflect the real rendered width, e.g. `(min-width: 1024px) 33vw, 100vw`.
- Exactly one LCP image per page gets `priority` (or `fetchpriority="high"`); everything else lazy.
- Source images: export at 2x the largest displayed size, never more. Quality 70-80 for AVIF/WebP.
- Provide `placeholder="blur"` or a dominant-color background for large images.
- Logos/icons: inline or file SVG (optimize with SVGO). No emoji icons.
- `alt` text describes the content or purpose; `alt=""` if decorative.

## Commands (when no framework optimizer exists)
```bash
npx sharp-cli -i reference/photo.jpg -o public/images/photo-1600.avif resize 1600 --format avif --quality 60
```

## Checklist
- [ ] No image over its budget (hero <= 200KB, card <= 80KB)
- [ ] CLS = 0 (dimensions reserved)
- [ ] Only the LCP image is prioritized
- [ ] All images have correct `alt`
