# Lovable Migration — Cutover Checklist

The exact recipe for finishing the deferred stories. Each section is self-contained — work top to bottom.

**Current state when this checklist was written (2026-04-11):**
- Vercel staging URL: `https://kopilot-autos.vercel.app` (live and verified working)
- New Supabase project: `wulnnwccvnevnrshvfsj` (shared with `vinicius.pm`, all data restored)
- Old Lovable Cloud Supabase project: `cpbmdzwxrgnkspgyjqyr` (still alive, no longer used by anything)
- `kopilot.autos` DNS at GoDaddy → A record `185.158.133.1` (old Lovable IP, currently times out)
- Auth emails via Resend FROM `noreply@newsletter.vinicius.pm` (temporary)

---

## Story 11 — App DNS cutover (15-30 min + propagation wait)

**Scope correction (2026-04-18):** only `app.kopilot.autos` moves to Vercel here. The apex `kopilot.autos` and `www.kopilot.autos` are the *landing page*, which is a separate migration (Story 13). Do **not** touch the apex A record as part of Story 11.

### 11.1 Add the domain in Vercel

Already done via CLI on 2026-04-18:

```sh
vercel domains add app.kopilot.autos   # attached to kopilot-autos project
```

Vercel's instruction: `A app.kopilot.autos 76.76.21.21`.

If you need to redo this through the dashboard:
1. Open https://vercel.com/vinicius-saraivas-projects/kopilot-autos/settings/domains
2. Add `app.kopilot.autos`
3. Copy the A record value Vercel returns (canonical: `76.76.21.21`)

### 11.2 Update DNS at GoDaddy

1. Open https://dcc.godaddy.com/control/portfolio → kopilot.autos → DNS
2. **Find the existing A record** for `app` currently pointing at `185.158.133.1` → **edit** the value to `76.76.21.21`
3. Lower TTL to 600s before saving (faster propagation)
4. Save
5. **Leave the apex `a @ 185.158.133.1` record alone** — it belongs to the landing page and will be handled in Story 13

### 11.3 Wait for Vercel verification

- Vercel polls DNS every ~30s
- Status moves: `Invalid` → `Pending` → `Valid`
- SSL cert auto-provisions via Let's Encrypt once DNS resolves (~30s after Valid)
- **Don't proceed until `app.kopilot.autos` shows as Valid in Vercel**

### 11.4 Update Mapbox token allowlist

1. Open https://account.mapbox.com/access-tokens/
2. Find the token currently set as `MAPBOX_ACCESS_TOKEN` in Supabase secrets
3. Edit the allowed URLs to include:
   - `https://kopilot.autos`
   - `https://*.kopilot.autos`
4. Save

### 11.5 Update PostHog allowed domains

1. Open https://us.posthog.com/project/<project-id>/settings/project (Settings → Project)
2. **Authorized URLs** / **Permitted Domains** → add `https://app.kopilot.autos`
3. Save

### 11.5a Update Supabase Auth redirect URLs (MISSED in original checklist — 2026-04-18)

Supabase Auth validates the final `redirectTo` URL after OAuth completes. If the new domain isn't allowlisted, sign-in silently redirects back to the previous domain or errors.

1. Open https://supabase.com/dashboard/project/wulnnwccvnevnrshvfsj/auth/url-configuration
2. **Site URL** → update to `https://app.kopilot.autos`
3. **Redirect URLs** → add (keep existing entries too, in case preview deploys need them):
   - `https://app.kopilot.autos/**`
   - `http://localhost:5173/**` (local dev)
4. Save

### 11.5b Verify Google OAuth authorized redirect URIs

The Google OAuth client redirects to Supabase's callback (`https://<project-ref>.supabase.co/auth/v1/callback`), which was already registered when the new Supabase project was set up last week. But worth a one-minute check to confirm nothing drifted:

