# Changelog

All notable changes to Kopilot are documented here. Organized by date, newest first.

---

## 2026-04-18

### Infrastructure — App cutover to `app.kopilot.autos` (Lovable Migration, Stories 11 + 14 + 16 + partial 15)

- **App DNS cutover (Story 11):** `app.kopilot.autos` is live on Vercel with auto-issued SSL; GoDaddy `a app` record updated from Lovable's `185.158.133.1` to Vercel's `76.76.21.21`. The apex `kopilot.autos` and `www` intentionally left on the old Lovable IP — they serve the landing page, which will migrate separately in Story 13.
- **Supabase re-migration (Story 16):** moved the backend off the shared `wulnnwccvnevnrshvfsj` project (discovered to have Kopilot tables mixed with personal-site tables like `newsletter_subscribers`) to a new dedicated project `adrojzkkcqidfcygaxdk` under `kopilotautos@gmail.com`. 19 migrations applied, 3 users recreated via admin API with original UUIDs, 7 Kopilot tables (~90 rows) copied via `pg_dump --data-only`, 3 storage objects copied via Storage API, all 4 edge functions deployed, 4 secrets set (`MAPBOX_ACCESS_TOKEN`, `RESEND_KEY`, `SEND_EMAIL_HOOK_SECRET`, `SITE_URL`). `.env` + `supabase/config.toml` now point at the new project; zero references to old project in the deployed bundle.
- **Resend domain (Story 14):** verified `mail.kopilot.autos` on a fresh Resend account owned by `kopilotautos@gmail.com`; `FROM_ADDRESS` flipped from the temporary `noreply@newsletter.vinicius.pm` to `noreply@mail.kopilot.autos`. End-to-end confirmed: `/auth/v1/recover` returns HTTP 200, password-recovery email delivered.
- **Account consolidation (Story 15, partial):** PostHog migrated to a new Kopilot-only EU project (key swapped in `index.html`, `person_profiles: 'identified_only'` opt-in). Supabase ownership resolved by the re-migration above. Mapbox still blocked (account creation rejected by anti-abuse).
- **SPA fallback:** added `vercel.json` catch-all rewrite so `/reset-password` and other client-side routes stop 404'ing on Vercel.
- **Branded 404 page:** replaced the generic `<div>` 404 with a Kopilot-themed page (dark header, blaze compass icon, "You've gone off the map" in en/pt-BR/it).
- **Recovery-link robustness:** `ResetPassword` now detects `error_code`/`error` in the URL hash and shows a branded expired-link state with a "Request a new link" CTA, instead of silently rendering a dead form.
- **Hook secret decoding:** `auth-email-hook` signature verification now normalizes URL-safe base64 and missing padding before `atob`, so future hook-secret rotations accept any Supabase-generated format.
- **GoDaddy cleanup:** removed leftover Lovable `ns mail ns3/ns4.lovable.cloud` delegation and stale `_lovable*` TXT records.

### Known gaps after today
- **Google OAuth** not yet configured on the new Supabase project — real-user sign-in is non-functional until this is done (deliberate deferral; no external users yet).
- **Landing page** (Story 13) still runs on Lovable Cloud (`huzteabjbpqlbjkgghxz`), `kopilot.autos` apex DNS still points at the old Lovable IP.
- **Old Supabase project** `wulnnwccvnevnrshvfsj` kept alive as rollback — final decommission is Story 12.

---

## 2026-04-11

### Infrastructure — Initial Lovable exit (Lovable Migration, Stories 1–10)

- Provisioned a new self-owned Supabase project and applied all 18 migrations from the repo (schema, RLS, buckets, seeds).
- Re-created the 3 retained users (Vinicius, Rafa, Daniel) via Supabase admin API preserving their original UUIDs so every downstream FK survives.
- Imported 7 table CSVs from `database-backup/tables/` filtered to retained users, in FK-safe order. Uploaded invoice photos to the new bucket preserving `<vehicle_id>/<filename>` paths.
- Rewrote `auth-email-hook` for Resend + Standard Webhooks signature verification (dropped `@lovable.dev/email-js` and `@lovable.dev/webhooks-js`). Deployed all 4 edge functions to the new project and set `MAPBOX_ACCESS_TOKEN` + `SEND_EMAIL_HOOK_SECRET`.
- Swapped `@lovable.dev/cloud-auth-js` for `@supabase/supabase-js` (only 2 files touched). Removed `lovable-tagger` from `vite.config.ts` and `package.json`. Deleted stale `bun.lock`/`bun.lockb` (repo uses npm).
- Scrubbed every Lovable reference from code, `index.html`, and `README.md`.
- Created a Vercel project auto-deploying from `vinicius-saraiva/kopilot-autos`; initial deploy reachable at `kopilot-autos.vercel.app`.
- Discovered and fixed a duplicate `seed_default_tracked_items` trigger (migration `20260411040000_drop_duplicate_seed_trigger.sql`).

Net effect after 2026-04-11: the app was functionally Lovable-free on the Vercel preview URL, but `app.kopilot.autos` was still pointing at the old Lovable IP — that DNS cutover was deferred until 2026-04-18.

