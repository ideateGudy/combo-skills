---
name: web-seo-metadata
description: SEO and metadata for public websites - titles, descriptions, Open Graph, JSON-LD, sitemap, robots, semantic headings. Use for marketing and content sites. Not for internal tools behind login.
platform: web
sections: [head, seo, sitemap]
tags: [seo, metadata, open-graph, json-ld, sitemap]
requires: []
---

# SEO & Metadata

## Rules
- Every route has a unique `<title>` (<= 60 chars) and meta description (<= 155 chars) written for humans.
- Next.js: use the Metadata API (`export const metadata` / `generateMetadata`), `metadataBase`, canonical URLs.
- Open Graph + Twitter card with a 1200x630 image per key page.
- Structured data (JSON-LD) matching the page: `Organization`, `WebSite`, `Article`, `Product`, `FAQPage`, `LocalBusiness`.
- `app/sitemap.ts` and `app/robots.ts` (or static files); exclude private routes.
- Semantic outline: one `h1`, logical `h2/h3`; descriptive link text; `lang` on `<html>`.
- Performance and accessibility are SEO: meet the Lighthouse targets in `rules/02`.
- Favicons: `.ico`, 32px PNG, 180px Apple touch icon, manifest if PWA.

## Checklist
- [ ] Unique title/description per page; canonical set
- [ ] OG image renders in a share debugger
- [ ] sitemap.xml and robots.txt reachable
- [ ] JSON-LD validates (Rich Results Test)
- [ ] Lighthouse SEO >= 95
