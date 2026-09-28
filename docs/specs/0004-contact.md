# 0004. Contact

**Date**: 2026-09-28
**Status**: In Progress

## Summary

This spec builds the site's main lead form (house and request type picker, name, company, email, phone, message, validation, a confirmation state) and, for the first time, makes form submissions actually reach the business by email, through a self hosted SMTP relay (Nodemailer) and one shared API route. The Processus section's quick phone form, which has only ever faked a confirmation locally, is updated to use the same route, closing the gap the scope flagged back when that feature was built.

## Context

Both of the site's forms (the quick phone form in Processus, and this full lead form) have so far only faked a local "sent" state, exactly like the old reference file. Building real delivery means deciding, for the first time in this project, how the mail actually gets sent, where the destination address lives, and what a submitter sees when sending genuinely can fail (a case the old file, being fully local, never had to handle). The business wants to stay self hosted rather than depend on a third party transactional email API, so delivery goes through an SMTP server the business controls or already has credentials for. Since two forms need this, the decision has to produce one shared mechanism, not two.

The old file's own contact details (a phone number, an email address) are visibly placeholder text (`+261 XX XX XXX XX`, `contact@votre-domaine.mg`), left for the business to fill in later; this spec ports them faithfully rather than inventing real ones.

## Requirements

**User stories**:
- As a visitor with a specific need, I want to say which house I'm asking about and what kind of request it is, so my message reaches the right context without me having to explain it from scratch.
- As the business owner, I want every submission, from either form, to actually reach my inbox, with enough detail to reply directly, and I want a reply to only ever reach the person who actually wrote to me.
- As a visitor, I want a clear error if I've missed something required, and a clear (different) message if sending itself fails, without losing what I already typed.

