---
name: desktop-native-menus-shortcuts
description: Native menu bar, tray icon, keyboard shortcuts and a command palette for desktop apps, with platform conventions (Cmd vs Ctrl). Use for any real desktop application.
platform: desktop
sections: [menus, tray, shortcuts, command-palette]
tags: [menu, tray, shortcuts, accelerators, command-palette]
requires: []
---

# Menus, Tray & Shortcuts

## Rules
- Provide a real native menu: App (macOS), File, Edit (use native roles: undo/redo/cut/copy/paste/selectAll), View, Window, Help.
- Every menu item with an action has an accelerator; the same action is reachable by command palette (`Cmd/Ctrl+K`).
- Use `CmdOrCtrl` accelerators; never hard-code Ctrl on macOS. Respect OS conventions: `Cmd+,` preferences, `Cmd+Q` quit (macOS), `F11`/`Ctrl+Cmd+F` fullscreen.
- Single source of truth: one `commands` registry `{ id, title, shortcut, run }` feeding the menu, palette and shortcut handlers.
- Local shortcuts via menu accelerators/key handlers; **global** shortcuts only when essential and user-configurable.
- Tray: optional; provide Show/Hide, key actions and Quit. Closing the window on Windows/Linux may hide to tray only if the user opts in.
- Context menus (right-click) on lists, rows and text fields.
- Show shortcuts in tooltips and menu labels; keep a Shortcuts help dialog.

## Tauri / Electron
- Tauri: `Menu`, `MenuItem`, `Submenu`, `TrayIconBuilder` (Rust) or JS menu API.
- Electron: `Menu.buildFromTemplate`, `Tray`, `globalShortcut` (main process).

## Checklist
- [ ] Menu complete with native roles and accelerators
- [ ] Palette lists every command from the same registry
- [ ] Shortcuts verified on macOS and Windows
- [ ] No conflicts with OS-reserved shortcuts
