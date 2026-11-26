---
name: web-gsap-scrolltrigger
description: GSAP + ScrollTrigger for scroll-triggered reveals, pinned sections, parallax, horizontal scroll and text splitting. Use for scroll-linked animation that is not video scrubbing. Not for simple CSS transitions.
platform: web
sections: [reveals, pinned-sections, parallax, horizontal-scroll, text-animation]
tags: [gsap, scrolltrigger, animation, scroll]
requires: []
---

# GSAP ScrollTrigger

## When to use
Scroll-triggered entrances, pinned storytelling, parallax layers, horizontal galleries, staggered text.
If the thing being animated is a video tied to scroll, use `web-scroll-scrubbed-video` instead.

## Setup
```bash
npm i gsap @gsap/react      # all GSAP plugins incl. ScrollTrigger and SplitText are in the free package
```
```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);   // register once, in a client-only module
```

## Patterns
**Reveal (batch for many elements)**
```ts
useGSAP(() => {
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 85%", once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 }),
  });
}, { scope: containerRef });
```
**Pinned storytelling**
```ts
gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=200%", pin: true, scrub: 0.6, anticipatePin: 1 } })
  .from(".step-1", { opacity: 0, y: 40 }).to(".step-1", { opacity: 0 }).from(".step-2", { opacity: 0, y: 40 });
```
**Responsive + reduced motion**
```ts
const mm = gsap.matchMedia();
mm.add({ desktop: "(min-width: 769px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
  if (ctx.conditions!.reduce) return;          // static layout
  /* animations here; auto-reverted when the query stops matching */
});
```

## Rules
- Use `useGSAP` (React) or `gsap.context()` so everything is reverted on unmount.
- Animate `transform` and `opacity` only. Set initial state with `fromTo`/CSS to avoid a flash.
- Call `ScrollTrigger.refresh()` after fonts/images/layout shift. `markers: true` only in dev.
- Do not pin inside parents with `transform`/`overflow: hidden`. Use `100svh`.
- Keep scrub values small (0.3-1). Prefer `once: true` reveals; do not re-animate on every scroll.
- Lazy-import GSAP plugins in sections that need them if the bundle budget is tight.

## Checklist
- [ ] Cleanup via useGSAP/context; no duplicated triggers after route changes
- [ ] Reduced-motion fallback renders content statically
- [ ] No layout-property animation; no CLS
- [ ] Works at 360px and 1440px; refresh called after assets load
