---
name: desktop-tauri-shell
description: Tauri 2 app shell - project setup, window config, Rust commands via invoke, capabilities (least privilege), CSP and sidecars. Use for small, fast desktop apps. Not when the main process needs the Node ecosystem (use desktop-electron-shell).
platform: desktop
sections: [app-shell, native-commands, filesystem, windows]
tags: [tauri, rust, desktop, ipc, capabilities]
requires: []
---

# Tauri Shell

## Setup
```bash
npm create tauri-app@latest .        # choose TypeScript + React
npm run tauri dev
```

## Command (Rust) + call (TS)
```rust
#[tauri::command]
fn read_note(id: String) -> Result<String, String> { /* validate id, read, map_err(|e| e.to_string()) */ }
// builder: .invoke_handler(tauri::generate_handler![read_note])
```
```ts
import { invoke } from "@tauri-apps/api/core";
const text = await invoke<string>("read_note", { id });
```

## Rules
- **Least privilege**: grant only the permissions needed in `src-tauri/capabilities/*.json`; no broad filesystem/shell scopes.
- Validate every command argument in Rust; return typed errors; never build shell commands from user input.
- Set a strict CSP in `tauri.conf.json`; never load remote content into the app window.
- Window: set `minWidth/minHeight`, persist size/position (`tauri-plugin-window-state`), restore on launch.
- Long work goes in async commands or background tasks; emit events for progress. Keep the UI thread responsive.
- Use official plugins (fs, dialog, store, updater, notification) before custom Rust.
- Keep shared types in `src/shared`; generate bindings (e.g. `specta`) if the API grows.

## Checklist
- [ ] Capabilities list is minimal and reviewed
- [ ] CSP set; no remote code
- [ ] Commands validate input and return typed errors
- [ ] Window state persists; min size enforced
- [ ] `tauri build` succeeds on the target OS
