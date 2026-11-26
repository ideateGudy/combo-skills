---
name: mobile-reanimated-gestures
description: 60fps UI-thread animation and gestures with react-native-reanimated and gesture-handler - sheets, swipe, drag, shared transitions. Use for gestures or complex animation. Not for simple fades handled by built-ins.
platform: mobile
sections: [gestures, transitions, bottom-sheet, swipe, drag]
tags: [reanimated, gesture-handler, animation, worklets]
requires: []
---

# Reanimated + Gestures

## Setup
```bash
npx expo install react-native-reanimated react-native-gesture-handler react-native-worklets
```
Wrap the root in `GestureHandlerRootView`. Keep the Reanimated babel plugin last in `babel.config.js` (Expo handles it by default).

## Pattern
```tsx
const x = useSharedValue(0);
const pan = Gesture.Pan()
  .onChange((e) => { x.value += e.changeX; })
  .onEnd(() => { x.value = withSpring(0, { damping: 18, stiffness: 180 }); });
const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
return <GestureDetector gesture={pan}><Animated.View style={style} /></GestureDetector>;
```

## Rules
- Animate on the UI thread: shared values, `useAnimatedStyle`, `withTiming/withSpring`. No `setState` per frame.
- Animate `transform` and `opacity`; avoid animating layout props (use layout animations: `entering`, `exiting`, `LinearTransition`).
- Add haptics on confirm/threshold (`expo-haptics`), sparingly.
- Provide a reduced-motion path with `useReducedMotion()`.
- Springs for gestures/physical motion, timing (200-350ms) for UI state changes.
- For bottom sheets prefer `@gorhom/bottom-sheet` instead of hand-rolling.

## Checklist
- [ ] No JS-thread animation work during gestures; 60fps on a mid-range Android
- [ ] Gestures cancel/finish cleanly (no stuck states)
- [ ] Reduced-motion path implemented
- [ ] Works with safe areas and the keyboard open
