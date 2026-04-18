# Lovable Migration

**Epic:** Migrate Kopilot off Lovable and Lovable Cloud
**Status:** In Progress (13 of 16 stories complete — app is live on `app.kopilot.autos`, backend is on a dedicated Supabase project owned by `kopilotautos@gmail.com`, emails send from `mail.kopilot.autos`. Remaining: Google OAuth config (blocks real sign-in), Story 13 landing migration, Story 12 decommission, and Mapbox account consolidation.)
**Priority:** Now
**Related:** every epic — this affects the entire stack
**Cutover checklist:** [cutover-checklist.md](cutover-checklist.md)

---

## Progress Snapshot

**As of 2026-04-18**, the Kopilot app is fully migrated off Lovable. It serves from `https://app.kopilot.autos` (Vercel), talks to a dedicated Supabase project (`adrojzkkcqidfcygaxdk`) owned by `kopilotautos@gmail.com` and fully isolated from the author's personal-site data, and sends branded auth emails from `noreply@mail.kopilot.autos` via Resend. Analytics run through a dedicated Kopilot-owned PostHog project in EU. What remains is Google OAuth (deliberately deferred — blocks real user sign-in), the landing-page migration (Story 13), and final decommission (Story 12).

### Done — 2026-04-11 (initial Lovable exit)

- ✅ Original backend migrated to self-owned Supabase (`wulnnwccvnevnrshvfsj`) — 18 migrations, 3 users, 7 tables, invoice photos, edge functions
- ✅ `@lovable.dev/cloud-auth-js` swapped for `@supabase/supabase-js`; `lovable-tagger` removed; `auth-email-hook` rewritten for Resend + Standard Webhooks
- ✅ All Lovable references scrubbed from code, `index.html`, `README.md`; bun lockfiles deleted
- ✅ Vercel project created and auto-deploying on push from `vinicius-saraiva/kopilot-autos`
- ✅ Bonus: duplicate `trigger_seed_default_items` trigger fixed (`20260411040000_drop_duplicate_seed_trigger.sql`)

### Done — 2026-04-18 (production cutover + account consolidation)

- ✅ **Story 11 — App DNS cutover** — `app.kopilot.autos` live on Vercel with auto-SSL; GoDaddy `a app` now points at `76.76.21.21`
- ✅ **Story 16 — Supabase re-migration** — moved off the shared `wulnnwccvnevnrshvfsj` project (which was mixed with personal-site tables) to a fresh dedicated `adrojzkkcqidfcygaxdk` project under `kopilotautos@gmail.com`. All 19 migrations applied, 3 users recreated with original UUIDs, 90 rows of user data transferred, 3 storage objects copied, 4 edge functions deployed, 4 secrets set, Auth Email Hook + URL Configuration wired up. `.env` and `supabase/config.toml` updated; app rebuild verified (0 references to old project in bundle).
- ✅ **Story 14 — Resend domain** — verified `mail.kopilot.autos` on a new Resend account owned by `kopilotautos@gmail.com`; flipped `FROM_ADDRESS` to `noreply@mail.kopilot.autos`; confirmed end-to-end loop (`/auth/v1/recover` returns 200, email arrives).
- ✅ **Story 15 (partial) — Account consolidation** — PostHog migrated to a new Kopilot-only project in EU (hardcoded API key in `index.html` swapped, `person_profiles: 'identified_only'` opt-in). Resend runs on a Kopilot-owned account from day one. Supabase ownership is fully isolated via the re-migration. Only Mapbox is outstanding (blocked — see below).
- ✅ **Infra hardening** — SPA fallback rewrite (`vercel.json`) so `/reset-password` and other deep links stop 404'ing. GoDaddy cleaned of Lovable residue (`ns mail ns3/ns4.lovable.cloud`, stale `_lovable*` TXT records).
- ✅ **UX polish** — branded 404 page with driving metaphor ("You've gone off the map") in en/pt-BR/it; `ResetPassword` now shows an expired-link state when the URL hash carries `error_code` instead of silently rendering a dead form.

### Outstanding

