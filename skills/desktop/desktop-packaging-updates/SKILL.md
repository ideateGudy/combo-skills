---
name: desktop-packaging-updates
description: Build, sign, notarize, package and auto-update desktop apps with a CI release matrix (Tauri bundler or electron-builder). Use when shipping to users.
platform: desktop
sections: [packaging, signing, auto-update, release]
tags: [installer, code-signing, notarization, updater, github-actions]
requires: []
---

# Packaging, Signing & Updates

## Targets
| OS | Output | Signing |
|---|---|---|
| macOS | `.dmg` / `.app` (universal or per-arch) | Developer ID + **notarization** |
| Windows | `.msi` / NSIS `.exe` | Authenticode cert (EV or Azure Trusted Signing) |
| Linux | `.AppImage`, `.deb`, `.rpm` | optional GPG |

## Rules
- Build each OS on its own runner (GitHub Actions matrix: `macos-latest`, `windows-latest`, `ubuntu-latest`).
- Secrets (certs, passwords, updater private key) live in CI secrets only; never in the repo.
- Auto-update: Tauri `tauri-plugin-updater` (signed `latest.json` + minisign key) or Electron `electron-updater`. Updates must be signature-verified and served over HTTPS.
- Version from one source (`package.json`/`tauri.conf.json`), bump with a tag (`v1.2.3`) that triggers the release workflow and uploads artifacts to a GitHub Release.
- Provide icons for all sizes (`tauri icon` / `electron-icon-builder`), app id, publisher name, license.
- Test: install on a clean VM, update from the previous version, uninstall cleanly.

## Checklist
- [ ] Signed and notarized installers for macOS and Windows
- [ ] CI release workflow produces all artifacts from a tag
- [ ] Update from N-1 to N verified
- [ ] No secrets in the repo; updater key backed up securely
