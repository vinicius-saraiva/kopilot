# Lovable Migration Stories

Operational stories for executing the migration. Unlike feature epics, these stories are **not Lovable prompts** — they're infrastructure work executed locally via Supabase CLI, shell scripts, and the Vercel/Cloudflare dashboards. Work top to bottom; later stories depend on earlier ones.

**Key fact:** the schema source of truth is `supabase/migrations/` in the `kopilot-autos` repo (18 migration files). The backup in `database-backup/` holds the 8 table CSVs, the invoice photos, and the 3 users we're keeping. Edge function source lives in `supabase/functions/`. Secrets are gone and must be re-issued from source providers.

---

## Story 1 — Provision new Supabase project

**Goal:** Stand up a new, user-owned Supabase project and get a local CLI link to it.

**Steps:**
1. Create a new project on the author's personal Supabase account. Region: São Paulo (closest to primary user). Plan: free.
2. Record the project ref, project URL, anon key, and service-role key. Store the service-role key in a local `.env.local` (never commit).
3. Install Supabase CLI locally if not already: `brew install supabase/tap/supabase`.
4. From `kopilot-autos/`, run `supabase link --project-ref <ref>` to link the repo to the new project.

**Done when:** `supabase projects list` shows the new project, `supabase link` succeeds, and a manual `SELECT 1` via the Supabase SQL editor works.

---

## Story 2 — Apply existing migrations to the new project

**Goal:** Recreate schema, RLS policies, storage buckets and seed data by running the existing migrations against the new project.

**Steps:**
1. Review `supabase/migrations/` chronologically to confirm what each migration does. Note any migration that seeds `country_brands` — if seeded here, skip importing the CSV in Story 6.
2. Run `supabase db push` to apply all migrations to the linked project.
3. Verify every expected table exists: `vehicles`, `tracked_items`, `completion_logs`, `fuel_entries`, `rides`, `maintenance_visits`, `shortcuts`, `country_brands`.
4. Verify RLS is enabled on each table and policies exist.
5. Verify storage buckets exist (invoice photos bucket specifically).
6. Record whether `country_brands` was seeded by a migration — this decides Story 6.

**Done when:** All tables, policies, and buckets from the old project exist in the new project via migrations alone.

**Depends on:** Story 1.

---

## Story 3 — Audit and re-issue edge function secrets

**Goal:** Rebuild the set of secrets needed by the 4 edge functions. None are exportable from Lovable Cloud — each must be re-issued from its source provider.

**Steps:**
1. Grep `supabase/functions/` for every `Deno.env.get(...)` call. List every unique key name. Expected to include at minimum: a Mapbox token, an email-hook shared secret, SMTP credentials for `mail.kopilot.autos`, Supabase service role.
2. For each secret, identify the source provider and re-issue:
   - **Mapbox token** — generate a fresh token in Mapbox dashboard, scoped to `kopilot.autos` and `localhost`.
   - **Email hook secret** — generate a random string; the same value goes into the Supabase Auth Hook config and the edge function env.
   - **SMTP / mail sender credentials** — confirm `mail.kopilot.autos` DNS and credentials; re-issue via the chosen provider (Resend, Postmark, or whatever the current provider is).
   - **Any others found in the grep**.
3. Set each secret on the new project: `supabase secrets set KEY=value`.
4. Verify via `supabase secrets list`.

**Done when:** Every `Deno.env.get` key used by any edge function resolves on the new project.

**Depends on:** Story 1.

---

## Story 4 — Deploy the 4 edge functions

**Goal:** Ship `auth-email-hook`, `get-mapbox-token`, `match-route`, and `search-places` to the new project.

**Steps:**
1. For each function, run `supabase functions deploy <name>`.
2. Smoke-test each function via `curl` from the terminal using the project URL:
   - `get-mapbox-token` — should return a token.
   - `search-places` — should return results for a known query like "Posto Shell".
   - `match-route` — should return a snapped route for a known polyline.
   - `auth-email-hook` — trigger via a test signup after Story 5.
