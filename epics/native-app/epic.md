# Native App (Android → iOS)

**Epic:** Ship Kopilot as a native mobile app on Google Play (first), then App Store, without abandoning the web PWA.
**Status:** In Progress — Phase 1 kicked off 2026-04-19. Capacitor Android shell running on-device; foreground geolocation wired end-to-end; Play Developer account in identity-review; remaining Phase 1 work: privacy policy, icon/splash/listing, app signing, compliance forms, background GPS.
**Priority:** Now
**Related:** every feature with mobile-native constraints — rides (background GPS), reminders (push), maintenance (camera), future OBD-II analytics

---

## Progress Snapshot

**As of 2026-04-19** — Phase 1 Day 1.

### Done

- ✅ **Story 3 — Capacitor bootstrap + Android platform** — `@capacitor/core`, `@capacitor/cli`, `@capacitor/android` installed; `appId: autos.kopilot.app`, `appName: Kopilot`, `webDir: dist`. Android Gradle project scaffolded and checked in. Debug APK built and installed on a Samsung Galaxy S10 via wireless ADB; app loads the PWA UI inside the native WebView. `NATIVE.md` documents the build flow and the JDK 21 requirement surfaced during the first build.
- ✅ **Hide Google Sign-In button until OAuth is re-enabled** — removed from Welcome/Login/Signup pages with TODO comments pointing at the Lovable-Migration Story 16 deferral, so the native app doesn't expose a dead flow.
- ✅ **Foreground geolocation wrapper (half of Story 5)** — installed `@capacitor/geolocation`, added `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION` to the Android manifest, added `src/lib/location.ts` with a native-aware `getCurrentPosition`/`watchPosition`/`isGeolocationSupported`. Fixed the gas-station selector in AddFuel, the stations map, and the rides GPS tracker in one pass. Web PWA behaviour unchanged.

### In progress

- 🟡 **Story 1 — Google Play Developer account** — paid and submitted to Google's identity-verification queue on 2026-04-19. Selected **Personal / Individual** (not Organization — avoids the Brazil D-U-N-S requirement that would add weeks). Login email `v.saraiva.andrade@gmail.com`; display name and public contact can still be `vinicius.pm`-branded. Waiting 1–3 business days for review.

### Blocks nothing engineering-wise

Everything downstream of Story 1 can proceed in parallel while Google verifies: Story 2 (privacy URL), Story 4 (viewport/safe-area), Story 6 (icon/splash/listing), and the *background* half of Story 5 (ride tracking while the phone is locked).

### Outstanding (not yet started)

| Story | Note |
|---|---|
| 2 — Privacy policy URL | Target: `app.kopilot.autos/privacy` (apex `kopilot.autos/privacy` gated on the landing-page migration) |
| 4 — Viewport / safe-area fixes | Pending first on-device visual pass |
| 5 (background half) — Locked-phone ride tracking | Needs `@capacitor-community/background-geolocation`, foreground-service notification, `ACCESS_BACKGROUND_LOCATION` + `FOREGROUND_SERVICE_LOCATION` permissions |
| 6 — App icon, splash, Play Store listing assets | Design-heavy — adaptive icon foreground/background, feature graphic, screenshots in en/pt-BR/it |
| 7 — First AAB upload to internal testing | Gated on Story 1 clearing verification |
| 8 — Data Safety + background-location declarations | Gated on Story 6 (screenshots) + Story 2 (privacy URL) |
| 9 — Internal-testing smoke loop | Gated on Story 7 |

### Surprises + learnings from 2026-04-19

- **Capacitor 7 requires JDK 21**, not JDK 17 (first build failed with `invalid source release: 21`). Documented in `NATIVE.md` so it doesn't bite anyone else. Android Studio's bundled JBR works out of the box; only CLI Gradle needs `JAVA_HOME` set.
- **`navigator.geolocation` doesn't work in Capacitor's WebView** — must use `@capacitor/geolocation`. Discovered via the AddFuel gas-station flow silently failing on a fresh install. Foreground fix landed; background still pending as Story 5 proper.
- **Wireless ADB pair/connect ports and pairing codes rotate every ~30s** while the phone's dialog is open. Several failed attempts before realizing the codes were expiring mid-exchange.

---

## Goal

Run Kopilot as an installable app from the Google Play Store (and eventually App Store) using the **same codebase** that currently serves the PWA at `app.kopilot.autos`. Unlock native capabilities that PWAs cannot do reliably on iOS and only partially on Android:

