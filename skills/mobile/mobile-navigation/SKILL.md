---
name: mobile-navigation
description: Navigation with Expo Router - stacks, tabs, modals/sheets, deep links and auth gating. Use for any multi-screen mobile app.
platform: mobile
sections: [navigation, routing, auth-gating, deep-links]
tags: [expo-router, navigation, deep-links, tabs]
requires: []
---

# Mobile Navigation (Expo Router)

## Structure
```
app/
  _layout.tsx            root: providers, fonts, splash control
  (auth)/login.tsx       public group
  (app)/_layout.tsx      protected group (redirects if no session)
  (app)/(tabs)/_layout.tsx  tab bar: 3-5 tabs max
  (app)/(tabs)/index.tsx
  (app)/item/[id].tsx    detail route
  modal.tsx              presentation: "modal"
```

## Rules
- Tabs for top-level destinations (3-5), stack for drill-down, modal/sheet for focused tasks.
- Auth gating in the group layout with `<Redirect href="/login" />` based on session state; never render protected screens first and redirect after.
- Keep the splash screen visible until fonts + session are resolved (`SplashScreen.preventAutoHideAsync`).
- Typed routes on (`experiments.typedRoutes`); navigate with `router.push` / `<Link>`.
- Deep links: define `scheme` in `app.json`; test with `npx uri-scheme open <url> --ios|--android`.
- Respect the platform back gesture; never disable it without a confirmation reason.
- Header and tab bar styling come from tokens.

## Checklist
- [ ] Every screen reachable and back works on both platforms
- [ ] Unauthenticated users never see protected screens
- [ ] Deep link opens the correct screen cold and warm
- [ ] Tab count <= 5; touch targets >= 44pt/48dp