3. Configure the Auth Email Hook in the Supabase dashboard (Auth → Hooks) to point at the deployed `auth-email-hook` URL, using the shared secret from Story 3.

**Done when:** All 4 functions are deployed and the 3 non-auth functions respond correctly to curl.

**Depends on:** Story 2, Story 3.

---

## Story 5 — Re-create the 3 retained users with original UUIDs

**Goal:** Create Vinicius, Rafa, and Daniel on the new project, preserving their original `auth.users.id` so every CSV row imported in Story 6 still references the correct owner.

**Steps:**
1. Read `database-backup/users.json` — 3 entries with `id`, `email`, providers, and `confirmed_at`.
2. Write a one-off script (Node or Deno) using `@supabase/supabase-js` with the service-role key that calls `supabase.auth.admin.createUser({ id, email, email_confirm: true })` for each user.
3. Run the script. Verify each user shows up in the Supabase Auth dashboard with the exact UUID from `users.json`.
4. Sign in as Vinicius via Google on a local dev build (pointed at the new Supabase project) to confirm Google OAuth works and the existing UUID is reused on sign-in. *This requires Google OAuth to be configured on the new project first — do that as a sub-step: copy client ID and secret from Google Cloud Console to Supabase Auth → Providers.*

**Done when:** All 3 users exist in `auth.users` with their original UUIDs, and Vinicius can complete a Google sign-in end-to-end.

**Notes:**
- Vinicius has both `email` and `google` providers in `users.json`, but no password hash was exported. Google login is the day-one path. If email/password is needed later, use `resetPasswordForEmail`.
- Rafa and Daniel are Google-only — they sign in via Google with zero friction.
- Do **not** import any table CSVs before this story completes. Foreign keys will fail.

**Depends on:** Story 2.

---

## Story 6 — Import table CSVs in foreign-key order

**Goal:** Load all user data from `database-backup/tables/` into the new project's tables.

**Steps:**
1. Decide on `country_brands`: if Story 2 confirmed a migration seeds it, skip the CSV. Otherwise include it.
2. Import order (strict):
   1. `vehicles` — references `auth.users`
   2. `tracked_items` — references `vehicles`
   3. `fuel_entries` — references `vehicles`
   4. `rides` — references `vehicles`
   5. `maintenance_visits` — references `vehicles`
   6. `shortcuts` — references `vehicles`
   7. `completion_logs` — references `tracked_items`
   8. `country_brands` (if not migration-seeded)
3. Use `psql \copy <table> FROM '<file>.csv' WITH (FORMAT csv, DELIMITER ';', HEADER true)` connecting via the new project's direct Postgres connection string. The service role bypasses RLS for import.
4. Drop rows belonging to users we didn't retain — any row whose `user_id` (directly, or indirectly via `vehicle_id`) is not in the 3 retained UUIDs. Run a pre-import filter on the CSVs, or a post-import `DELETE WHERE user_id NOT IN (...)`.
5. Row count check: compare imported row counts against `wc -l` on each CSV (minus header, minus rows for dropped users).
6. Spot-check: `SELECT * FROM vehicles WHERE user_id = '<vinicius-uuid>'` should return the expected vehicle.

**Done when:** Every retained user's rows are in the new database, no orphaned foreign keys exist, and row counts reconcile.

**Depends on:** Story 5.

---

## Story 7 — Upload invoice photos to the new storage bucket

**Goal:** Move every `.webp` invoice photo from `database-backup/file-storage/` to the new project's storage bucket, preserving the exact path structure so signed URLs generated by the app continue to find the right files.

