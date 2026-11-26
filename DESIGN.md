# DESIGN.md - Design Law

Every UI decision must comply with this file. Fill in the **Design Brief** first. If a request conflicts with
this file, follow this file and tell the user why.

---

## 1. Design Brief (FILL BEFORE BUILDING - the agent writes this, the user may edit)

| Field | Value |
|---|---|
| Product / purpose | |
| Audience | |
| Tone (exactly 3 adjectives) | |
| Visual references (2-3 URLs or descriptions) | |
| Primary color / accent color | |
| Display font / text font (max 2 families) | |
| Signature element (the one memorable thing) | |
| Light / dark / both | |

If the user gave no brief, the agent proposes one in 5 lines, states assumptions, and proceeds.

## 2. Hard rules (all platforms)

**Tokens**
- All color, type, spacing, radius, shadow and motion values live in ONE tokens file
  (web: `src/styles/tokens.css`, mobile: `src/theme/tokens.ts`, desktop: same as its UI layer).
- No raw hex, `px` or magic numbers in components. Reference tokens.

**Typography**
- Max 2 font families. One modular scale (ratio 1.2-1.333). Max 3 weights.
- Body text 16px/1rem minimum on web, 15-17pt on mobile. Line-height 1.4-1.7 for body, 1.05-1.2 for display.
- Line length 45-75 characters.

**Color**
- 1 primary, 1 accent, a neutral ramp (9-11 steps), semantic colors (success, warning, danger, info).
- Contrast: 4.5:1 body text, 3:1 large text and UI boundaries. Never rely on color alone for meaning.

**Spacing & layout**
- 4/8 point grid. Spacing tokens only. One clear focal point per section. One primary CTA per viewport.
- Mobile-first. Content must work from 360px wide. No horizontal scroll.
- Consistent vertical rhythm between sections (one section-spacing token, not ad-hoc values).

**States**
- Every interactive element implements: default, hover (pointer only), focus-visible, active, disabled,
  loading, error. Empty states and error states are designed, not left blank.

**Motion**
- Motion explains hierarchy or state; it is never decoration-only.
- UI transitions 150-300ms, section reveals 400-800ms, hero/story 600-1200ms. Use ease-out for entrances,
  ease-in for exits.
- Animate `transform` and `opacity` only. Never animate layout properties (width, height, top, left, margin).
- Respect `prefers-reduced-motion` (web) / reduce-motion setting (mobile, desktop): provide a static fallback.

**Imagery & media**
- Real, relevant, high-quality media. No lorem ipsum, no stock-photo filler, no emoji as icons.
- One icon set per project, consistent stroke and size grid.
- Every image has alt text (or is explicitly decorative).

**Content**
- Write real copy that matches the tone. Headlines state a benefit or a point of view, not a category name.

## 3. Anti-patterns (do NOT ship these)
- Default purple-to-blue gradients on white; generic "AI SaaS" look.
- Three identical feature cards in a row as the only layout idea, repeated on every page.
- Everything centered, everything the same size, no hierarchy.
- Glassmorphism / blur / glow on every surface.
- System-font-only typography with no deliberate hierarchy.
- Stock icon pile (rocket, sparkle, shield) used as decoration.
- Dead buttons, placeholder links, `href="#"`.
- Carousels hiding primary content; autoplay with sound; modal on load.

## 4. Platform addenda

**Web**
- Sections are full-width bands with an inner container (max 1200-1440px). Use `svh` units, not `vh`, for
  full-height sections. Navigation collapses at <= 768px. Hover effects only inside `@media (hover: hover)`.

**Mobile**
- Touch targets >= 44x44pt (iOS) / 48x48dp (Android). Respect safe areas and the keyboard.
- Follow platform conventions (back gesture, tab bar, sheets). Primary actions in the thumb zone.
- Haptics for confirmations only. 60fps animation on the UI thread (no JS-thread-driven animation).

**Desktop**
- Keyboard first: every action reachable by shortcut, visible focus, logical tab order.
- Native menu bar, window state persistence, resizable layouts down to the minimum window size.
- Higher information density than web/mobile; hover and right-click are first-class.

## 5. Section design checklist (run per section before marking done)
- [ ] Uses only tokens; no magic numbers
- [ ] One focal point, one primary action
- [ ] All states designed (hover/focus/active/disabled/loading/empty/error)
- [ ] Correct at 360 / 768 / 1024 / 1440 (web) or smallest + largest device (mobile) or min window size (desktop)
- [ ] Contrast and focus visibility verified
- [ ] Motion limited to transform/opacity, reduced-motion fallback present
- [ ] No anti-patterns from section 3