**Acceptance criteria**:
- **AC-1**: A shared `POST` route at `app/api/contact/route.ts` checks the honeypot **first** (AC-2), before anything else; only then does it validate the body: a missing/unrecognised `kind` (anything other than `"full"`), or a malformed body (not JSON, not an object, a non-string field), returns `{ ok: false, error: "validation" }` at `422`. Beyond that, a non-empty `name` and an `email` matching `/^\S+@\S+\.\S+$/` (the old file's own rule, used for this client side and general server side check only, **not** for the Reply-To gate in AC-3) are required. Every string field is truncated before use (`name`/`company`/`email`/`phone`/`brand`/`requestType` to 200 characters, `message` to 2000). An invalid payload never calls the email provider.
- **AC-2**: The form carries a hidden honeypot field (`website`, `autoComplete="off"`, `tabIndex={-1}`, `aria-hidden="true"`, moved off screen rather than `display: none`, so autofill is unlikely to touch it). The route checks it **before** any `kind` or field validation: a filled honeypot returns `{ ok: true }` at `200` immediately, with no email sent, so every response looks identical to a bot regardless of what else the payload contains, and no submission (bot or a real visitor whose password manager filled the field) can trigger a confusing validation error just from the honeypot.
- **AC-3**: A valid, non-honeypotted, validated submission sends one **plain text plus HTML** email (the HTML rendered from `app/emails/LeadEmail.tsx` via `@react-email/render`) through a self hosted SMTP relay (via Nodemailer) to `process.env.CONTACT_EMAIL`, from `process.env.CONTACT_FROM_EMAIL` (defaulting to the literal `"Art Lanto Design <no-reply@localhost>"` when unset). Subject: `` `Demande ${brand} — ${name}` ``; body: one `Label: valeur` line per submitted field, omitting empty ones. Every value interpolated into the subject or body has CR/LF stripped first. The email sets Reply-To to the submitter's `email`, gated by a **stricter** check than AC-1's (`/^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/`, rejecting the comma/semicolon/angle-bracket/quote characters that could turn Reply-To into a multi-address list) — a submission whose email fails this stricter check still sends (the lead isn't lost), just with no Reply-To set. An SMTP failure, or a missing `SMTP_HOST` in production, returns `{ ok: false, error: "send_failed" }` at `502`; the client shows a distinct error state and keeps whatever the visitor typed. Outside production, a missing `SMTP_HOST` logs the composed lead to the server console and returns success instead, so the rest of this feature is verifiable without a running SMTP server. The route logs exactly one line per outcome (`[contact] honeypot`, `[contact] sent`, `[contact] send_failed`), so each path is observable from outside the process.
- **AC-4**: `Contact` (`app/components/sections/Contact.tsx`, a Client Component) renders the full lead form: a brand picker (Toliara Handicraft, Univers Plante, Or'Aura; the old file's own toggle chip style, not the `Pill` primitive, since these select a value rather than navigate anywhere) defaulting to Toliara; choosing a brand resets the request type to its first option and updates the message textarea's placeholder; a request type picker scoped to the chosen brand, in the same toggle style. The client sends the brand and request type as their resolved **labels** (e.g. `"Toliara Handicraft"`, `"Sur mesure"`), not ids or indices, so the route needs no copy of the brand data to compose a readable email. Plus name, company, email, phone, and message fields, each with its own visible `<label>` (not placeholder-only); name and email carry a `*` in their label and the native `required`/`aria-required` attributes, matching the only two fields the route actually enforces (AC-1); the footer note "* Champs obligatoires" explains the convention once for the whole form.
- **AC-5**: Every field validates independently and reports inline, under that field, not as one shared message: an empty name shows "Votre nom est requis." under the Nom field; an invalid email shows "Adresse e-mail non valide." under the E-mail field; both can show at once, and neither blocks the other from rendering. Submitting with either error present never calls the API. Submitting a valid form disables the submit button and shows "Envoi…"; the result is either the confirmation view ("Merci, {name}.", naming the chosen brand, a "Nouvelle demande" button that resets the form and clears both field errors) or, on the AC-3 error path, the message "L'envoi a échoué. Réessayez, ou écrivez-nous à {CONTACT_EMAIL}." in a form level error slot (not tied to any one field, since a send failure isn't a field problem), with the form's contents intact.
- **AC-6**: *(Superseded.)* This feature originally shipped two conversion points: this form, and a standalone "quick" phone-only form in `app/components/sections/Processus.tsx`. Feedback identified the two as competing for the same conversion, so the Processus quick form was removed entirely; phone is now an optional field on this one form (AC-4) instead. The route, client helper, and email composer no longer accept a `"quick"` kind, only `"full"`.
- **AC-7**: The background photo, gradient overlay, contact details block, and dot heading match the old file's layout; the shown phone and email are real values the business provided (not the old file's placeholders).

## Options considered

### Option 1: Resend, called from a Next.js Route Handler

Send through [Resend](https://resend.com)'s API from one shared `POST` route handler.

**Pros**:
- Minimal setup: one API key, no SMTP credentials to provision or rotate.
- A maintained, Node and edge compatible SDK, and a free tier that comfortably covers a low volume lead form.

**Cons**:
- A third party account and API key to create and keep valid, and its sandbox sending address only delivers to the account owner's own signup address until a domain is verified. More importantly: it's a hosted dependency outside the business's own infrastructure, which conflicts with the business's explicit preference to stay self hosted.

### Option 2: Nodemailer over SMTP, using a self hosted or business owned mailbox

Send through an SMTP server the business controls or already has credentials for, via Nodemailer.

**Pros**:
- No third party sending service; mail goes out through infrastructure the business already owns or operates, matching the project's self hosted requirement.
- Nodemailer is a mature, dependency light Node SMTP client with no vendor lock in: swapping the SMTP host later (a different mailbox, a self hosted relay like Postfix) needs no code change, only environment variables.

**Cons**:
- SMTP credential setup is more manual than a hosted API (host, port, TLS mode, and a mailbox password or app password to provision), and deliverability depends entirely on the reputation of whatever SMTP host is configured, not a dedicated transactional provider's warmed up sending infrastructure.

### Option 3: A hosted form backend (e.g. Formspree), no custom route at all

Point both forms directly at a third party form endpoint; skip building a route handler entirely.

**Pros**:
- Fastest to wire up; zero backend code in this repository.

**Cons**:
- The honeypot check, the reply-to logic, and the shared quick/full handling this spec wants all live outside the codebase, in a point-and-click dashboard, for no real time saved over the roughly thirty line route handler Option 2 needs. Also a hosted third party dependency, ruled out for the same self hosting reason as Option 1.

## Decision

**Chosen option**: Option 2: Nodemailer over SMTP, self hosted

Send through Nodemailer, against an SMTP server the business configures, from one shared `POST /api/contact` route handler, used by both forms.

## Rationale

The business wants to stay self hosted rather than depend on a third party transactional email API, which rules out Resend (Option 1) and any hosted form backend (Option 3) regardless of their setup convenience. Nodemailer over SMTP (Option 2) is the standard way to send mail from Node without a hosted intermediary: it talks to any SMTP server (a self hosted relay, or a mailbox the business already has), keeps `SMTP_*` credentials as plain environment variables with no proprietary SDK, and preserves every other decision this spec makes (the honeypot, the shared route, the Reply-To gating) unchanged, since those live in the route handler and the client, not in the mail transport.

## Feature design

**Data model sketch**:
None. Nothing is persisted; a submission is validated, mailed, and forgotten.

**State transitions**:
Each form: idle → submitting → sent, or idle → submitting → error (the visitor can retry from error without losing input) → sent.

**API surface**:
| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `/api/contact` | POST | `kind: "quick" \| "full"`, `phone` (quick), `name`/`email`/`company?`/`phone?`/`message?`/`brand?`/`requestType?` (full, brand/requestType as labels), `website` (honeypot) | `{ ok: true }` | none (public) | `422` invalid payload (checked after the honeypot), `502` email send failed |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Send the lead email | The destination address | `process.env.CONTACT_EMAIL` |
| Send the lead email | The from address | `process.env.CONTACT_FROM_EMAIL`, defaulting to the literal `"Art Lanto Design <no-reply@localhost>"` |
| Send the lead email | The SMTP connection | `process.env.SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`, and `SMTP_USER`/`SMTP_PASS` when the server requires auth |
| Send the lead email | The subject and body | Composed server side from the payload per AC-3's exact templates, every interpolated value CR/LF stripped |
| Send a `full` lead's email | The Reply-To address | The submitter's own `email` field, gated by AC-3's stricter regex; omitted (not the business's own address) when that check fails |
| Render the brand/request type pickers | The three brands' labels, request types, and message placeholders | Ported verbatim from the old file's `BRANDS` array; sent to the server as resolved label strings, not ids |
| Render the contact details block | The shown phone/email/address | Ported verbatim from the old file (its own placeholder values, not real business details) |
| Decide whether a missing `RESEND_API_KEY` sends or logs | Dev vs. production behaviour | `process.env.NODE_ENV`, per AC-3 |

**Key invariants**:
- The honeypot check always runs before `kind` discrimination and before field validation, so every response the endpoint gives a bot is uniform regardless of what else the payload contains.
- The email provider is never called for a payload that fails validation, or where the honeypot is filled.
- A `full` lead's Reply-To is either the submitter's own address (passing the stricter check) or absent, never the business's own `CONTACT_EMAIL` and never more than one address.
- Neither form ever discards what the visitor typed on an error; only a successful send clears the form.
- `app/lib/email.ts` is never imported by a Client Component; `import "server-only"` at its top turns an accidental import into a build failure, not a review catch.

**Security model**:
No authentication surface (a public marketing form); no session or cookie exists for a cross-site request to ride, so CSRF is not a meaningful risk here, only inbox flooding is. `SMTP_USER`/`SMTP_PASS` are read only inside `app/lib/email.ts`, guarded by `server-only`, never sent to the client. The honeypot stops naive scripted scrapers, the kind this form is actually likely to attract; it does not stop a targeted abuser posting directly to the endpoint with the honeypot omitted, and no rate limiting is added in this pass (see Follow-up) since the site has no traffic yet to judge that need against.

**Configuration required**:
- `SMTP_HOST`: the SMTP server's hostname; outside production, its absence logs instead of failing (AC-3).
- `SMTP_PORT` (optional, default `587`), `SMTP_SECURE` (optional, `"true"`/`"false"`, default `false`): connection settings matching whatever the SMTP host expects (587/STARTTLS or 465/implicit TLS are the common pairs).
- `SMTP_USER`/`SMTP_PASS` (optional): credentials, when the SMTP server requires authentication; omitted for a relay that accepts unauthenticated mail from trusted hosts.
- `CONTACT_EMAIL`: the address that receives every lead.
- `CONTACT_FROM_EMAIL` (optional): the sending address presented to recipients; omitted, mail sends from the literal `"Art Lanto Design <no-reply@localhost>"` address above, which most receiving servers will treat as low reputation, so setting a real address on a domain the SMTP host is authorized to send for is recommended before launch.

**Critical test scenarios**:
- Happy path: a valid `full` submission shows the loading state, then the confirmation naming the chosen brand, the server logs `[contact] sent`, and (with a real SMTP server configured) the business receives one plain text email with every field and a matching Reply-To, verifies **AC-3**, **AC-4**, **AC-5**.
- Failure case: an empty name or an invalid email shows the old file's error message and never calls the route; a simulated SMTP failure (or `SMTP_HOST` unset in production) shows the error state with the form still filled in and logs `[contact] send_failed`, verifies **AC-1**, **AC-3**, **AC-5**.
- Reply-To abuse: a `full` submission with `email` set to `a@b.c,attacker@evil.com` still sends (the lead isn't lost) but with no Reply-To header set, verifies **AC-3**.
- Spam path: a filled honeypot returns `{ ok: true }` at 200 regardless of the rest of the payload's validity, and logs `[contact] honeypot`, not `[contact] sent`, verifies **AC-2**.

## Build plan

1. Create `.env.local` with `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS`/`CONTACT_EMAIL`/`CONTACT_FROM_EMAIL` (blank locally until a real SMTP server exists), and a committed `.env.example` listing the same names with no real values (`.gitignore` already ignores `.env*`; add a `!.env.example` negation so the example itself stays tracked)
2. Install `nodemailer` (plus `@types/nodemailer`) and `server-only`; add `app/lib/email.ts` (`import "server-only"` first line): a `sendLeadEmail()` helper composing the AC-3 subject/body, sending via a cached Nodemailer SMTP transport, applying the dev mode console fallback, satisfies **AC-3**
3. Build `app/api/contact/route.ts`: the shared `POST` handler in the exact order honeypot → `kind`/body validation → field validation → `sendLeadEmail()`, the three response shapes, and the three log lines, satisfies **AC-1**, **AC-2**, **AC-3**
4. Build `app/lib/send-lead.ts` (client side, no import from `email.ts`): a small `fetch` helper both forms call, returning a typed result (`"ok" | "validation" | "send_failed" | "network"`), satisfies **AC-3**, **AC-5**, **AC-6**
5. Build `Contact` (`app/components/sections/Contact.tsx`): the brand/request type toggle pickers (sending labels, not ids), the field grid, the message textarea, client side validation matching AC-5, the loading/confirmation/error states, wired to `send-lead.ts`, satisfies **AC-4**, **AC-5**, **AC-7**
6. Render `Contact` in `app/page.tsx`, after `Impact` (matching the old file's order), satisfies **AC-4**
7. Update `Processus`'s quick form to call `send-lead.ts` with `kind: "quick"` and its honeypot input's live value, add its own honeypot field (built the same way as AC-2's), and the loading/error copy from AC-6, satisfies **AC-6**
8. Verify: typecheck, build, lint; a browser check of both forms' full state machine (loading, success, validation error, a simulated send failure via a temporarily broken `RESEND_API_KEY`, and the honeypot path), satisfies **AC-1** through **AC-7**

## Consequences

**Positive**:
- Both forms now actually deliver leads, closing the gap the scope flagged when Processus was first built.
- One shared route and client helper means the honeypot, validation, and error handling exist in exactly one place, not two.
- The dev mode console fallback means the whole feature is verifiable end to end before a real Resend account exists.

**Negative / tradeoffs**:
- An SMTP server the business controls (or a mailbox's SMTP credentials) and several new environment variables must be configured before the site can receive any real lead in production; until then, every submission there fails with the AC-3 error state.
- Deliverability is now entirely on the configured SMTP host's own reputation, with no dedicated transactional provider smoothing that over; a poorly configured or unauthenticated sending domain risks landing in spam.
- No rate limiting is added in this pass; a determined abuser posting directly to the endpoint (bypassing the honeypot entirely, since it's a plain field check, not a challenge) could still send many requests.
- The stricter Reply-To regex means a `full` lead with an unusual but valid looking email (containing a comma) still arrives, just without a working Reply-To; the visitor isn't told this, only the business misses the convenience.

**Neutral**:
- The contact details shown (phone, email, address) stay the old file's own placeholder values; real ones are a content task, not a code change, tracked in Follow-up.

## Follow-up

- [ ] Replace the placeholder phone number and email address in the Contact section with the business's real details before launch.
- [ ] Provision (or point at) a self hosted or business owned SMTP server, and set `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS`/`CONTACT_EMAIL`/`CONTACT_FROM_EMAIL` in the deployment environment; use a `CONTACT_FROM_EMAIL` on a domain that host is authorized to send for (SPF/DKIM configured), so mail doesn't land in spam.
- [ ] If spam becomes a real problem, add rate limiting (e.g. a small IP based limiter) on top of the honeypot; not built now since the site has no traffic yet to judge the need against.
