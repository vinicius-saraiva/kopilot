# Native App Stories

Operational stories for shipping Kopilot to the Play Store. Phase 1 stories are execution-ready; Phase 2–4 stories are planning placeholders and will be fleshed out closer to execution.

**Key fact:** Kopilot's existing Vite + React web bundle is the single source of truth. Capacitor wraps the same `dist/` into a native Android (then iOS) app. Native-only feature code is gated on `Capacitor.isNativePlatform()` with web fallbacks preserved.

---

## Phase 1 — Android Play Store internal testing (target: 1 week)

### Story 1 — Create Google Play Developer account (critical path)

**Goal:** Have a verified Google Play Console account ready before Phase 1 Day 5 so the first AAB upload isn't blocked.

**Steps:**
1. Go to https://play.google.com/console/signup using `kopilotautos@gmail.com` (keeps account ownership consistent with Resend, PostHog, and Supabase).
2. Pay the $25 one-time fee.
3. Complete identity verification: government ID upload, address verification, tax info. **This takes 1–3 business days** and cannot be parallelized with anything.
4. Once verified, pre-reserve the app name `Kopilot` (or `Kopilot Autos` if `Kopilot` alone is taken) — does not commit to any listing content yet.

**Done when:** The Console shows "Verified" status and you can create a new app draft.

**Notes:**
- This is the single biggest schedule risk for the 1-week target. **Start it on Day 1.**
- If the name `Kopilot` is taken, fall back to `Kopilot Autos` and keep `Kopilot` as a goal for later via Google's developer support.

---

### Story 2 — Publish a privacy policy URL

**Goal:** A public, permanent URL explaining what Kopilot collects, why, and (especially) how background location data is used. Play Store listing, Data Safety form, and background-location declaration all link to this.

**Steps:**
1. Decide hosting. Options:
   - `kopilot.autos/privacy` — clean, but gated on Story 13 of the Lovable Migration epic (landing page migration). Not available today.
   - `app.kopilot.autos/privacy` — live today via a new React Router route. Recommended for Phase 1.
2. Draft the policy covering:
   - Data collected (email, vehicle data, GPS traces, invoice photos)
   - Why (feature by feature: ride tracking → GPS; maintenance reminders → local notifications; receipts → camera)
   - **Background location specifically:** when it's collected, that it only runs during an active ride, that it stops when the ride ends, and that raw GPS points are stored in the user's Supabase account — not shared with third parties
   - Third parties (Mapbox for map tiles, PostHog for analytics, Resend for transactional email, Supabase for storage — each with its role)
   - User rights (export, delete) — cite the existing Supabase account-delete flow once it exists, or commit to adding one
3. Implement as a simple markdown-rendered page under `src/pages/Privacy.tsx` with i18n support (en/pt-BR/it).
4. Add the route to `App.tsx`.
5. Deploy.

**Done when:** `https://app.kopilot.autos/privacy` returns a readable policy in all three languages, and the URL is stable (not expected to 404 in a year).

**Depends on:** Nothing (can run in parallel with Story 1).

---

### Story 3 — Bootstrap Capacitor with Android platform

**Goal:** Get the existing web app running inside a native Android shell locally, end to end.

**Steps:**
1. Install Android Studio (if not already installed). Open once to trigger the SDK/NDK download.
2. From `kopilot-autos/`:
   ```sh
   npm install --save @capacitor/core @capacitor/cli
   npm install --save @capacitor/android
   npx cap init "Kopilot" "autos.kopilot.app" --web-dir=dist
   ```
3. Verify `capacitor.config.ts` is created. Commit it.
4. Build the web bundle: `npm run build` (produces `dist/`).
5. Add the Android platform: `npx cap add android`. This creates an `android/` directory with the Gradle project — commit it.
6. Sync web build into the Android project: `npx cap sync android`.
7. Open in Android Studio: `npx cap open android`.
8. Run on an emulator AND on a physical device connected via USB debugging. Confirm the app loads and renders correctly.
9. Document the build flow in a new `NATIVE.md` at the repo root.

**Done when:** A `Kopilot` app launches on a physical Android device, showing the current PWA UI inside a native WebView.

**Notes:**
- **`webDir` must be `dist`**, matching Vite's output.
- **App ID `autos.kopilot.app` is permanent once published** — don't change it after Story 6.
- Commit `android/` but add platform-specific caches to `.gitignore` (Gradle `.gradle/`, `build/`, `.idea/`, local.properties).

**Depends on:** Nothing (but engineering can only start once Story 1 is kicked off).

---

### Story 4 — Fix mobile viewport + safe-area issues exposed by the WebView

**Goal:** Make the app look right on physical Android devices — notched/cutout displays, status bar, gesture-nav bar, keyboard appearance.

