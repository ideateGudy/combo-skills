---
name: web-scroll-scrubbed-video
description: Scroll-scrubbed video driven bidirectionally by GSAP ScrollTrigger, with FFmpeg all-intra (every frame a keyframe) encoding. Use for hero or showcase sections where scrolling up and down must play video frame-by-frame. Not for autoplay or looping background video.
platform: web
sections: [hero, showcase, storytelling, product-reveal]
tags: [gsap, scrolltrigger, ffmpeg, video, scroll, all-intra]
requires: []
---

# Scroll-Scrubbed Video (GSAP ScrollTrigger + FFmpeg all-intra)

## Contract (project convention)

The landing page uses **two scroll-scrubbed videos** driven bidirectionally by GSAP `ScrollTrigger`:
1. **Hero (`HeroSection`)**: `public/videos/hero-construction.mp4` (+ mobile) from `reference/hero-raw.mp4`
2. **Architectural Showcase (`ScrollVideoSection`)**: `public/videos/section-showcase.mp4` (+ mobile) from `reference/section-raw.mp4`

Because scrolling **up** seeks backward through each video frame-by-frame, **every single frame must be an
Intra-frame (keyframe / `I`-frame)**. Standard inter-frame (`P` / `B`) compression causes severe backward-seek
stalls on browsers and mobile devices.

Adapt file names to the project; keep the rule: raw in `reference/`, encoded in `public/videos/`, one desktop file
and one `-mobile` file per video, plus a `-poster.jpg`.

## When to use
- Video progress must follow scroll position (forward and backward), usually inside a pinned full-screen section.

## When NOT to use
- Background loops or autoplay video (use a plain `<video autoplay muted loop playsinline>`).
- Pages where reduced-motion users are the primary audience (still supported via fallback, see below).

## Steps

1. **Check tools**: `ffmpeg -version` and `ffprobe -version` must work. If missing, tell the user to install FFmpeg
   (macOS `brew install ffmpeg`, Windows `winget install ffmpeg`, Linux `apt install ffmpeg`).
2. **Source**: place the raw file in `reference/` (keep it out of git or use LFS). Trim to 4-10 seconds; all-intra files
   are 5-10x larger than normal video, so length is the main size lever.
3. **Encode** (creates desktop, mobile and poster, then verifies every frame is an I-frame):
   ```bash
   node .agent/skills/web-scroll-scrubbed-video/scripts/encode-scroll-video.mjs \
     --in reference/hero-raw.mp4 --name hero-construction --out public/videos
   ```
   Options: `--width 1600 --fps 24 --crf 23` (desktop), `--mobile-width 720 --mobile-crf 26`.
4. **Add the helper**: copy `templates/scrollVideo.ts` to `src/lib/scrollVideo.ts` and
   `templates/ScrollVideoSection.tsx` to `src/components/sections/ScrollVideoSection.tsx`.
   Install deps: `npm i gsap` (ScrollTrigger is included in the free `gsap` package).
5. **Use it**:
   ```tsx
   <ScrollVideoSection
     desktopSrc="/videos/hero-construction.mp4"
     mobileSrc="/videos/hero-construction-mobile.mp4"
     poster="/videos/hero-construction-poster.jpg"
     scrollLength="+=300%">
     <h1 className="...">Headline over the video</h1>
   </ScrollVideoSection>
   ```
6. **Verify** (checklist below). Test on a real phone or at least Safari + Chrome mobile emulation.

## Why these FFmpeg flags
| Flag | Reason |
|---|---|
| `-g 1 -keyint_min 1` | GOP size 1: every frame is a keyframe |
| `-bf 0` | no B-frames |
| `-sc_threshold 0` | stop scene-cut logic from inserting different frame types |
| `-an` | no audio: smaller, and muted is required for autoplay-class behavior anyway |
| `-pix_fmt yuv420p` | widest hardware decode compatibility (iOS/Android) |
| `-movflags +faststart` | metadata at file start so seeking works before full download |
| `scale=W:-2` | keeps aspect ratio with an even height (required by yuv420p) |

Manual verification: `ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv=p=0 file.mp4`
must print only `I`.

## Runtime rules
- `<video muted playsinline preload="auto">`. No `autoplay`, no `loop`, no `controls`. Never call `play()` for playback;
  only set `currentTime`.
- Wait for `loadedmetadata` before reading `duration` or creating the trigger.
- Do not set `currentTime` while `video.seeking` is true; smooth the target (lerp) and write at most once per frame.
- Clamp time to `duration - 0.001` so the video never reaches `ended`.
- Pick the source with `matchMedia("(max-width: 768px)")` in JS (the `media` attribute on `<source>` is not reliable
  for `<video>`). Re-init when the query flips.
- iOS: do a muted `play().then(pause)` once after metadata to prime decoding.
- Pin with `pin: true`, `anticipatePin: 1`, `invalidateOnRefresh: true`. Do not nest a pinned element inside a parent
  that has `transform`, `filter` or `overflow: hidden`.
- With Lenis, connect it to ScrollTrigger (see `web-smooth-scroll-lenis`); do not run two scroll systems.
- `prefers-reduced-motion`: do not pin or scrub; show the poster (or a middle frame) and the section content statically.
- Cleanup on unmount: kill the trigger, remove the ticker callback and listeners (React Strict Mode runs effects twice).

## Pitfalls
- Using a normal H.264 export: backward scroll stutters or freezes. Always re-encode with the script.
- 1080p/60fps all-intra: files become huge. Prefer 1280-1600px wide at 24fps; budget desktop <= 15MB, mobile <= 6MB.
- Setting `video.currentTime` from inside a scrubbed `gsap.to` tween on every tick causes seek storms; use the lerp loop.
- Using `100vh` on mobile: use `100svh` so the pinned section does not jump with the browser UI.
- Loading both videos eagerly: set `preload="none"` for off-screen showcase videos and switch to `auto` when near.

## Checklist
- [ ] Raw in `reference/`, encoded in `public/videos/` (desktop, `-mobile`, `-poster.jpg`)
- [ ] ffprobe shows only `I` frames for both files (encode script prints PASS)
- [ ] File sizes within budget
- [ ] Scrolling up is as smooth as scrolling down on desktop and a real phone
- [ ] No `autoplay`/`loop`/`controls`; video never hits `ended`
- [ ] Reduced-motion fallback works
- [ ] ScrollTrigger and ticker cleaned up on unmount; no console errors
- [ ] Text over video has sufficient contrast (overlay gradient if needed)
