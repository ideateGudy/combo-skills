# 02 - Quality Gates (Definition of Done per section)

**All platforms**
- [ ] Typecheck, lint, test suite, and production build pass with zero errors
- [ ] Comprehensive tests written for the section (unit + component/integration for logic, edge cases, loading/empty/error states; E2E for critical flows)
- [ ] No console errors or warnings at runtime
- [ ] No hard-coded colors/sizes/spacing (tokens only)
- [ ] All states handled: loading, empty, error, success
- [ ] Section checklist in `DESIGN.md` section 5 is satisfied
- [ ] The skill's own checklist is satisfied
- [ ] No dead links, no placeholder copy, no TODOs left in shipped UI

**Web**
- [ ] Verified at 360, 768, 1024, 1440 widths; no horizontal scroll
- [ ] Keyboard navigable; visible focus; semantic landmarks and heading order
- [ ] Lighthouse targets on the built site: Performance >= 90, Accessibility >= 95, SEO >= 95 (public sites)
- [ ] `prefers-reduced-motion` fallback works

**Mobile**
- [ ] Verified on smallest and largest target device sizes, iOS and Android
- [ ] Safe areas, keyboard avoidance, touch target sizes OK
- [ ] Animations run at 60fps (no JS-thread animation)

**Desktop**
- [ ] Verified at minimum and large window sizes; window state restores
- [ ] Keyboard shortcuts and menu actions work; focus order logical
- [ ] Renderer has no direct Node access; IPC inputs validated
