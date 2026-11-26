# 06 - Media & Assets

- **Source files** (raw, heavy) live in `reference/` and are NOT shipped. Add `reference/` to `.gitignore` or use Git LFS.
- **Shipped files** live in `public/` (web) or `assets/` (mobile/desktop), already optimized.
- Naming: `<section>-<subject>.<ext>`, mobile variant `<name>-mobile.<ext>`, poster `<name>-poster.jpg`.
- Video: no audio track unless needed; H.264 `yuv420p`, `+faststart`; always provide a poster and a mobile variant.
  Scroll-scrubbed video uses all-intra encoding (see `web-scroll-scrubbed-video`).
- Images: AVIF/WebP with fallback, explicit `width`/`height` (no layout shift), `sizes` for responsive.
- Fonts: WOFF2 only, subset, max 2 families, `font-display: swap`.
- Keep each shipped asset within budget (hero image <= 200KB, video desktop <= 15MB, mobile <= 6MB unless the user approves).
- Do not hotlink third-party media. Respect licenses; record sources in `assets/CREDITS.md` if required.
