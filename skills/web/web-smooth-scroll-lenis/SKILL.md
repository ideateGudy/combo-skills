---
name: web-smooth-scroll-lenis
description: Site-wide smooth scrolling with Lenis, synced to GSAP ScrollTrigger. Use when the user wants an inertial, premium scroll feel. Not for docs/accessibility-first sites or pages with many nested scroll containers.
platform: web
sections: [global-scroll, layout]
tags: [lenis, smooth-scroll, gsap]
requires: []
---

# Lenis Smooth Scroll

## Setup
```bash
npm i lenis
```
```ts
// src/lib/lenis.ts  (client only)
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initLenis() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(raf); lenis.destroy(); };
}
```
Call `initLenis()` once in a root client component's `useEffect` and return its cleanup.

## Rules
- One scroll system only. If GSAP ScrollTrigger is used, Lenis must drive it through the ticker as above.
- Disable for reduced motion. Keep native touch scrolling on mobile unless the user asks otherwise.
- Nested scrollable areas (modals, code blocks, maps): add `data-lenis-prevent`.
- Anchor links: use `lenis.scrollTo(target, { offset })`, not `scrollIntoView`.
- Stop Lenis (`lenis.stop()`) while a modal/menu is open; resume on close.

## Checklist
- [ ] Single Lenis instance, destroyed on unmount
- [ ] ScrollTrigger synced (`lenis.on("scroll", ScrollTrigger.update)`) and `lagSmoothing(0)` set
- [ ] Reduced-motion users get native scroll
- [ ] Modals and nested scrollers do not fight the smooth scroll