- **Background GPS** for ride tracking while the phone is in pocket / screen off / app switched away
- **Push notifications** for due tracked items and reminders
- **Camera** with better UX for gas receipts and invoice photos
- **Bluetooth (OBD-II)** for live vehicle telemetry (deferred — see Phase 3)

## Why

- The current web `rides` feature stops GPS tracking the moment the browser tab loses focus. For a car-tracking app this is the single biggest UX limitation. Native is the only fix.
- Store distribution gives the product legitimacy (users search for apps in stores before googling a URL), unlocks in-app purchase flows later if needed, and enables push notifications via the official platforms.
- OBD-II integration (long-term vision) is only viable from a native app — browser Bluetooth APIs don't cover the adapters typical drivers own.

---

## Architectural Decision — Capacitor, not React Native

Evaluated three approaches:

| Option | Code reuse | Background GPS | Store-ready | Migration cost |
|---|---|---|---|---|
| Stay PWA (+ TWA on Android) | 100% | ❌ poor on both OSes | Android only | None |
| **Capacitor** (chosen) | ~95% | ✅ via plugin | ✅ both | Days |
| React Native rewrite | React knowledge only | ✅ first-class | ✅ both | Months |

Capacitor wraps the existing Vite + React + shadcn/ui + Tailwind build in a native WebView shell and exposes native APIs (geolocation, camera, BLE, push) via plugins. The web bundle and the native build share the exact same source. Trade-off: slight WebView performance ceiling vs. true React Native, invisible for a utility app at Kopilot's complexity level.

## The PWA stays alive

The PWA at `https://app.kopilot.autos` keeps working. Capacitor wraps the same `dist/` output into a native app. Native-only features are gated behind `Capacitor.isNativePlatform()` with graceful fallbacks on web (e.g., `startRide()` on web uses `navigator.geolocation.watchPosition` in the foreground only; on native it uses the background-capable plugin). Desktop users, shareable links, and the whole Vercel deployment remain untouched.

---

## Current State (2026-04-18)

| Layer | Today |
|---|---|
| Frontend | Vite + React + TS + Tailwind + shadcn/ui |
| Hosting | Vercel at `app.kopilot.autos` (PWA, installable via browser prompt) |
| Backend | Dedicated self-owned Supabase project `adrojzkkcqidfcygaxdk` |
| Native container | None |
| Play Store / App Store | None |
| Developer accounts | None (Google Play not yet created; Apple not yet needed) |
| Background GPS | Unsupported — `navigator.geolocation` stops when tab blurs |
| Push notifications | Unsupported in the app; PostHog surveys can notify in-app only |
| Camera access | Web `<input type="file" accept="image/*">` — falls back to OS picker |
| Bluetooth | Not implemented |

## Target State (end of all phases)

| Layer | After |
|---|---|
| Frontend | Same Vite build, unchanged |
| Hosting | Same Vercel PWA, unchanged |
| Native container | Capacitor 7.x with `@capacitor/android` and `@capacitor/ios` |
| Play Store | Kopilot listed, in production track with background-location justification approved |
| App Store | Kopilot listed (Phase 4) |
| Developer accounts | Google Play Developer (verified), Apple Developer Program |
| Background GPS | `@capacitor-community/background-geolocation` plugin, opt-in via permission prompt |
| Push notifications | `@capacitor/push-notifications` with FCM (Android) + APNs (iOS) |
| Camera access | `@capacitor/camera` native picker with image compression before upload |
| Bluetooth (OBD-II) | Phase 3 investigation — likely `@capacitor-community/bluetooth-le` if adapters support BLE, or a custom plugin for Classic Bluetooth |

---

## Phases

### Phase 1 — Capacitor shell + background GPS on Android (target: 1 week from 2026-04-19)

Minimum ship to the Play Store **internal testing track**. Not a public launch.

1. **Pre-work (starts immediately, async with engineering):**
   - Create Google Play Developer account ($25 one-time, identity verification takes 1–3 business days — **critical path**)
   - Write a privacy policy and publish at a public URL (must explicitly disclose background location use)
   - Sketch app icon (foreground/background layers for adaptive icon) + Play Store listing copy + screenshots
2. **Capacitor bootstrap:**
   - Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
   - Configure `capacitor.config.ts` — app ID `autos.kopilot.app` (or similar; bundle ID is permanent), app name, `webDir: 'dist'`
   - Run `npx cap add android`; verify `npx cap sync` + `npx cap open android` produces a buildable Android Studio project
   - Confirm the existing web bundle loads inside the Android app on emulator and on a physical device