---

## 2026-03-21

### Analytics — PostHog Integration (Stories 1–5)
- Added PostHog HTML snippet in `<head>` with session replay enabled
- Created `src/lib/posthog.ts` helper utility (`identify`, `reset`, `capture`)
- User identification on login/signup with email
- `posthog.reset()` on logout
- Auth events: `signup_completed`, `login_completed`, `password_reset_requested`
- Onboarding events: `onboarding_started`, `onboarding_step_completed`, `onboarding_completed`
- Fuel events: `fuel_entry_added`, `fuel_entry_edited`, `fuel_entry_deleted`, `fuel_station_searched`, `fuel_stations_map_viewed`
- Rides events: `ride_started`, `ride_completed`, `ride_deleted`
- Checklist events: `checklist_item_completed`, `checklist_item_viewed`
- Maintenance events: `visit_added`, `visit_deleted`
- History, Shortcuts, Settings events: `history_viewed`, `shortcut_tapped`, `language_changed`, `currency_changed`, `vehicle_edited`, `mileage_updated`
- Dashboard experiment events: `dashboard_viewed`, `checklist_widget_tapped`
- A/B test on checklist widget title via feature flag `checklist-section-naming` (control: "Checklist", test: "Car Health Score")

---

## 2026-03-16

### Fuel — Stations Map
- Fixed Mapbox gas station search authentication (search token passed with auth headers)

---

## 2026-03-13

### Onboarding — Full Flow (Stories 1–7)
- Built complete onboarding flow: intro stories → country → vehicle type → brand → model/year/nickname → plate → odometer → dashboard
- 3 intro story screens (maintenance, fuel, rides) with tap-to-advance, hold-to-pause, auto-progress bar — same interaction pattern as FuelSuccess
- Country selection screen with Brazil/USA/Italy cards, conditional state/region dropdown, auto-sets locale and currency
- Vehicle type selection (car / motorcycle) with "Coming Soon" overlay on motorcycle
- Brand arc picker (BrandArcPicker component) with framer-motion pan gesture, snap-to-nearest, haptic feedback, and "Other" option with custom text input
- Country-specific brand list: `country_brands` table with top 20 brands per country (BR, US, IT), loaded dynamically with fallback to hardcoded list
- Model, year, and nickname screen with brand icon confirmation header
- Plate number screen (skippable, auto-uppercase)
- Odometer screen (skippable) with OdometerWheelPicker, creates vehicle in database on finish
- Auto-redirect to `/onboarding` when logged-in user has no vehicle
- Vehicle data stored progressively via localStorage, saved to Supabase on final step
- Image preloading for vehicle type screen assets
- All screens use 6-step progress indicator and i18n (PT-BR, EN, IT)

---

## 2026-03-07

### Rides
- Added elevation gain tracking during GPS recording (new `elevation_gain` column)
- Added speed chart (speed over distance) in ride detail with average speed reference line
- Compact inline back button on ride detail
- Removed AppLayout wrapper from RideDetail for full-screen feel

### Fuel — Stations Map
- Built full map view of visited stations (Mapbox dark style)
- Color-coded station markers: green (below avg), red (above avg)
- 30-day rolling average price card on map
- Station cards show city, district, and last visit date
- Added `station_address` column with reverse geocoding
- Backfilled existing station addresses with state (UF) for Brazil
- Recenter button and user location blue dot on map
- Empty state for stations page when no data
- Price difference display (absolute diff vs overall average)

### UX
- Improved toast visuals: accent left border, always-visible close button, compact layout

### Auth & Emails
- Custom branded email templates for all auth flows (signup, recovery, magic link, invite, email change, reauthentication)
- Auth email hook edge function with Kopilot branding and `mail.kopilot.autos` sender domain
- Email logo with brand assets from `brand.kopilot.autos`
- Updated sender name to "Kopilot"

### Onboarding
- BrandSelect component for vehicle make field (icon-based brand picker)
- Improved AddVehicle page scrolling
- Auto-redirect to add-vehicle after first login
- Improved forgot-password error UX

---

## 2026-03-06

### Rides
- Screen wake lock keeps display on during active GPS tracking
- Mapbox token fetched with auth headers for security
- Removed map rounded corners for cleaner ride visuals

### PWA & Offline
- Hardened PWA geolocation handling and permissions

### Fixes
- Fixed Supabase storage UPDATE/DELETE policies
- Fixed add-visit scroll behavior

---

## 2026-03-04

### Fuel
- Generalized PlaceSearchInput component (reused for gas stations and mechanic shops)
- Refined station picker UI with distance display

### Maintenance Visits
- Fixed invoice photo access with signed URLs
- Fixed image-to-signed-URL conversion

---

## 2026-03-01

### Fuel — Station Search
- Added station search input with Mapbox integration
- Nearby gas station suggestions with distance display
- Locale-aware default search on focus
- Category endpoint for empty input queries
- Persisted Mapbox ID for selected stations
- Refined station picker UI and layout

---

## 2026-02-28

### UX — Odometer Wheel Picker
- Integrated OdometerWheelPicker across fuel and vehicle forms
- Auto-updates vehicle mileage on fuel entry