- ⏳ **Google OAuth on new project (deferred)** — sign-in is non-functional on the new Supabase project until Google OAuth is enabled in Supabase Auth and the callback URL is added in Google Cloud, OR email-based auth is enabled. No real users are affected yet, but this gates any new user onboarding.
- ⏳ **Story 13 — Landing page migration** — `kopilot-autos-welcome` repo still runs on Lovable Cloud (waitlist Supabase project `huzteabjbpqlbjkgghxz`); `kopilot.autos` apex DNS still points at the old Lovable IP `185.158.133.1`. Needs a mirror of Stories 1–10 scoped to the landing, plus a DNS cutover for the apex and `www`.
- ⏳ **Story 15 (Mapbox leg)** — creating a fresh Mapbox account under `kopilotautos@gmail.com` was rejected by Mapbox's anti-abuse checks. Existing token still works on the new domain because no URL restrictions are set. Revisit later: retry account creation from a different IP/device, OR create a new *token* on the existing account with proper URL restrictions + spending cap.
- ⏳ **Story 12 — Decommission Lovable + scrub docs** — gated on Stories 13 and the old Supabase project being idle for 24h. The old `wulnnwccvnevnrshvfsj` project is still alive as a rollback; once the new stack is fully stable and the landing is moved, cancel Lovable + Lovable Cloud subs and scrub remaining mentions from `prd.md`, `CLAUDE.md`, epics, changelog.

See [cutover-checklist.md](cutover-checklist.md) for the exact recipe.

### Loose ends

- The `.env` file is committed to git pointing at `adrojzkkcqidfcygaxdk`'s URL and anon key (deliberate: Vite's `.env` loader takes precedence over Vercel env vars in this project). Anon keys are public by design, so this isn't a credential leak.
- `scripts/migrate-users.mjs` and `scripts/migrate-storage.mjs` are committed to the kopilot-autos repo as provenance for the 2026-04-18 re-migration. They read service-role keys from env (never logged); useful as a reference for the landing migration (Story 13).
- The `auth-email-hook` verification now normalizes URL-safe base64 and missing padding before `atob`, in case a future hook-secret rotation picks up a Supabase-generated value with non-standard encoding.
- The old Supabase project `wulnnwccvnevnrshvfsj` is still alive and holds (a) the now-replaced Kopilot data and (b) unrelated personal-site tables (e.g. `newsletter_subscribers`). Don't delete it during Story 12 — just drop the Kopilot tables, leave the personal-site tables for the author's personal-site decommission.

---

## Goal

Move Kopilot completely off Lovable (visual builder) and Lovable Cloud (managed backend). After migration, the app runs on infrastructure owned and controlled directly by the author, with no dependency on Lovable for code editing, building, hosting, database, auth, storage, or edge functions.

---

## Why

- Stop paying for Lovable and Lovable Cloud.
- Own the full stack directly. No vendor lock-in on the build pipeline or backend wrapper.
- Development continues in a standard local/IDE workflow (Claude Code, Cursor, VS Code) against a plain Vite + React repo and a user-owned Supabase project.
- Faster iteration on anything Lovable can't do well (complex refactors, tests, infra).

---

## Current State

The codebase is already a standard Vite + React + TypeScript project. Lovable only wraps it — the generated code is portable. The real coupling is on the backend and auth layers.

| Layer | Today | Coupling |
|-------|-------|----------|
| Frontend source | React + TS in `kopilot-autos` repo | None — plain Vite project |
| Build tooling | Vite + SWC | None |
| Visual editor / preview | Lovable web app | **Lovable-specific** (editor, preview URL, deploy button) |
| Hosting | Lovable-hosted preview + production URL | **Lovable-specific** |
| Auth SDK | `@lovable.dev/cloud-auth-js` | **Lovable-specific wrapper around Supabase Auth** |
| Database | Lovable Cloud (managed Supabase project) | **Lovable-owned Supabase project** |
| Storage | Lovable Cloud Storage (invoice photos, signed URLs) | **Lovable-owned bucket** |
| Edge functions | `auth-email-hook`, `get-mapbox-token`, `match-route`, `search-places` | Deployed via Lovable Cloud |
| Secrets | Mapbox token, email hook secret, any others | **Lost — not exportable from Lovable Cloud. Must be re-generated / re-fetched from source providers** |
| Dev tagging | `lovable-tagger` Vite plugin | Dev-only — removable |