3. **Background GPS integration:**
   - Install `@capacitor-community/background-geolocation`
   - Add the native permissions to `AndroidManifest.xml` (ACCESS_FINE_LOCATION, ACCESS_BACKGROUND_LOCATION, FOREGROUND_SERVICE, POST_NOTIFICATIONS)
   - Refactor the `rides` feature's location-watching code to call the plugin when `Capacitor.isNativePlatform()` is true; keep the existing `navigator.geolocation` path as the web fallback
   - Wire the required foreground-service notification (Android 10+ requires a persistent notification while tracking)
4. **App signing + Play Console setup:**
   - Use Google Play App Signing (key managed by Google — irreversible, critical to get right)
   - Upload the first AAB to the **internal testing** track (not closed/production)
   - Add 3–5 email addresses as internal testers
5. **Compliance forms:**
   - Fill out the Data safety form in Play Console; declare background location explicitly
   - Complete the background-location permissions declaration form (Google reviews these separately; adds 2–7 days)
6. **Smoke test:** install from internal testing, start a ride, lock the phone, drive a short distance, confirm the route is recorded end-to-end against the new Supabase backend

### Phase 2 — Public launch + push + camera (target: 2–3 weeks after Phase 1)

- Promote internal testing → closed testing → production (Play Store)
- Push notifications via FCM: server-side send endpoint in a Supabase Edge Function, native registration + token storage in the new `push_tokens` table, opt-in UX
- Camera plugin for receipts/invoice photos (already have a rough path — `<input type="file">`; native camera is a UX upgrade, not a new feature)

### Phase 3+ — OBD-II Bluetooth (target: open-ended, weeks)

**Significant engineering effort — not a weekend project.** Includes:
- Spike: survey adapter landscape (BLE vs. Classic), pick a reference adapter (e.g., OBDLink MX+, Veepeak, or a BLE-only ELM327 clone)
- Implement adapter discovery + pairing + session management
- Implement ELM327 command protocol + OBD-II PID parsing (speed, RPM, coolant temp, fuel level, DTCs, etc.)
- UI: live telemetry dashboard, DTC reader, trip fuel economy enrichment
- Handle protocol variance across vehicle makes/years

### Phase 4 — iOS parity (target: after Phase 2 is stable)

- `npx cap add ios`; fix iOS-specific viewport and safe-area issues in the WebView
- Apple Developer Program ($99/year), certificates, provisioning profiles
- Switch push from FCM-only to FCM-for-Android + APNs-for-iOS
- Background location on iOS requires the `location` background mode + "Allow all the time" permission (friction: Apple reviews justification carefully — ride tracking is a legitimate reason)
- App Store review cycles (days per submission; stricter than Play)

---

## Requirements

| Requirement | Priority | Notes |
|---|---|---|
| Background GPS works reliably on Android during a ride | P0 | Phone locked, app switched away, screen off — all must continue to record |
| PWA at `app.kopilot.autos` keeps working unchanged | P0 | Same codebase; native features gated on `Capacitor.isNativePlatform()` |
| App Signing managed by Google Play | P0 | Losing the key = no future updates for installed users, ever |
| Privacy policy published and linked from Play Store listing | P0 | Required for any app; *required with specific language* for background location |
| Data Safety form accurately declares background location + its purpose | P0 | Play Store rejects apps that under-declare |
| Internal testing track working before public submission | P0 | Catches show-stoppers that emulator tests miss |
| App loads the bundled web assets (not a remote URL) | P0 | Play Store treats remote-loading apps with suspicion; also breaks offline |
| Capacitor + Android Studio build reproducible locally from clean repo | P1 | Documented in the repo's README or a NATIVE.md |
| Push notifications via FCM | P1 | Phase 2 |
| Native camera for gas/invoice photos | P1 | Phase 2 |
| Web-native feature parity where possible | P1 | Prefer one code path with a `Capacitor.isNativePlatform()` branch over duplicate components |
| OBD-II Bluetooth telemetry | P2 | Phase 3 — explicitly not in v1 |
| iOS version published | P2 | Phase 4 |
| In-app updates prompt (Google Play In-App Updates API) | P3 | Nice-to-have after production launch |
| Live updates (Ionic Appflow or rolled-our-own) bypassing store review for web-only changes | P3 | Evaluate if Phase 2 iteration speed becomes a pain |

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Google Play identity verification takes longer than 3 days | Medium | Start it on day 1; cannot be parallelized |
| Background-location review takes the full 7 days and delays launch | Medium | Draft the justification early; Kopilot's use case (vehicle ride tracking) is canonical and usually cleared |
| Capacitor WebView renders differently from desktop Chrome (safe areas, scroll, fixed positioning) | Medium | Test on a physical device on day 2, not on week 1 day 6 |
| Background geolocation plugin drains battery / kills the app under Android's aggressive process limits (especially Xiaomi/OPPO/Huawei) | Medium | Start with conservative update intervals; document "allow background" steps for users with aggressive OEM restrictions |
| Losing the app signing key | Catastrophic | Use Google Play App Signing from day one — Google holds the master key |
| The committed `.env` (`VITE_SUPABASE_*`) ends up embedded in the APK | Low | Anon keys are public by design, so not a credential leak; document this so it's not flagged as a false positive during a future security review |
| Google OAuth redirect URI breaks inside the WebView (custom scheme vs. HTTPS) | Medium | Google OAuth is currently disabled anyway (Story 16 deferral). When re-enabled, configure Supabase Auth with the native deep link scheme `autos.kopilot.app://auth/callback` |
| App rejected for load-from-remote-URL config (if we try Capacitor `server.url`) | Low | Bundle the web build into the APK (default Capacitor behavior); don't use `server.url` in production config |
| Push-notification token storage schema not in Supabase | Low | Add a `push_tokens` table migration as part of Phase 2 Story |
| OBD-II Bluetooth scope creep into v1 | Medium | Phase 3 is **explicitly out of scope for the initial launch**. Stick to that — it's the kind of feature that will eat the entire timeline if allowed. |

