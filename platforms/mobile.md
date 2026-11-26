# Platform: MOBILE

**Default stack**: React Native with Expo (SDK latest), Expo Router, TypeScript strict, EAS for builds.
Use bare React Native only if a required native module is unavailable in Expo.

**Folders**
```
app/                 Expo Router routes
src/components/      UI + sections
src/theme/tokens.ts  design tokens
src/lib/             api, storage, helpers
assets/              fonts, images, video
```

**Allowed skills**: `mobile-*`, `shared-*`.
**Forbidden**: DOM libraries (GSAP, Lenis, ScrollTrigger), CSS-only techniques, `window`/`document` APIs, web-only packages.
**Targets**: 60fps, cold start < 2s on mid-range devices, touch targets >= 44pt/48dp, tested on iOS + Android.