---

## 2026-02-27

### i18n
- Translated all checklist item names via i18n keys
- Integrated i18n into status calculation logic
- Fixed Portuguese ride translation strings

### Checklist
- Added next due date field for regulatory items (auto-calculated from interval)

---

## 2026-02-20

### Shortcuts
- Added phone and WhatsApp shortcut types (tel: protocol)

### Offline & PWA
- Added offline data persistence via React Query + localStorage (24h cache)

### Security
- Made invoice photos private with secure signed-URL access

### Rides
- Improved match-route validation for snap-to-road

### UX — Odometer Wheel Picker
- Circular scrolling behavior with snap-after-release
- Enhanced snapping guard for precise digit selection

---

## 2026-02-19

### Auth
- Added forgot password flow (email verification link)
- Added reset password page with confirmation
- Fixed OAuth redirect URI

### UX — Odometer Wheel Picker
- Built 6-digit odometer wheel picker with haptic feedback
- Circular scrolling, smooth snap-to-nearest, mount timing fixes

### Welcome Page
- Refined Welcome page visuals and auth copy
- Updated feature card icons
- Removed install gap when PWA prompt hidden

---

## 2026-02-18

### Fuel
- Built fuel success page with Lottie animation and audio feedback
- Preloaded success assets while form is being filled
- Story-style timer with pause/resume on hold
- Added recent stations page
- Unified fuel form structure (add + edit)
- Converted fuel edit to full-screen page
- Full-screen AddFuel page
- Allowed decimal input for liters and cost
- Fixed fuel chart margins, labels, and axis formatting

---

## 2026-02-11

### Rides
- Full-screen active ride mode with live GPS tracking
- Strava-style map previews in ride history
- Snap-to-road route matching via Mapbox Directions API
- Cached snapped routes in database for performance
- Auto-named rides by time of day (Morning Ride, etc.)
- Navigation arrow marker aligned with bearing
- Waze-style live map during active tracking
- Improved ride timer accuracy
- Improved ride map rendering and load performance
- Preserved GPS state during full-screen ride view
- Fixed Mapbox token CORS issues

### Shortcuts
- Added shortcuts feature with preset options
- Icon-based quick links from dashboard (URLs, phone numbers)

### Dashboard
- Moved checklist to dedicated page (cleaner dashboard)
- Synced fuel history to calendar filter period

### Fuel
- Refactored fuel history list
- Aligned fuel period filter to calendar months

---

## 2026-02-10

### i18n
- Completed batch 3 i18n updates across all screens
- Added fuel-specific i18n strings and headers
- Enhanced i18n coverage for remaining UI elements

---

## 2026-02-06

### Auth
- Added Google Sign-In to Welcome page
- Added auth translation keys

### Fixes
- Fixed subpage scrolling issues

---

## 2026-01-30

### i18n
- Added full i18n support (PT-BR, EN, IT)
- Currency selection UI (BRL, USD, EUR, INR, GBP, AED)

### History
- Added spending chart with time period filter
- Category filter (All, Gas, Maintenance, Regulatory)
- Responsive spending summary card
- Harmonized spending header and total display

### PWA
- Added favicon SVG and 1024px splash icon
- Fixed PWA viewport and update flow
- Added PWA update button

### Dashboard
- Brand icon display with Cardog icons
- Enhanced brand select dropdown
- Car image placeholder
- Reordered bottom nav items

### Fuel
- Separately filtered fuel stats by time period

---

## 2026-01-29

### Fuel
- Implemented core fuel logging (date, type, volume, cost, station, odometer)
- Fuel statistics: spending totals, fill-up count, average efficiency
- Fuel efficiency chart (km/L over time)
- Fuel spending chart with trends

### Rides
- Reworked rides access and navigation

### History
- Consolidated unified history UI with tabs
- Refactored history into spending-focused view

### Layout
- Implemented sticky headers layout
- Removed top header from AppLayout (cleaner mobile feel)

---

## 2026-01-27 — Launch Day

### Core App
- App shell with bottom navigation (Dashboard, Checklist, Fuel, Rides, History)
- Dashboard with vehicle header, summary cards, status overview
- Checklist with 13+ trackable items (regulatory + maintenance)
- Status indicators: OK (green), Approaching (yellow), Overdue (red)
- Item detail pages with completion history
- Mark as done modal with date, mileage, cost, notes

### Vehicle Management
- Add vehicle form (nickname, make, model, year, mileage, state, plate digit)
- Vehicle data editing

### Auth
- Email/password signup and login
- Session management with protected routes

### History & Settings
- Unified history timeline
- Settings page (account, vehicle, preferences)

### Maintenance Visits
- Mechanic visit logging with date, cost, location, notes
- Invoice photo upload support

### Database
- Lovable Cloud (Supabase) schema: vehicles, tracked_items, completion_logs, fuel_entries, maintenance_visits, rides, shortcuts
- Row-level security policies

### PWA
- PWA-enabled with install prompt
- SVG icons and splash screen

### Misc
- Empty states and skeleton loading screens
- Dashboard sorting by due date per category
