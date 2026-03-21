# Analytics

**Epic:** Product analytics with PostHog
**Status:** Live
**Priority:** v1.x
**Related stories:** [stories.md](stories.md)

---

## Problem

Kopilot has no visibility into how users interact with the app. We can't answer basic questions: Which features are used? Where do users drop off in onboarding? How often do people log fuel vs. rides? Without data, product decisions are guesses.

---

## Solution

Integrate PostHog as the analytics layer. Two core capabilities:

1. **User identification** — link anonymous sessions to authenticated users on login/signup
2. **Custom event tracking** — capture key actions across every major feature area

PostHog was chosen for its generous free tier, self-hostable option, and built-in session replay, funnels, and feature flags — all of which Kopilot can use as it grows.

---

## Setup

HTML snippet approach — no NPM dependency, works cleanly with Lovable's build system.

| Concern | Approach |
|---------|----------|
| Integration | HTML snippet in `<head>` — loads PostHog globally as `window.posthog` |
| Calls | `window.posthog.capture()`, `window.posthog.identify()` — no imports needed |
| Auto-capture | Pageviews and basic clicks tracked automatically by the snippet |
| Session replay | Enabled — records user sessions for debugging and UX analysis |
| Environment | Only send events in production (disable in dev/preview) |
| Privacy | Respect user's country — no IP storage, anonymize where required by GDPR (Italy) |

> **Why snippet over SDK?** Lovable manages the build system. An HTML snippet avoids NPM dependency conflicts, requires no imports, and gives us auto-capture out of the box. The tradeoff (no TypeScript types on `window.posthog`) is negligible for event tracking.

---

## User Identification

### On signup / login

Call `posthog.identify(userId)` immediately after successful authentication. Set these user properties:

| Property | Source | Example |
|----------|--------|---------|
| `email` | Auth session | `user@example.com` |

Other data (country, vehicle_type, brand, language, currency) lives in the database and doesn't need to be duplicated on PostHog. Can be added later if segmentation requires it.

### On logout

Call `posthog.reset()` to clear the identified user and start a new anonymous session.

---

## Custom Events

Events follow a consistent naming convention: `<area>_<action>` in snake_case.

### Dashboard

| Event | When | Properties |
|-------|------|------------|
| `dashboard_viewed` | User lands on dashboard | — |
| `checklist_widget_tapped` | User taps the checklist summary widget | — |

### Onboarding

| Event | When | Properties |
|-------|------|------------|
| `onboarding_started` | User lands on first intro story | — |
| `onboarding_step_completed` | User advances a step | `step` (1–9), `step_name` |
| `onboarding_completed` | Vehicle saved, redirect to dashboard | `country`, `vehicle_type`, `brand` |
| `onboarding_abandoned` | User closes app or navigates away mid-flow | `last_step` |

### Auth

| Event | When | Properties |
|-------|------|------------|
| `signup_completed` | Account created | `method` (`email` / `google`) |
| `login_completed` | Successful login | `method` (`email` / `google`) |
| `password_reset_requested` | Forgot password email sent | — |

### Fuel

| Event | When | Properties |
|-------|------|------------|
| `fuel_entry_added` | Fuel log saved | `fuel_type`, `full_tank`, `has_station` |
| `fuel_entry_edited` | Existing entry updated | — |
| `fuel_entry_deleted` | Entry removed | — |
| `fuel_station_searched` | Station search performed | `result_count` |
| `fuel_stations_map_viewed` | User opens stations map | `station_count` |

### Rides

| Event | When | Properties |
|-------|------|------------|
| `ride_started` | GPS tracking begins | — |
| `ride_completed` | Ride saved | `distance_km`, `duration_min`, `has_elevation` |
| `ride_deleted` | Ride removed | — |
| `ride_detail_viewed` | User views a ride detail page | — |

### Checklist

| Event | When | Properties |
|-------|------|------------|
| `checklist_item_completed` | User marks an item as done | `item_type` (`regulatory` / `maintenance`), `item_name` |
| `checklist_item_viewed` | User opens item detail | `item_name` |

### Maintenance Visits

| Event | When | Properties |
|-------|------|------------|
| `visit_added` | Maintenance visit saved | `has_photo`, `has_cost` |
| `visit_deleted` | Visit removed | — |

### History

| Event | When | Properties |
|-------|------|------------|
| `history_viewed` | User opens history page | `filter_category`, `filter_period` |

### Shortcuts

| Event | When | Properties |
|-------|------|------------|
| `shortcut_tapped` | User taps a shortcut | `shortcut_type` (`url` / `phone` / `whatsapp`) |

### Settings

| Event | When | Properties |
|-------|------|------------|
| `language_changed` | User changes language | `from`, `to` |
| `currency_changed` | User changes currency | `from`, `to` |
| `vehicle_edited` | Vehicle info updated | — |
| `mileage_updated` | Odometer manually updated | — |

### Navigation

| Event | When | Properties |
|-------|------|------------|
| `page_viewed` | Any page load | `path` (auto-captured via PostHog SPA tracking) |

---

## What We Can Answer After Launch

With these events and user properties, PostHog gives us:

- **Onboarding funnel:** step-by-step conversion, drop-off points
- **Feature adoption:** % of users who log fuel, track rides, use checklist
- **Engagement frequency:** daily/weekly/monthly active users by feature
- **Country comparison:** feature usage by country (BR vs US vs IT)
- **Retention:** are users coming back after first week?

---

## Out of Scope (for now)

- **Revenue analytics** — will be relevant when Kopilot+ launches.
- **Backend events** — all tracking is client-side for now. Edge function events (e.g., email sent) can be added later via PostHog server-side API.

---

## Notes

- PostHog's `$pageview` auto-capture handles SPA page views if configured. The `page_viewed` event above may be redundant — evaluate during implementation.
- Keep event volume reasonable. Don't track every button click — focus on actions that represent user intent or feature engagement.
- Event names and properties must be consistent from day one. Renaming events later breaks funnels and cohorts.
