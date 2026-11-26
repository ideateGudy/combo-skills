# Platform: DESKTOP

**Default stack**: Tauri 2 (Rust shell) + web UI (React + TypeScript + Vite). Use Electron only when Node.js native
modules or the Node ecosystem in the main process are required. Pick once, record it in `docs/decisions.md`.

**Folders**
```
src/                 UI (renderer)
src/shared/          types shared between UI and shell
src-tauri/           Rust shell, capabilities, tauri.conf.json      (Tauri)
electron/            main + preload                                  (Electron)
assets/              icons, fonts, images
```

**Allowed skills**: `desktop-*`, `shared-*`. Web UI skills (`web-*`) only if the user approves and it is recorded
(`--allow-cross web`).
**Forbidden**: mobile-only packages; exposing Node/Rust APIs to the renderer without validated commands.
**Targets**: cold start < 1.5s, idle RAM sensible, signed installers for macOS + Windows, keyboard-first UX.
