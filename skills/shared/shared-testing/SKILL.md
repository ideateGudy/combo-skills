---
name: shared-testing
description: Testing strategy and setup per platform - Vitest + Playwright (web, desktop UI), Jest + React Native Testing Library + Maestro (mobile). Use for sections with logic, forms or flows. Skip for throwaway prototypes.
platform: shared
sections: [testing, verification, ci]
tags: [vitest, playwright, jest, maestro, testing, ci]
requires: []
---

# Testing

## Pyramid
1. **Unit** (many): pure logic, schemas, reducers, utilities.
2. **Component** (some): behavior through the UI, not implementation details.
3. **E2E** (few): the critical flows only (signup, checkout, core task).

## Tooling
| Platform | Unit/Component | E2E |
|---|---|---|
| Web | Vitest + Testing Library | Playwright (chromium + webkit, mobile viewport project) |
| Desktop (Tauri/Electron UI) | Vitest + Testing Library | Playwright (Electron supported) / WebdriverIO (Tauri) |
| Mobile (Expo/RN) | Jest (`jest-expo`) + React Native Testing Library | Maestro flows (`maestro test flows/`) |
| Mobile (Flutter) | `flutter_test` (unit + widget tests) | `integration_test` / Patrol |
| Backend (NestJS/Express) | Vitest or Jest + `supertest` (HTTP + DB integration) | Critical API flow specs against test DB |

## Rules
- Test behavior a user can observe; query by role/label, not by class or test id (test id only as last resort).
- Every bug fix gets a regression test first.
- Mock the network at the boundary (MSW); never mock your own components.
- Visual/animation sections (scroll video, parallax): assert structure and fallbacks (reduced motion, poster present), then verify motion manually on real devices.
- CI runs typecheck + lint + unit + build on every PR; E2E on main or nightly.
- Keep tests deterministic: no real time, randomness or network.

## Checklist
- [ ] Critical flow has one E2E test
- [ ] Logic-heavy modules have unit tests
- [ ] CI runs the suite and blocks failing PRs
