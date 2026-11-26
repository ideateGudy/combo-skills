---
name: mobile-expo-scaffold
description: Scaffold a React Native app with Expo, Expo Router, TypeScript and EAS. Use once at the start of a mobile project. Not for existing apps or bare native projects.
platform: mobile
sections: [setup]
tags: [expo, react-native, expo-router, typescript, eas]
requires: []
---

# Expo Scaffold

## Commands
```bash
npx create-expo-app@latest . --template default      # Expo Router + TypeScript
npx expo install expo-secure-store expo-haptics react-native-safe-area-context
npx expo start
```

## Then
1. Folders per `.agent/rules/platform-mobile.md`: `app/`, `src/components`, `src/theme/tokens.ts`, `src/lib`, `assets/`.
2. `tsconfig` strict + path alias `@/*`. Lint + format scripts.
3. Theme: tokens in `src/theme/tokens.ts` (colors, spacing, radius, typography); a `useTheme()` hook supporting light/dark.
4. Fonts via `expo-font`/`@expo-google-fonts/*`; splash and icon in `app.json`.
5. `eas init` and `eas build:configure` when the user is ready to build binaries. Secrets via EAS env, never committed.
6. Run on iOS simulator and Android emulator once before building features; commit `chore: scaffold`.

## Rules
- Prefer Expo SDK modules over community native modules; use dev builds (`expo-dev-client`) only if a native module requires it.
- Use `SafeAreaProvider` at the root and respect insets everywhere.

## Checklist
- [ ] App boots on iOS and Android
- [ ] Strict TS, alias, lint working
- [ ] Theme tokens + dark mode switch in place
- [ ] No web-only packages installed
