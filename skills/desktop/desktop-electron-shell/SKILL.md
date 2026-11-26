---
name: desktop-electron-shell
description: Secure Electron app shell - main/preload/renderer split, contextBridge IPC, validation, windows and tooling (electron-vite). Use when Node.js native modules or the Node ecosystem are required. Prefer Tauri when footprint matters.
platform: desktop
sections: [app-shell, ipc, native-commands, windows]
tags: [electron, ipc, contextbridge, electron-vite, security]
requires: []
---

# Electron Shell

## Setup
```bash
npm create @quick-start/electron@latest .     # electron-vite, choose React + TypeScript
```

## Secure defaults (never turn these off)
```ts
new BrowserWindow({
  webPreferences: { preload, contextIsolation: true, nodeIntegration: false, sandbox: true },
});
```
**Preload exposes a tiny typed API only**
```ts
contextBridge.exposeInMainWorld("api", {
  readNote: (id: string) => ipcRenderer.invoke("notes:read", id),
});
```
**Main validates**
```ts
ipcMain.handle("notes:read", async (event, id) => {
  if (!isTrustedSender(event.senderFrame)) throw new Error("untrusted");
  const parsed = z.string().uuid().parse(id);
  return readNote(parsed);
});
```

## Rules
- No `remote` module, no `ipcRenderer` exposed whole, no arbitrary channel names from the renderer.
- Validate every IPC payload (zod) and check the sender. Never pass renderer input to `shell`/`child_process` unsanitized.
- Set a CSP; block navigation and `window.open` to unknown origins (`setWindowOpenHandler`, `will-navigate`).
- Persist window bounds; enforce `minWidth/minHeight`; single-instance lock (`app.requestSingleInstanceLock`).
- Heavy work in utility processes/workers, not the main process event loop.

## Checklist
- [ ] contextIsolation on, nodeIntegration off, sandbox on
- [ ] Every IPC handler validates input and sender
- [ ] CSP + navigation blocking in place
- [ ] Single instance and window state handled
