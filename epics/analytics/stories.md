# Analytics Stories

Stories grouped by Lovable prompt. Implementation sequence: Story 1 first (PostHog setup + auth tracking), then Story 2 (core feature events), then Story 3 (remaining events).

---

## Story 1 — PostHog Setup + Auth Identification

**Context:** Kopilot is a vehicle maintenance app. We're adding PostHog for product analytics. The integration uses an HTML snippet (not the NPM SDK) so PostHog loads globally as `window.posthog`.

**What to build:**

### 1. Add PostHog snippet
<script>
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroups onFeatureFlags addFeatureFlagsHandler onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_u5z8zMCR4KdmSItYpuUxFlaEOBV1P8Pb65bUYK4GKsn', {
        api_host: 'https://us.i.posthog.com',
        defaults: '2026-01-30'
    })
</script>


### 2. Create a helper utility

Create a `src/lib/posthog.ts` utility with typed wrapper functions. All functions should check that `window.posthog` exists before calling (safe no-op in dev).

```
identify(userId: string, properties: { email: string })
reset()
capture(eventName: string, properties?: Record<string, any>)
```

### 3. Identify user on auth

In the existing auth flow (wherever the app handles successful login/signup):

- After successful **signup**: call `identify(user.id, { email })` and `capture('signup_completed', { method })` where method is `email` or `google`
- After successful **login**: call `identify(user.id, { email })` and `capture('login_completed', { method })`
- After **logout**: call `reset()`
- After **password reset request**: call `capture('password_reset_requested')`

### Behavior

- PostHog should not block app startup or affect load performance
- If PostHog fails to load, the app works normally — all calls are guarded
- No visible UI changes

---

## Story 2 — Onboarding + Fuel + Rides Events

**Context:** Kopilot has PostHog integrated (Story 1). Now we add custom event tracking for the three most important feature areas: onboarding, fuel, and rides. Use the `capture()` helper from `src/lib/posthog.ts`.

**What to track:**

### Onboarding events

Add these calls to the existing onboarding flow (`/onboarding`):

| Where | Event | Properties |
|-------|-------|------------|
| When the first intro story screen mounts | `onboarding_started` | — |
| When user advances to the next step | `onboarding_step_completed` | `step` (1–9), `step_name` (e.g. `country`, `vehicle_type`, `brand`, `model`, `plate`, `odometer`) |
| When vehicle is saved and user is redirected to dashboard | `onboarding_completed` | `country`, `vehicle_type`, `brand` |

### Fuel events

Add these calls to the existing fuel flow:

| Where | Event | Properties |
|-------|-------|------------|
| After a new fuel entry is saved successfully | `fuel_entry_added` | `fuel_type`, `full_tank` (boolean), `has_station` (boolean) |
| After an existing fuel entry is updated | `fuel_entry_edited` | — |
| After a fuel entry is deleted | `fuel_entry_deleted` | — |
| When a station search returns results | `fuel_station_searched` | `result_count` |
| When the stations map page mounts | `fuel_stations_map_viewed` | `station_count` |

### Rides events

Add these calls to the existing rides flow:

| Where | Event | Properties |
|-------|-------|------------|
| When GPS tracking starts (user taps Start) | `ride_started` | — |
| When ride is saved after stopping | `ride_completed` | `distance_km`, `duration_min`, `has_elevation` (boolean) |
| After a ride is deleted | `ride_deleted` | — |

### Behavior

- Events fire once per action (no duplicates on re-renders)
- All `capture()` calls are fire-and-forget — never block the UI or the save flow
- No visible UI changes

---

## Story 3 — Checklist, Visits, Settings & Shortcuts Events

**Context:** Kopilot has PostHog integrated with onboarding, fuel, and rides tracking (Stories 1–2). Now we add event tracking for the remaining feature areas. Use the `capture()` helper from `src/lib/posthog.ts`.

**What to track:**

### Checklist events

| Where | Event | Properties |
|-------|-------|------------|
| When user marks a checklist item as done (after save) | `checklist_item_completed` | `item_type` (`regulatory` / `maintenance`), `item_name` |
| When user opens a checklist item detail page | `checklist_item_viewed` | `item_name` |

### Maintenance visit events

| Where | Event | Properties |
|-------|-------|------------|
| After a new maintenance visit is saved | `visit_added` | `has_photo` (boolean), `has_cost` (boolean) |
| After a visit is deleted | `visit_deleted` | — |

### History events

| Where | Event | Properties |
|-------|-------|------------|
| When user opens the history page | `history_viewed` | `filter_category`, `filter_period` |

### Shortcuts events

| Where | Event | Properties |
|-------|-------|------------|
| When user taps a shortcut from the dashboard | `shortcut_tapped` | `shortcut_type` (`url` / `phone` / `whatsapp`) |

### Settings events

| Where | Event | Properties |
|-------|-------|------------|
| When user changes language | `language_changed` | `from`, `to` |
| When user changes currency | `currency_changed` | `from`, `to` |
| When user saves vehicle edits | `vehicle_edited` | — |
| When user updates odometer manually from settings | `mileage_updated` | — |

### Behavior

- Same rules as Story 2: fire once per action, never block UI, no visible changes
- All events use the same `capture()` helper

---

## Story 4 — Dashboard Experiment Events

**Context:** Kopilot has PostHog integrated (Stories 1–3). We need two events to power A/B experiments on the dashboard. These events form a funnel: dashboard view → checklist widget tap. Use the `capture()` helper from `src/lib/posthog.ts`.

**What to track:**

| Where | Event | Properties |
|-------|-------|------------|
| When the dashboard page mounts | `dashboard_viewed` | — |
| When user taps the checklist summary widget on the dashboard | `checklist_widget_tapped` | — |

### Behavior

- `dashboard_viewed` fires once per page mount (not on re-renders or tab switches)
- `checklist_widget_tapped` fires on every tap (each tap is an intent signal)
- Same rules as previous stories: fire-and-forget, no visible changes

---

## Story 5 — Checklist Widget Title A/B Test

**Context:** Kopilot has PostHog integrated with dashboard experiment events (Story 4). We want to run an A/B test on the checklist widget title to measure if a different name drives more taps. The experiment is configured in PostHog as a feature flag called `checklist-section-naming`.

**What to build:**

In the dashboard checklist widget component, read the PostHog feature flag to determine which title to display:

- **Control** (default): "Checklist" — the current title, unchanged
- **Test** (`checklist-section-naming` === `'test'`): "Car Health Score"

Use `posthog.getFeatureFlag('checklist-section-naming')` to evaluate the variant. The control variant must always be the default — if the flag fails to load or returns `undefined`, show "Checklist".

```js
if (posthog.getFeatureFlag('checklist-section-naming') === 'test') {
    // Show "Car Health Score"
} else {
    // Show "Checklist" (control — always the default behaviour,
    // so if something goes wrong with flag evaluation, you don't break the app)
}
```

Both title variants should use i18n keys:

| Key | PT-BR | EN | IT |
|-----|-------|----|----|
| `dashboard.checklist.title` | Checklist | Checklist | Checklist |
| `dashboard.checklist.titleExperiment` | Car Health Score | Car Health Score | Car Health Score |

### Behavior

- Flag evaluation happens on component mount — no loading state, no flicker. Show control until the flag resolves.
- The `checklist_widget_tapped` event (Story 4) already tracks taps. PostHog automatically ties feature flag state to events, so no extra properties needed.
- No other visual changes — only the widget title text differs between variants.