**Steps:**
1. Scan the codebase for `fixed`/`sticky` positioning and confirm `h-safe-bottom` / `safe-area-inset-*` patterns are used consistently.
2. Configure Capacitor's `@capacitor/status-bar` plugin: status bar style (light/dark content), transparent or solid background matching `bg-asphalt`.
3. Configure the `@capacitor/keyboard` plugin: disable scroll-hijack on inputs; make sure text fields are visible when the keyboard opens.
4. Test on at least one device with a notch and one without (emulator images are fine — Pixel 8 Pro + Pixel 4a).
5. Fix any layout regressions.

**Done when:** Every page renders correctly on a physical device — no content under the status bar, no clipped bottom buttons, keyboard doesn't obscure the focused input.

**Depends on:** Story 3.

---

### Story 5 — Background GPS integration for rides

**Goal:** Rides continue recording GPS points when the app is backgrounded, screen is off, or the phone is in a pocket.

**Steps:**
1. Install: `npm install --save @capacitor-community/background-geolocation`.
2. Android manifest: add to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
   <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>
   <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
   ```
3. Write a native-aware location abstraction in `src/lib/location.ts`:
   - `startRide({ onPosition })`: on web, uses `navigator.geolocation.watchPosition`; on native, starts the background plugin with a persistent foreground notification ("Recording ride").
   - `stopRide()`: clears either watcher.
   - Exports `isBackgroundTrackingSupported(): boolean` for UI gating.
4. Refactor `src/components/rides/RidesSection.tsx` (and anywhere else rides location is watched) to use this abstraction.
5. On first ride start, prompt for the native permission via the plugin's `requestPermissions()` call, then check for `ACCESS_BACKGROUND_LOCATION` and nudge the user if only "While using" was granted.
6. Smoke test:
   - Start a ride
   - Lock the phone
   - Walk/drive 100+ meters
   - Unlock → verify the ride is still recording and has continuous GPS points
   - End the ride and confirm the full route renders on the map

**Done when:** A ride recorded on a locked/backgrounded phone produces a continuous route (no gaps > 10s or > 100m), indistinguishable from a foreground ride.

**Notes:**
- Android's "battery-optimized" setting on aggressive OEMs (Xiaomi, OPPO, Huawei, Samsung sometimes) can still kill the foreground service. Document a "Allow background activity" help doc for users.
- The foreground-service notification is mandatory on Android 10+; it will be visible while the ride is active. Wording: "Kopilot · Recording ride".

**Depends on:** Story 3 (Capacitor running), Story 4 (no viewport regressions).

---

### Story 6 — App icon, splash screen, and Play Store listing assets

**Goal:** Visual assets ready for submission.

**Steps:**
1. **Adaptive icon** — produce a foreground layer (Kopilot K mark, 432×432 safe zone inside 512×512) + background layer (solid color, likely `bg-blaze` or `bg-asphalt`). Export via Android Studio's Image Asset Studio or via a tool like https://icon.kitchen.
2. **Splash screen** — `@capacitor/splash-screen` plugin. Design a centered logo on the same brand background. Avoid text (localization nightmare).
3. **Play Store listing assets** — per the [Play Console requirements](https://support.google.com/googleplay/android-developer/answer/9866151):
   - App icon 512×512 PNG
   - Feature graphic 1024×500 PNG
   - 2–8 phone screenshots (1080×1920 or similar portrait)
   - Short description (80 chars max)
   - Full description (4000 chars max) — en, pt-BR, it
4. Add the adaptive icon to `android/app/src/main/res/mipmap-*/`.
5. Configure `@capacitor/splash-screen` in `capacitor.config.ts` — launch showtime ~1.5s, fade out.

**Done when:** App icon shows on the home screen, splash shows on launch, and all Play Console listing slots are filled in all three supported languages.

**Depends on:** Story 3.

---

### Story 7 — App signing via Google Play App Signing + first AAB upload

**Goal:** A signed release AAB uploaded to the internal testing track.

**Steps:**
1. In the Play Console for the Kopilot app: enable **Google Play App Signing** during the first release upload (Google manages the app signing key; you only hold an upload key).
2. Locally generate an upload keystore:
   ```sh
   keytool -genkey -v \
     -keystore kopilot-upload-key.keystore \
     -alias kopilot \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
3. **Back up the keystore file and passwords to 1Password / your password manager.** Not committed to git.
4. Configure Gradle signing in `android/app/build.gradle` referencing the upload key via env vars (so CI can sign without the keystore being in the repo).
5. Build the release AAB:
   ```sh
   cd android && ./gradlew bundleRelease
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.aab`.
6. In Play Console → Release → Testing → Internal testing → Create new release → upload the AAB.
7. Add an internal testers list (3–5 email addresses including yours, your Gmail app accounts, and any volunteer testers).
8. Publish to the internal testing track.

**Done when:** The internal-testing URL from Play Console installs Kopilot on a fresh Android device via the Play Store app.

**Notes:**
- **Never commit the upload keystore to git.** Add it to `.gitignore` explicitly if it ends up in the repo.
- Google Play App Signing is irreversible per app. If you lose the upload key you can ask Google to rotate it, but this is a manual support flow — don't rely on it.

