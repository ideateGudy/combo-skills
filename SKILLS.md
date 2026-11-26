# SKILLS.md - Skill Selection Contract

## 0. Principle
Load the minimum. A skill is installed and read **only** when a section needs it. More skills in context means
worse output.

## 1. Platform firewall
| Project platform | Allowed skill prefixes |
|---|---|
| web | `web-*`, `shared-*` |
| mobile | `mobile-*`, `shared-*` |
| desktop | `desktop-*`, `shared-*` (add `web-*` only with user approval via `--allow-cross web`) |

Hard bans: DOM libraries (GSAP, Lenis, CSS scroll tricks) in mobile projects. Node-only APIs in the web
renderer. Mobile gesture libs in web projects.

## 2. Selection protocol
1. **Classify** the platform.
2. **Decompose** the request into sections (e.g. `hero`, `navigation`, `pricing`, `auth`, `settings`,
   `offline-sync`, `packaging`). Sections are units you can build and verify independently.
3. **Match** each section to the registry below using the *Use for sections* and *Pick when* columns.
4. **Budget**: max 3 skills per section, prefer 1-2. Max ~6 skills active in a whole project at the start.
5. **Tie-breakers** (in order): the more specific skill wins over the general one; the skill whose *Don't use when*
   is not triggered; the skill with fewer dependencies; ask the user only if two choices change the product.
6. **Record** the plan in `.agent/ACTIVE_SKILLS.md` (section -> skills -> one-line reason).
7. **Install just-in-time**, per section:
   `node .agent/.skills-source/scripts/install.mjs --platform <p> --skills <a,b> --section "<name>" --target .`
8. **Read only** the installed `SKILL.md` for the current section. Do not read other skills.
9. **Verify** with the skill's checklist plus `.agent/rules/02-quality-gates.md`.
10. **Remove** a skill that turned out unnecessary: `install.mjs --remove <name> --target .`

If nothing matches, state "no skill matched" and use the rules only.

## 3. Registry

### web
| Skill | Use for sections | Pick when | Don't use when |
|---|---|---|---|
| web-app-scaffold | project setup | starting a new site/app, choosing framework and folders | project already scaffolded |
| web-scroll-scrubbed-video | hero, showcase, storytelling | video must play forward AND backward with scroll (GSAP + FFmpeg all-intra) | video should just autoplay/loop, or user needs a background loop |
| web-gsap-scrolltrigger | reveals, pinned sections, parallax, horizontal scroll | scroll-linked or scroll-triggered animation that is not video scrubbing | simple CSS hover/fade is enough |
| web-smooth-scroll-lenis | global scroll feel | user wants smooth/inertial scrolling site-wide | heavy native scroll containers, accessibility-first docs sites |
| web-hero-section | hero, above the fold | composing headline/CTA/media for first viewport | hero is only a scrubbed video (use that skill, add this only for copy layout) |
| web-responsive-layout | any layout work | grids, container, fluid type, breakpoints | - |
| web-image-optimization | galleries, hero images, cards | any raster images, LCP image tuning | no images |
| web-forms-validation | contact, signup, checkout, newsletter | any form that submits data | static content only |
| web-seo-metadata | head/meta, sitemap | public marketing site or content site | internal tool behind login |

### mobile
| Skill | Use for sections | Pick when | Don't use when |
|---|---|---|---|
| mobile-expo-scaffold | project setup | new React Native app | already scaffolded or bare native project |
| mobile-navigation | routing, tabs, modals, deep links, auth gating | multi-screen app | single-screen app |
| mobile-reanimated-gestures | transitions, sheets, swipe, drag | gestures or 60fps animations | simple opacity/scale handled by built-ins |
| mobile-offline-storage | persistence, caching, sync | offline use, local DB, cached lists | pure online, no persistence needed |

### desktop
| Skill | Use for sections | Pick when | Don't use when |
|---|---|---|---|
| desktop-tauri-shell | app shell, native commands | small/fast app, Rust backend OK | needs full Node.js ecosystem in main process |
| desktop-electron-shell | app shell, native commands | needs Node APIs/native modules, team knows Electron | footprint matters most (prefer Tauri) |
| desktop-native-menus-shortcuts | menu bar, tray, shortcuts, command palette | any real desktop app | - |
| desktop-packaging-updates | installers, signing, auto-update, CI release | shipping to users | prototype only |

### shared
| Skill | Use for sections | Pick when | Don't use when |
|---|---|---|---|
| shared-design-tokens | design system foundation | start of any UI project | tokens already exist |
| shared-api-client | data layer | app talks to an HTTP API | no backend |
| shared-state-management | state | cross-section client state or server cache | trivial local state |
| shared-testing | verification | any section with logic, forms, flows | throwaway prototype |

## 4. Skill authoring rules
- `SKILL.md` has frontmatter: `name`, `description`, `platform`, `sections`, `tags`, `requires`.
- `description` is written as a trigger: what it does and when to use it. Under 300 characters.
- Body under 400 lines. Put scripts in `scripts/`, code templates in `templates/`.
- Every skill ends with a **Checklist** the agent can verify.
- Every skill must be listed in the table above (enforced by `scripts/validate.mjs`).