All Lovable Cloud services are Supabase under the hood. This makes the migration tractable: we move to a **self-owned Supabase project** and host the frontend on a standard platform (Vercel or Cloudflare Pages).

### Backup already taken

Export from Lovable Cloud is complete and lives in `database-backup/`:

| Asset | Format | Notes |
|-------|--------|-------|
| Tables | 8 semicolon-delimited CSVs | `vehicles`, `tracked_items`, `completion_logs`, `fuel_entries`, `rides`, `maintenance_visits`, `shortcuts`, `country_brands` |
| File storage | `.webp` invoice photos under `file-storage/<vehicle_id>/` | Path structure must be preserved in the new bucket |
| Users | `users.json` — 3 users to keep (Vinicius, Rafa, Daniel) | All other users are dropped |
| Schema | **Already in the repo** at `supabase/migrations/` (18 files) | This is the real schema source of truth — the export has no `pg_dump` |
| Secrets | Not exported | Must be re-created from source providers before going live |

---

## Target State

| Layer | After migration |
|-------|-----------------|
| Source of truth | Same `kopilot-autos` Git repo, now developed locally (no Lovable editor) |
| Hosting | Vercel (or Cloudflare Pages / Netlify) — PWA-friendly, free tier, custom domain |
| Auth | `@supabase/supabase-js` directly (drop `@lovable.dev/cloud-auth-js`) |
| Database | User-owned Supabase project (free tier to start) |
| Storage | Same Supabase project's Storage buckets |
| Edge functions | Deployed via Supabase CLI to the same project |
| Secrets | Supabase project secrets + hosting platform env vars |
| CI/CD | GitHub Actions or hosting platform's native Git integration |
| Domain | `kopilot.autos` (already owned) points to new hosting |

Lovable and Lovable Cloud become zero-dependency. Subscriptions cancelled.

---

## Migration Strategy

Backup is already taken (see Current State). Old Lovable Cloud backend stays reachable until cutover so nothing breaks during the move. Cutover is a DNS flip after the new stack passes a full smoke test.

---

## Phases

High-level only. Step-by-step execution belongs in `stories.md`.

1. **Provision** — create a new Supabase project on the author's own account and a Vercel (or Cloudflare Pages) project linked to the `kopilot-autos` GitHub repo.
2. **Rebuild backend** — apply the existing migrations in `supabase/migrations/` to seed schema, RLS, buckets and seed data; re-generate edge function secrets from source providers; deploy the 4 edge functions.
3. **Restore data** — re-create the 3 users via the Supabase admin API (preserving their original UUIDs and marking emails as confirmed); import the 8 table CSVs in foreign-key order; upload invoice photos to the new storage bucket preserving the `<vehicle_id>/<filename>` path structure.
4. **Decouple frontend** — drop `@lovable.dev/cloud-auth-js` and `lovable-tagger`, swap auth calls for `@supabase/supabase-js`, clean `index.html`, `vite.config.ts`, and `README.md` of Lovable references.
5. **Deploy to new hosting** — ship to a staging subdomain, smoke-test every feature, update Mapbox token allowlist, Google OAuth redirect URIs, and PostHog allowed domains for the new origin.
6. **Cut over** — point `kopilot.autos` DNS to the new hosting, monitor logs for 24–48h.
7. **Decommission Lovable** — cancel Lovable and Lovable Cloud subscriptions, scrub remaining Lovable references from `prd.md`, `CLAUDE.md`, and any epic that still mentions the old stack.