**Steps:**
1. Confirm the bucket name on the new project matches the old one (whatever the migrations created).
2. Write a one-off upload script (Node + `@supabase/supabase-js`, service role) that walks `database-backup/file-storage/` and uploads each file to the bucket at the same relative path (`<vehicle_id>/<filename>.webp`).
3. Skip files whose `<vehicle_id>` belongs to a dropped user (cross-reference against Story 6's retained vehicle list).
4. Verify via the Supabase Storage UI that the files exist at the expected paths.
5. Generate a signed URL for one known invoice photo (`maintenance_visits` row with a non-null `invoice_photo_url`) and open it in a browser — it should load.

**Done when:** Every invoice photo for retained users lives in the new bucket at the same path, and a signed URL test succeeds.

**Depends on:** Story 6.

---

## Story 8 — Swap auth SDK from `@lovable.dev/cloud-auth-js` to `@supabase/supabase-js`

**Goal:** Remove the Lovable-specific auth wrapper from the frontend and replace every call with the equivalent plain Supabase SDK call.

**Steps:**
1. Grep the codebase for every import from `@lovable.dev/cloud-auth-js`. Make a flat list of every function used (`signUp`, `signInWithPassword`, `signInWithOAuth`, `signOut`, `getSession`, `onAuthStateChange`, `resetPasswordForEmail`, `updateUser`, etc.).
2. Read the `@lovable.dev/cloud-auth-js` source in `node_modules` to confirm it's a thin wrapper. Note any function that does something non-standard (e.g., injects extra headers, rewrites URLs). Flag these as edge cases before the swap.
3. Replace the Supabase client initialization to use `createClient` from `@supabase/supabase-js` directly, reading from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Swap imports file-by-file. The API surface is nearly identical, so most changes are import-line swaps.
5. Remove `@lovable.dev/cloud-auth-js` from `package.json`; run `bun install` (or `npm install`) to update the lockfile.
6. Run `vitest run` and `eslint` — both must pass.
7. Start the dev server pointed at the new Supabase project env vars. Smoke-test: sign in with Google as Vinicius, open the dashboard, confirm vehicle and data load.

**Done when:** Zero references to `@lovable.dev/cloud-auth-js` in the repo, tests green, and a logged-in user sees their data from the new Supabase project on local dev.

**Depends on:** Story 7.

---

## Story 9 — Remove `lovable-tagger` and scrub remaining Lovable references in the repo

**Goal:** Make the repo fully Lovable-free.

**Steps:**
1. Remove `lovable-tagger` from `vite.config.ts` (both the plugin import and the call in the `plugins` array).
2. Remove `lovable-tagger` from `devDependencies` in `package.json`.
3. Grep the repo for any remaining references to `lovable` (case-insensitive): `index.html` meta tags, comments, README, any leftover preview URLs.
4. Remove them.
5. Update `README.md` to document local dev setup: clone → `bun install` → `.env.local` with Supabase URL + anon key → `bun dev`. No mention of Lovable.
6. Run `bun run build` — must succeed.
7. Run `vitest run` and `eslint` — both green.

**Done when:** `grep -ri lovable .` returns nothing except historical entries in `changelog.md` (kopilot docs repo) and possibly `bun.lockb` (binary — fine).

**Depends on:** Story 8.

---

## Story 10 — Deploy to staging hosting and smoke-test

**Goal:** Ship the Lovable-free build to a hosting platform and exercise every feature end-to-end against the new backend.

**Steps:**
1. Pick a hosting platform (answer Open Question #1 in the epic). Default: Vercel.
2. Create a new project on the chosen platform, linked to the `kopilot-autos` GitHub repo.
3. Set env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_POSTHOG_KEY` (if referenced in-code; otherwise it's already in `index.html`), anything else the build needs.
4. Configure a staging subdomain (e.g., `staging.kopilot.autos`) via the hosting platform and DNS provider.
5. Update the Google Cloud Console OAuth client to add the staging domain to authorized redirect URIs.
6. Update PostHog project's allowed domains to include staging.
7. Update the Mapbox token allowlist to include staging.
8. Deploy.
9. Smoke-test every feature as each of the 3 retained users:
   - Sign in with Google
   - Dashboard loads with correct vehicle and summary cards
   - Checklist items visible with correct statuses
   - Fuel history loads; add a new fuel entry; station search works
   - Ride history loads; start and complete a short test ride (GPS permission)
   - Maintenance visits load; open a visit with an invoice photo — image must render via signed URL
   - History page loads with spending chart
   - Settings: change language, change currency, edit vehicle
   - PWA install prompt works; offline reload works
   - Shortcuts work
10. Check PostHog live events view — staging should send events.

**Done when:** All smoke tests pass on staging.

**Depends on:** Story 9.

---

## Story 11 — Cut over `kopilot.autos` to new hosting

**Goal:** Move production traffic from Lovable to the new hosting platform with minimal downtime.

**Steps:**
1. Pick a low-traffic window (evening / weekend).
2. In the Google Cloud Console OAuth client, add the production `kopilot.autos` domain to authorized redirect URIs on the new Supabase project *before* flipping DNS.
3. In Mapbox, update the production token's domain allowlist.
4. In PostHog, verify production domain is already in the allowed list.
5. Flip DNS: update the `kopilot.autos` record to point at the new hosting platform (A record or CNAME depending on platform).
6. Wait for DNS propagation (usually minutes with low TTL).
7. Verify SSL provisions automatically on the new hosting.
8. Sign in as Vinicius on production; exercise the critical paths (dashboard, fuel, rides, visits).
9. Monitor logs on Supabase (Auth, Postgres, Edge Functions), hosting platform, and PostHog for the next 24–48 hours.

**Done when:** `kopilot.autos` serves from the new hosting, all 3 users can sign in and use the app, and no errors appear in logs for 24 hours.

**Depends on:** Story 10.

---

## Story 12 — Decommission Lovable and scrub the docs repo

**Goal:** Cancel subscriptions and remove every Lovable reference from the product documentation.

**Steps:**
1. Cancel Lovable subscription.
2. Cancel Lovable Cloud subscription.
3. Archive a copy of the old Lovable Cloud database state (the `database-backup/` folder already serves this purpose — just confirm it's committed to git).
4. In the `kopilot` docs repo:
   - Update `prd.md` section 5 (Technical Stack) to reflect the new stack: frontend "React + Vite (local dev)", backend "Supabase (self-owned)", hosting "Vercel" (or whatever was chosen), delete "Lovable AI" row.
   - Update `CLAUDE.md` tech stack table the same way. Remove PM-for-Lovable framing — Claude is now a product+engineering collaborator on a plain codebase.
   - Update every epic that references Lovable or Lovable Cloud. Most just mention it in the tech stack footer — find and scrub.
   - Update `changelog.md` with a new dated entry for the migration.
5. Remove this epic's `**Status:**` from `Planned` to `Live`.
6. Update the PRD features table to list the Lovable Migration epic under Live (or decide it's infrastructure and omit it — see epic's position in PRD Open Question).

**Done when:** Lovable subscriptions are cancelled and `grep -ri lovable .` in the docs repo returns only `changelog.md` entries and this epic's historical references.

**Depends on:** Story 11, plus 24–48h of green logs from Story 11.

---

## Story 13 — Migrate the landing page (`kopilot-autos-welcome`) off Lovable

**Goal:** Get `kopilot.autos` (and `www.kopilot.autos`) serving the landing page from Vercel, with the waitlist backend on a self-owned Supabase project. Mirror of Stories 1–10, scoped to the landing repo.

**Context (as of 2026-04-18):**

- Landing source lives in a separate repo: `github.com/saraiva-vinicius/kopilot-autos-welcome` — standard Vite + React + TS project, not yet linked to Vercel.
- Landing backend is **still on Lovable Cloud** — Supabase project `huzteabjbpqlbjkgghxz` (distinct from both the old app project `cpbmdzwxrgnkspgyjqyr` and the new self-owned `wulnnwccvnevnrshvfsj`). Holds the waitlist.
- Landing is currently **off everywhere** — `kopilot.autos` DNS still points at the old Lovable IP `185.158.133.1` (times out) and Lovable is no longer serving it.
- Landing repo still has Lovable leftovers: `lovable-tagger` in devDependencies, references in `vite.config.ts`, `index.html`, `README.md`, and two landing components (`HeroSection.tsx`, `CTASection.tsx`).
- `app.kopilot.autos` was already cut over as part of Story 11 — the apex and `www` are free to reassign to the landing.

**Open questions to resolve first:**

1. **Backend ownership** — does the waitlist move to the new self-owned app project (`wulnnwccvnevnrshvfsj`) under a `waitlist` schema/table, or get its own new self-owned Supabase project? Sharing simplifies admin and secrets; separating keeps landing isolated from app data. Recommendation: new dedicated project, since the waitlist is public-write and the app data is user-scoped — different RLS shapes.
2. **Waitlist row retention** — export current rows from `huzteabjbpqlbjkgghxz` via CSV before cancellation. How many rows exist? Any referenced from outside?
3. **Frontend cleanup depth now vs. later** — strip all Lovable bits as part of this migration, or ship-it-first and clean later? Recommendation: clean as part of migration to avoid a half-migrated repo.

**Steps (high level — flesh out before starting):**

1. **Backup** — export waitlist table(s) from `huzteabjbpqlbjkgghxz` to CSV. Commit under `kopilot/database-backup/welcome/` or similar.
2. **Provision new backend** (or extend existing) — per decision on Open Question #1. Apply schema migrations, RLS, seed.
3. **Scrub Lovable from the welcome repo** — drop `lovable-tagger`, clean `vite.config.ts`, `index.html`, `README.md`, `HeroSection.tsx`, `CTASection.tsx`, and any remaining references. Mirror the app-repo PR.
4. **Point the Supabase client at the new project** — update `.env` and any hardcoded refs.
5. **Create Vercel project** — link `kopilot-autos-welcome` GitHub repo to a new Vercel project on `vinicius-saraivas-projects`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars for Preview + Production.
6. **Attach domains** — `vercel domains add kopilot.autos` (to the welcome project) and `vercel domains add www.kopilot.autos`. Capture Vercel's DNS guidance.
7. **DNS cutover at GoDaddy** — edit existing `a @ 185.158.133.1` → Vercel's A value (likely `76.76.21.21`). Add `a www 76.76.21.21` (or CNAME per Vercel's instruction). Keep TTL low (600s) during the flip.
8. **Smoke test** — visit `https://kopilot.autos` and `https://www.kopilot.autos`; submit a waitlist entry end-to-end; verify the row lands in the new backend.
9. **Cleanup** — after 24h of green logs, cancel the `huzteabjbpqlbjkgghxz` Lovable Cloud project. Remove `ns mail ns3/ns4.lovable.cloud` from GoDaddy if not already gone (they belonged to the old mail setup, not the landing — safe to remove once Story 14 is done).
10. **Docs** — update `epic.md` Status, add a `changelog.md` entry, update the app→landing linking if either side references the old URL.

**Done when:**
- `https://kopilot.autos` and `https://www.kopilot.autos` both serve the landing from Vercel with valid SSL.
- Waitlist submissions land in a self-owned Supabase project.
- The `kopilot-autos-welcome` repo has zero Lovable references (except historical changelog entries).
- The old Lovable Cloud project `huzteabjbpqlbjkgghxz` is cancelled.

**Depends on:** Story 11 complete (so the app cutover isn't entangled with the landing DNS work).

---

## Story 15 — Consolidate service accounts under `kopilotautos@gmail.com`

**Goal:** Move ownership of all third-party services used by Kopilot under a single, dedicated email (`kopilotautos@gmail.com`) instead of the author's mixed personal accounts. This improves handoff, billing isolation, and reduces the risk of account lockouts on personal email changes.

**Scope:** Mapbox, PostHog, Supabase, Resend, and any other service the app depends on (check Supabase secrets + env vars).

**Decisions already made (2026-04-18):**

- **Supabase** — *do not* re-migrate projects. Invite `kopilotautos@gmail.com` as Owner on the existing org holding `wulnnwccvnevnrshvfsj`; existing members (Vinicius, vinicius.pm) stay. Optionally transfer the project to a new org owned by `kopilotautos@gmail.com` later.
- **Mapbox** — intended: create a fresh account, issue a new public token with URL allowlist `https://app.kopilot.autos`, `https://*.kopilot.autos`, `http://localhost:*`, set a hard monthly spending cap ($5–$10), rotate the Supabase secret `MAPBOX_ACCESS_TOKEN`.
- **Resend** — covered by Story 14 (domain verification). When executing 14, create the Resend account under `kopilotautos@gmail.com` from the start. Issue the API key on that account; store in Supabase secrets.
- **PostHog** — TBD whether to create a fresh project (loses history, fast) or invite + transfer the existing project (preserves history, more clicks). Default: transfer, since analytics history has PM value even at low volume.

**Known blockers (2026-04-18):**

- ❌ **Mapbox new-account creation rejected** when attempting signup with `kopilotautos@gmail.com`. Likely fraud/anti-abuse heuristic (same device/IP/card as the existing Mapbox account). Options to unblock: try from a different network/device, try a different card, or email Mapbox support with context. **Revisit later.**

**Steps (do per service, in any order once blockers clear):**

1. **Mapbox** (blocked): create account → set $10/mo spending cap → create public token with URL allowlist scoped to `*.kopilot.autos` + `localhost` → `supabase secrets set MAPBOX_ACCESS_TOKEN=...` → smoke-test from the app.
2. **PostHog**: invite `kopilotautos@gmail.com` to current project as admin. From the new account, create a new org. Transfer the project into it. Update the Vercel env `VITE_POSTHOG_KEY` (if the key changes) or leave the key alone if project move preserves it. Verify events still land.
3. **Supabase**: invite `kopilotautos@gmail.com` to the existing org as Owner. Accept from the new account. Done (no project transfer needed).
4. **Resend**: executed as part of Story 14. Create the account under `kopilotautos@gmail.com` from day one. Verify `mail.kopilot.autos`. Issue an API key. Store as `RESEND_API_KEY` (or whatever the edge function reads) via `supabase secrets set`. Redeploy `auth-email-hook`.
5. **Audit remaining services** — run `supabase secrets list` and `grep VITE_` on the app repo; make sure every secret has a known owning account noted in this story.

**Done when:**
- Every third-party service Kopilot depends on has `kopilotautos@gmail.com` as the primary/owning account.
- The author's personal email can be removed from each service (or left as read-only collaborator) without the app breaking.
- Spending caps are set on every paid service that supports them.

**Depends on:** Story 11 complete. Independent of Stories 12–14 but naturally batches with 14 (Resend).

---

## Story 16 — Re-migrate Kopilot to a dedicated Supabase project under `kopilotautos@gmail.com`

**Goal:** Isolate Kopilot's Postgres from the rest of the author's personal projects by moving to a fresh Supabase project owned by `kopilotautos@gmail.com`. Discovered mid-Story 15 (2026-04-18) that `wulnnwccvnevnrshvfsj` is *scenario 2* (same project, mixed tables with vinicius.pm personal site), so org-level transfer alone isn't enough — the data itself must move.

**Context:**

- Current Kopilot backend: `wulnnwccvnevnrshvfsj` (self-owned by Vinicius personal, but mixed with personal-site tables).
- An empty project already exists on the new account: `adrojzkkcqidfcygaxdk` — can be reused as the target, or created fresh if the new account supports org-level separation.
- Both source and target are under accounts the author controls — *much* easier than the original Lovable Cloud migration (direct `pg_dump`, no CSV intermediate needed).

**Steps (condensed — we've done this before):**

1. **Target project decision** — reuse `adrojzkkcqidfcygaxdk` or create a fresh `kopilot-prod` project under a new "Kopilot" org on `kopilotautos@gmail.com`. Lean toward fresh-with-named-org for clarity.
2. **Link CLI + apply migrations** — `supabase link --project-ref <new>` → `supabase db push` to recreate the 18 migrations (same source-of-truth migrations as the first migration used).
3. **Data transfer** — use `pg_dump --data-only --schema=public -t vehicles -t tracked_items -t fuel_entries -t rides -t maintenance_visits -t shortcuts -t completion_logs` from source → `psql` into target. Direct DB-to-DB this time; no CSV. (Exclude `country_brands` if it's seeded by a migration — verify first.)
4. **Users** — same admin API script as Story 5; create the 3 users on the new project with their original UUIDs. Script already in git history or repeatable.
5. **Storage** — re-upload invoice photos to the new project's bucket. Can stream directly from source bucket to target bucket via a Deno/Node script using service-role keys on both.
6. **Edge functions** — `supabase functions deploy` each of `auth-email-hook`, `get-mapbox-token`, `match-route`, `search-places` to the new project.
7. **Secrets** — `supabase secrets set` for `MAPBOX_ACCESS_TOKEN`, `SEND_EMAIL_HOOK_SECRET`, and any Resend/others on the new project.
8. **Auth hooks** — configure Send Email Hook in the new project's dashboard pointing at the deployed `auth-email-hook` URL.
9. **Google OAuth** — add the new project's callback URL (`https://<new-ref>.supabase.co/auth/v1/callback`) in Google Cloud Console OAuth client, copy client ID/secret to the new project's Supabase Auth → Providers.
10. **App env update** — update Vercel env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) to point at the new project. Update the committed `.env` too. Redeploy.
11. **Cutover smoke test** — same script as Story 11 §11.6, but confirm network tab shows requests to the *new* project ref, not `wulnnwccvnevnrshvfsj`.
12. **Decommission** — once green for 24h, drop the Kopilot tables from `wulnnwccvnevnrshvfsj`, or shut it down if the personal-site tables have already been moved elsewhere. Update `supabase/config.toml` project_id to the new ref.

**Risks specific to this re-migration:**

- **Coordination during env var swap** — briefly, the deployed app will point at the old backend while the new backend is being populated. Either accept a minutes-long window of stale data, or do the swap during low-traffic and deploy the new env var immediately after data transfer.
- **Google OAuth redirect drift** — forgetting to add the new Supabase URL to Google Cloud OAuth authorized origins will silently break sign-in on the new project.
- **Storage bucket path preservation** — keep `<vehicle_id>/<filename>.webp` path structure intact so signed URLs continue to resolve.
- **config.toml drift** — the `supabase/config.toml` project_id still references `wulnnwccvnevnrshvfsj`. Must update as part of this story.

**Done when:**
- The app at `app.kopilot.autos` serves entirely off the new Supabase project owned by `kopilotautos@gmail.com`.
- Zero network requests to `wulnnwccvnevnrshvfsj` from the app.
- The 3 retained users can sign in via Google and see their data.
- `supabase/config.toml` points at the new project.

**Depends on:** Story 11 complete (want a known-good baseline before compound migrations). Blocks Stories 12 (decommission), 14 (Resend — issue the API key on the new project from day one).

**Known deferrals (2026-04-18):**

- 🔸 **Google OAuth provider not configured on new project** — intentionally skipped during the re-migration to unblock infra work. Consequence: sign-in is non-functional on `app.kopilot.autos` until either Google OAuth is enabled in Supabase Auth + callback URL added to Google Cloud, OR email-based auth is enabled and Resend has a verified domain for password-reset delivery. Track as a pre-requisite before announcing the re-migration "done".