---

## Out of Scope

- **OBD-II Bluetooth in v1.** Stays Phase 3. Needs its own spike + plan.
- **In-app purchases / subscriptions.** Not relevant yet; Kopilot is free. When monetization arrives it gets its own epic.
- **CarPlay / Android Auto integrations.** Separate, much more involved work. Not v1.
- **Rewriting the UI in React Native.** Explicitly considered and rejected — see Architectural Decision.
- **Live app updates bypassing store review.** Ionic Appflow or a custom OTA solution — tempting but adds complexity and cost. Revisit if Phase 2 iteration cadence demands it.
- **Decommissioning the PWA.** The web app at `app.kopilot.autos` stays. Native is *in addition to*, not *instead of*.

---

## Open Questions

1. **App bundle ID** — `autos.kopilot.app`? `com.kopilot.autos`? Permanent once published, so worth thinking now. (Recommendation: `autos.kopilot.app` — matches the domain, no squatted `com.` risk.)
2. **App Store display name** — "Kopilot" or "Kopilot Autos"? Play Store may require a distinguishing word if "Kopilot" alone is taken.
3. **Privacy policy hosting** — `kopilot.autos/privacy` (on the landing, once Story 13 of the Lovable Migration epic migrates the landing off Lovable) or `app.kopilot.autos/privacy` (new app route)? Needs a decision before week-1 Play submission.
4. **Background location permission UX** — when do we prompt? Options: (a) first-time ride start, (b) onboarding step, (c) settings toggle. Recommendation: (a), at the moment of value — explains itself.
5. **App icon + splash screen design** — same branding as PWA manifest, or a dedicated native icon treatment? Adaptive icon requires a foreground (logo) + background (fill color) layer — decide before Phase 1 day 5.
6. **Android minimum SDK level** — Capacitor 7 defaults to minSdk 22 (Android 5.1+). Fine for us; flagging for the record.
7. **Versioning scheme** — `versionCode` (integer, must increase each release) vs. `versionName` (human-readable). Recommend: auto-generate `versionCode` from CI commit count, set `versionName` manually for semver-ish releases.
8. **Testing strategy** — Play Console's internal testing track + one physical device is probably enough for v1. Evaluate Firebase Test Lab if flakiness appears across OEMs.

---

## Success Criteria

- [ ] `Kopilot` is installable from Google Play Store (at minimum on the internal testing track)
- [ ] A ride started on a Pixel (or similar) keeps recording GPS when the phone is locked and in pocket
- [ ] The web PWA at `app.kopilot.autos` remains fully functional, unchanged in behavior
- [ ] A new user can go: install from Play → sign up (once Google OAuth is re-enabled OR email auth works) → add a vehicle → start a ride → complete the ride → see the route on the map
- [ ] The Play Store listing shows Kopilot branding + screenshots + privacy policy link + correct data-safety disclosure
- [ ] A build process is reproducible: clone the repo → `npm install && npm run build && npx cap sync android && ...` → AAB in hand
- [ ] iOS feasibility is unblocked (Phase 4) — no decisions during Phase 1 prevent it