---

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Zero data loss for the 3 retained users | P0 | Row counts in the new DB must match the exported CSVs; every invoice photo must upload |
| Preserve original user UUIDs | P0 | Vehicles and every downstream table reference `user_id`; UUIDs must survive the re-creation |
| Google OAuth works for all 3 users on first login | P0 | Update authorized redirect URIs in Google Cloud before cutover |
| Zero downtime (or minutes, not hours) | P0 | Parallel-run strategy, DNS flip at the end |
| Invoice photos remain private (signed URLs only) | P0 | Bucket RLS from migrations must be verified post-deploy |
| Edge functions respond with same contracts | P0 | `get-mapbox-token`, `match-route`, `search-places`, `auth-email-hook` — all 4 redeployed with freshly-generated secrets |
| Branded auth emails still work | P0 | `auth-email-hook` redeployed; verify `mail.kopilot.autos` sender domain still resolves |
| PWA install and offline cache still work | P0 | Service worker scope must match new origin |
| PostHog analytics uninterrupted | P0 | Same project key, update allowed domains |
| `kopilot.autos` domain reused with no SSL gap | P0 | Hosting platform handles SSL automatically |
| Local dev workflow fully documented | P1 | New `README.md` with env setup, `supabase` CLI usage |
| CI (lint + tests on PR) | P1 | GitHub Actions running `eslint` and `vitest` |
| Backup strategy | P1 | Scheduled `pg_dump` + storage snapshot on the new project, stored off-Supabase |
| Remove all Lovable references from docs | P2 | Final cleanup pass across `prd.md`, `CLAUDE.md`, epics |

---

## Risks

| Risk | Mitigation |
|------|------------|
| No password hashes in the user export | Only Vinicius has an `email` provider and also has Google linked — sign in with Google on day one. Rafa and Daniel are Google-only, so unaffected. |
| User UUIDs drift during re-creation → orphaned rows everywhere | Use Supabase admin API `createUser({ id, email, email_confirm: true })` explicitly passing the UUID from `users.json` *before* importing any CSV |
| `@lovable.dev/cloud-auth-js` does something non-obvious that plain `@supabase/supabase-js` doesn't | Read the package source before swapping; test every auth flow in staging |
| RLS policies drift between old and new project | Migrations in `supabase/migrations/` are the source of truth — rely on `supabase db push` rather than hand-applying policies |
| CSV import fails on foreign keys | Import order: users (admin API) → vehicles → everything that references `vehicle_id`. Use semicolon delimiter. |
| `country_brands` gets duplicated | The seed lives in a migration — do not import the `country_brands` CSV on top unless migrations don't seed it (verify first) |
| Signed URLs for invoice photos break after bucket move | Keep bucket name identical and preserve the `<vehicle_id>/<filename>` path structure |
| Google OAuth fails after domain change | Update authorized redirect URIs in Google Cloud Console *before* cutover |
| Mapbox token rejects requests from new domain | Generate a fresh Mapbox token scoped to the new domain; store in Supabase secrets |
| Email sending breaks (`auth-email-hook`) | Re-issue email provider credentials; test in staging with a real inbox; verify SPF/DKIM on `mail.kopilot.autos` |
| Hidden Lovable-only secrets the repo doesn't reference | Secrets aren't exportable — grep the repo for every `Deno.env.get(...)` in edge functions and re-issue each one from its source provider |
| PostHog session replay stops recording from new origin | Update PostHog project's allowed domains |

---

## Out of Scope

- **Changing the backend provider.** We stay on Supabase — only the ownership moves. Switching to Firebase, PlanetScale, or self-hosted Postgres is a separate, larger decision.
- **Rewriting the frontend.** No framework changes, no component rewrites, no design changes. The migration is purely infrastructural.
- **Changing the build tool.** Vite stays.
- **Multi-environment setups beyond staging + production.** No dev/qa/preview matrix for now.
- **Moving away from Mapbox or PostHog.** Both are independent of Lovable and stay as-is.

---

## Open Questions

1. **Hosting choice:** Vercel, Cloudflare Pages, or Netlify?
2. **Email sender:** keep `mail.kopilot.autos` via the current provider, or move to Resend?
3. **Domain move:** where is the `kopilot.autos` DNS zone hosted today, and how is it currently pointed at Lovable?
4. **Does `country_brands` get seeded by a migration**, or is the CSV the only source of that data? Determines whether to import it or skip it.
5. **Backup frequency** after migration — daily is likely enough for current user volume.

---

## Success Criteria

- [ ] `kopilot.autos` serves from the new hosting platform
- [ ] Lovable and Lovable Cloud subscriptions are cancelled
- [ ] Zero references to Lovable in `package.json`, source code, or docs (except historical changelog entries)
- [ ] Every feature in the Live section of `prd.md` works identically to before
- [ ] Row counts in the new database match the exported Lovable Cloud dataset
- [ ] Invoice photos still load via signed URLs
- [ ] Next feature (Kopilot+) is developed and deployed without touching Lovable
