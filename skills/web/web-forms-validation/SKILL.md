---
name: web-forms-validation
description: Accessible forms with react-hook-form + zod, client and server validation, spam protection and designed states. Use for contact, signup, checkout, newsletter and settings forms.
platform: web
sections: [contact, signup, checkout, newsletter, settings]
tags: [forms, zod, react-hook-form, validation, a11y]
requires: []
---

# Forms & Validation

## Stack
```bash
npm i react-hook-form zod @hookform/resolvers
```
One zod schema shared by client and server (`src/lib/schemas/contact.ts`). The server action/API route re-validates with the same schema.

## Rules
- Visible `<label>` for every field; no placeholder-only labels. Correct `type`, `inputmode`, `autocomplete`.
- Errors: text under the field, linked with `aria-describedby`, `aria-invalid="true"`; focus moves to the first invalid field on submit.
- States: idle, submitting (button disabled + spinner, text kept), success (clear confirmation), error (retry path; keep the user's input).
- Spam: honeypot field + rate limiting on the server; add Turnstile/hCaptcha only if abuse appears.
- Never trust client validation. Sanitize, length-limit and escape server-side. No secrets in client code.
- Do not email/store data without telling the user where it goes (env keys documented in `.env.example`).

## Checklist
- [ ] Same schema on client and server
- [ ] Keyboard-only submit works; errors announced
- [ ] All four states designed and tested
- [ ] Honeypot/rate limit in place; no secrets exposed
