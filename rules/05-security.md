# 05 - Security

- Never commit secrets. Use env files (`.env.local`, untracked) and document keys in `.env.example`.
- Validate and sanitize all external input at the boundary (zod or equivalent) - client AND server.
- No `dangerouslySetInnerHTML`/`innerHTML` with untrusted content. Escape output.
- Use HTTPS, secure cookies (`HttpOnly`, `Secure`, `SameSite`), and a Content-Security-Policy where possible.
- Pin dependency versions via lockfile; prefer well-maintained packages; do not add a dependency for a 10-line helper.
- Desktop: `contextIsolation` on, no Node integration in renderer, least-privilege capabilities, validate every IPC
  message, never load remote content into a privileged window.
- Mobile: store tokens in secure storage (Keychain/Keystore), not in plain async storage.
- Auth/payments: use a proven provider or library. Do not hand-roll crypto.
