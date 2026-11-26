# 04 - Accessibility

- Semantic HTML first (`header`, `nav`, `main`, `section`, `footer`, `button`, `a`). One `h1` per page, no skipped levels.
- Everything interactive is keyboard reachable, has a visible `:focus-visible` style and an accessible name.
- Contrast per `DESIGN.md`. Do not convey meaning by color alone.
- Images: meaningful `alt`, or `alt=""` when decorative. Videos: no autoplay with sound; provide a static
  poster/fallback; transcripts or captions when there is speech.
- Honor reduced motion. Pinned/scrubbed scroll sections must degrade to static content.
- Forms: visible labels, error text linked via `aria-describedby`, errors announced, no placeholder-only labels.
- Mobile: set accessibility labels/roles/hints; support dynamic type; 44pt/48dp targets.
