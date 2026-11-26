# 03 - Performance

- Budget (web, per page): JS <= 200KB gzip initial, LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Ship the smallest asset that looks right: responsive images (AVIF/WebP), subset fonts (`font-display: swap`),
  compressed video with a mobile variant.
- Defer non-critical JS; code-split heavy libraries (GSAP plugins, charts, maps) to the sections that use them.
- Animate `transform`/`opacity`; avoid layout thrash; batch DOM reads/writes.
- Never autoplay unmuted media. Lazy-load below-the-fold media; preload only the LCP asset.
- Mobile apps: keep lists virtualized, avoid re-renders (memoize with intent), animate on the UI thread.
- Measure, do not guess: Lighthouse / DevTools Performance / Flipper / platform profilers.