1. Open https://console.cloud.google.com/apis/credentials
2. Open the OAuth 2.0 Client ID used for Kopilot
3. **Authorized redirect URIs** must contain: `https://wulnnwccvnevnrshvfsj.supabase.co/auth/v1/callback`
4. **Authorized JavaScript origins** — not strictly required for Supabase-mediated OAuth (the frontend doesn't talk to Google directly), but if you hit an `origin_mismatch` error during sign-in, add `https://app.kopilot.autos` here.

### 11.6 End-to-end smoke test on the production domain

```sh
# Should return 200 and serve the new build
curl -sI https://app.kopilot.autos | head -5

# Should contain the new Supabase project ref
curl -s https://app.kopilot.autos | grep -oE '/assets/index-[^"]+\.js' | head -1

# Edge functions reachable from new origin
curl -X OPTIONS -H "Origin: https://app.kopilot.autos" \
  https://wulnnwccvnevnrshvfsj.supabase.co/functions/v1/get-mapbox-token -i | head -5
```

Then in a browser:
- Sign in as Vinicius (email + temp password, or via password reset email)
- Dashboard loads with Palio data
- Fuel page → switch period to "All" → 12 entries appear
- Open the maintenance visit with the invoice photo → image loads via signed URL
- Open a ride detail → snapped route renders on the map
- DevTools Network: zero requests to `cpbmdzwxrgnkspgyjqyr.supabase.co`

### 11.7 Mark Story 11 done

Update `epic.md` Status field; add a `changelog.md` entry in `kopilot/`.

---

## Story 14 — Verify a `kopilot.autos` domain in Resend (10 min + DNS wait)

The current temporary FROM is `noreply@newsletter.vinicius.pm`. Email recipients see "Kopilot <noreply@newsletter.vinicius.pm>" which is functional but off-brand.

### 14.1 Add and verify domain in Resend

1. Open https://resend.com/domains → **Add domain**
2. Domain: `mail.kopilot.autos` (use a subdomain — keeps the apex available for the website, and Resend's recommendation is to isolate transactional mail on a subdomain)
3. Resend will show DKIM, SPF, and DMARC records to add
4. Add those records at GoDaddy (DNS panel for kopilot.autos)
5. Click **Verify DNS records** in Resend until all show green ✓ (usually a few minutes)

### 14.2 Update the function

In `kopilot-autos/supabase/functions/auth-email-hook/index.ts`, find:

```ts
// TEMPORARY: using newsletter.vinicius.pm during migration because mail.kopilot.autos
// isn't verified in Resend yet. Flip to noreply@mail.kopilot.autos before Story 11 cutover.
const FROM_ADDRESS = 'Kopilot <noreply@newsletter.vinicius.pm>'
```

Replace with:

```ts
const FROM_ADDRESS = `Kopilot <noreply@mail.${ROOT_DOMAIN}>`
```

### 14.3 Redeploy + test

```sh
cd /Users/viniciusandrade/Documents/Projects/kopilot-autos
supabase functions deploy auth-email-hook
```

Trigger a password recovery and confirm the email arrives from the new sender:

```sh
ANON='<anon-key>'
URL='https://wulnnwccvnevnrshvfsj.supabase.co'
curl -X POST -H "apikey: $ANON" -H "Content-Type: application/json" \
  -d '{"email":"v.saraiva.andrade@gmail.com"}' \
  "$URL/auth/v1/recover"
```

### 14.4 Commit + push

```sh
git add supabase/functions/auth-email-hook/index.ts
git commit -m "Switch auth emails to noreply@mail.kopilot.autos"
git push
```

---

## Story 12 — Decommission Lovable + scrub docs (30 min)

**Do NOT start this until Story 11 is fully verified and 24 hours of green logs have passed.** Cancelling Lovable Cloud while anything still depends on the old project deletes data + breaks the rollback path.

### 12.1 Verify nothing depends on the old project

```sh
cd /Users/viniciusandrade/Documents/Projects/kopilot-autos
grep -r "cpbmdzwxrgnkspgyjqyr" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git
```

Should return zero results. If anything still references the old project ref, fix it before continuing.

### 12.2 Take a final snapshot of the old project

Even though we have `database-backup/` already, take one more snapshot just before cancellation in case anything was written to the old project recently (probably nothing was, but verify):

```sh
# From the old project's dashboard, export auth.users + each table to CSV
# OR use pg_dump if Lovable Cloud exposes the connection string somewhere
```

Compare row counts to `database-backup/` — if they match, no new data, safe to cancel.

### 12.3 Cancel Lovable subscriptions

1. Lovable: https://lovable.dev/settings/billing → cancel subscription
2. Lovable Cloud (if separate): same dashboard or follow the cancellation flow they offer

### 12.4 Scrub docs in the `kopilot/` repo

1. **`prd.md`** — section 5 (Technical Stack) — replace Lovable rows with:
   - Frontend: React + Vite (local dev, deployed to Vercel)
   - Backend: Supabase (self-owned)
   - AI features: TBD (no longer Lovable AI)
2. **`CLAUDE.md`** — tech stack table same edits; remove "PM expert in building apps with Lovable" framing — Claude is now a product+engineering collaborator on a plain codebase
3. **All epic files** — grep for "Lovable" and remove or replace references:
   ```sh
   cd /Users/viniciusandrade/Documents/Projects/kopilot
   grep -ril lovable epics/ --include='*.md'
   ```
4. **`changelog.md`** — prepend a 2026-04-11 entry documenting the migration
5. **`epics/lovable-migration/epic.md`** — change Status to `Done`

### 12.5 Update `prd.md` features table

Move the Lovable Migration epic from "Planned" to a "Completed Migrations" section, OR delete it from the table entirely (it's not a user-facing feature).

### 12.6 Final commit

```sh
cd /Users/viniciusandrade/Documents/Projects/kopilot
git add -A
git commit -m "Decommission Lovable: scrub docs and mark migration epic Done"
git push
```

---

## After all three stories

- [ ] `kopilot.autos` serves from Vercel with valid SSL
- [ ] All 3 retained users can sign in and use the app on the production domain
- [ ] Invoice photos load via signed URLs
- [ ] Auth emails arrive from `noreply@mail.kopilot.autos`
- [ ] Lovable + Lovable Cloud subscriptions cancelled
- [ ] `grep -ri lovable .` in `kopilot-autos` returns zero results (except history in changelog)
- [ ] `grep -ri lovable .` in `kopilot/` returns only historical entries in `changelog.md`
- [ ] Next feature is developed and deployed without Lovable touching anything

Migration epic is officially Done.
