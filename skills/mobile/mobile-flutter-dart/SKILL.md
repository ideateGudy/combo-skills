---
name: mobile-flutter-dart
description: Flutter 3 and Dart 3 app architecture, Riverpod/BLoC state, GoRouter navigation, const widget composition, and testing. Use when building Flutter mobile apps. Not for React Native/Expo projects.
platform: mobile
sections: [project-setup, ui, navigation, state, testing]
tags: [flutter, dart, riverpod, gorouter, mobile]
requires: []
---

# Flutter & Dart Engineering

Distilled from [evanca/flutter-ai-rules](https://github.com/evanca/flutter-ai-rules).

## When to use
- Building cross-platform mobile apps with Flutter 3+ and Dart 3+ (sound null safety).
- Structuring feature-first folders, state management (Riverpod or BLoC), GoRouter navigation, and widget/unit tests.

## When NOT to use
- React Native / Expo projects (use `mobile-expo-scaffold`, `mobile-navigation`).

## Steps
1. **Feature-first structure**: organize `lib/features/<feature>/{data,domain,presentation}/` and shared theme/tokens in `lib/core/theme/tokens.dart`.
2. **Compose small `const` widgets**: prefer small `StatelessWidget` / `ConsumerWidget` classes over helper methods returning `Widget` (keeps element tree rebuilds scoped). Add `const` constructors wherever possible.
3. **Virtualize lists & offload work**: always use `ListView.builder` / `SliverList` for dynamic lists; move heavy JSON parsing or crypto to `Isolate.run()`.
4. **Handle all async states**: use `AsyncValue` (Riverpod) or sealed state classes (`Loading`, `Data`, `Error`) so loading, empty, and error UIs are explicit.
5. **Respect safe areas & accessibility**: wrap screens in `SafeArea`, use `Semantics` labels on icon-only buttons, and keep touch targets >= 48x48dp.

## Code / commands
```bash
flutter pub get
dart analyze --fatal-infos
flutter test
flutter build apk --release   # or: flutter build ios --release
```

## Pitfalls
- Calling async work inside `build()` or forgetting `if (!mounted) return;` after `await` in `StatefulWidget`.
- Hard-coding colors/font sizes instead of `Theme.of(context).colorScheme` / `tokens.dart`.
- Using `ShrinkWrap: true` inside nested scrollables (causes O(n) layout; use `CustomScrollView` + slivers).

## Checklist
- [ ] `dart analyze` passes with zero errors or warnings
- [ ] `flutter test` passes for core logic and widget states (loading/empty/error)
- [ ] Design tokens live in `lib/core/theme/tokens.dart` (no magic colors/sizes)
- [ ] Dynamic lists use `.builder` / slivers; heavy work uses `Isolate.run`
- [ ] Safe areas, keyboard avoidance (`Scaffold.resizeToAvoidBottomInset`), and >= 48dp targets verified