**Depends on:** Story 1 (account verified), Story 3 (Capacitor), Story 5 (background GPS landed), Story 6 (icon, splash), Story 2 (privacy URL).

---

### Story 8 — Play Console compliance forms (Data Safety + background-location declaration)

**Goal:** Pass Google's review checks on the first submission.

**Steps:**
1. **Data Safety form** (Play Console → App content → Data safety):
   - Declare: email, precise location (including background), photos, vehicle/device usage data
   - For each, declare *why* collected and whether it leaves the device (everything goes to your Supabase, which is the backend providing the service — not a third-party "sale")
   - Link to the privacy policy from Story 2
2. **Background location declaration** (Play Console → App content → Sensitive permissions & APIs → Location):
   - Describe the feature (ride tracking)
   - Upload a 30–60 second screen recording of the ride feature in use (shows the value to Google's reviewer)
   - Justify why foreground location alone isn't sufficient (rides must continue when the phone is locked)
3. Complete other required forms: content rating (IARC questionnaire), target audience (adults), ads (none), news app (no), government app (no).

**Done when:** Play Console shows all forms as "Completed" with no red dots, and the internal-testing release can proceed to closed/production track review.

**Notes:**
- Background-location review adds 2–7 business days. **Submit this before you're ready for public launch** so the review clock starts running.

**Depends on:** Story 2 (privacy policy published), Story 6 (screenshots for the listing).

---

### Story 9 — Internal testing smoke test + bug loop

**Goal:** Validate the end-to-end native experience before any public exposure.

**Steps:**
1. Install Kopilot from the internal testing link on a physical Android device (NOT an emulator — battery/signal behavior differs).
2. Sign in — since Google OAuth is deferred (per Story 16 of Lovable Migration), email-based auth needs to work, which in turn needs Resend email delivery (already working as of 2026-04-18).
3. Complete a full loop:
   - Onboarding (add vehicle, country, odometer)
   - Start a ride, lock the phone, drive (or walk with the phone) ≥ 500m, stop, end the ride
   - Confirm route renders, distance computed correctly
   - Add a fuel entry with photo (web camera flow — native camera is Phase 2)
   - Add a maintenance visit
   - Log out, log back in (requires active email-based auth — pending Google OAuth deferral)
4. Repeat on a second device or emulator (different Android version).
5. Track issues in a throwaway list; fix blockers; iterate. Accept non-blockers for Phase 2.

**Done when:** Core flows work on one physical device, no crashes observed in 24 hours of real use.

**Depends on:** Story 7 (AAB in internal testing).

---

## Phase 2 — Public Play Store + push + camera (planning placeholder)

### Story 10 — Promote internal → closed → production testing
Submit the current build through the staged Play Store tracks. Each step gives Google more review time and exposes the app to a wider testing audience.

### Story 11 — Push notifications via FCM
Add `@capacitor/push-notifications`. Create a Firebase project, generate `google-services.json`, wire Android registration. Add a `push_tokens` table to Supabase. Create a Supabase Edge Function that sends pushes via FCM HTTP v1 (using a service account key). Opt-in UX: prompt during onboarding or on first tracked-item reminder.

### Story 12 — Native camera for gas/invoice photos
Add `@capacitor/camera`. Replace `<input type="file">` on the `AddFuel` and `AddVisit` flows with a native picker on mobile (web fallback preserved). Add client-side image compression before upload (500KB target) to save Supabase storage.

### Story 13 — Reminder notifications (due tracked items)
Cron (Supabase scheduled function) that checks each user's tracked items for due soon / overdue status, pushes notifications via FCM. Requires Story 11 landed.

---

## Phase 3+ — OBD-II Bluetooth (deliberately thin)

### Story 14 — OBD-II spike + adapter selection
Investigate: BLE vs. Classic landscape for ELM327 adapters. Buy 2–3 reference adapters (OBDLink MX+, Veepeak BLE+ BLE, generic ELM327 clone). Test connection from a bare `@capacitor-community/bluetooth-le` sample app. Document which adapters work with BLE vs. which need Classic Bluetooth (requires custom plugin or different approach).

### Story 15 — Minimum OBD-II feature (read-only live telemetry)
Scope: pair adapter, show live RPM / speed / engine temp / fuel level while driving. DTC reader + trip enrichment come later.

---

## Phase 4 — iOS parity (thinnest planning)

### Story 16 — Apple Developer Program + first iOS build
$99/year. Generate certificates + provisioning profiles. `npx cap add ios`. Fix iOS-specific viewport quirks. Build in Xcode.

### Story 17 — Background location on iOS
`location` background mode in `Info.plist`. Justification for App Store review. Handle "Allow Once" / "While Using" / "Always" permission states.

### Story 18 — APNs push
Swap FCM-for-Android-only to FCM-for-Android + APNs-for-iOS. Apple push certificate.

### Story 19 — App Store submission
TestFlight first, then App Store. Review cycles are slower and stricter than Play.
