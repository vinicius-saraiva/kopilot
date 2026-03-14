# Onboarding

**Epic:** New user onboarding flow
**Status:** Live (v1.3)
**Related stories:** [stories.md](stories.md)

---

## Goal

Guide a new user from account creation to a functional dashboard with one vehicle configured. The flow has two phases: an aspirational intro that sells the app's value, then a fast progressive setup. No friction — every step should feel lightweight.

---

## User Flow

```
INTRO (story screens — tap to advance, auto-progress bar)
1. Maintenance, documents & insurance — "Keep everything on track"
2. Fuel tracking, prices & efficiency — "Know what you spend"
3. Rides — "Track every drive"

SETUP (one thing per screen, progress indicator — 6 steps)
4. Country selection:
   - Select country (Brazil, USA, Italy)
   - Optional: select state/region (Brazil, USA) for portal links
   - Sets currency, units, and default language automatically
   - See [Country Profiles](../country-profiles/epic.md) for full mapping
5. Vehicle type: car or motorcycle
6. Brand selection (arc picker — FanScalePicker component)
7. Model, year, nickname (nickname optional — defaults to model name)
8. Plate number (skippable)
9. Odometer (skippable) — wheel picker, option to set later
10. → Dashboard
```

---

## Intro Stories

Three full-screen story slides. Reuse the same interaction pattern as the fuel success page: progress bar at top, tap to advance, hold to pause, auto-advance on timer.

Each story should feel aspirational — the goal is to make the user want to use the app, not to explain features. Short copy, strong visuals. Background can be imagery, video, or app screenshots in the future; for now use what's available.

| Story | Theme | Message |
|-------|-------|---------|
| 1 | Maintenance & documents | Keep your vehicle healthy and your documents in check |
| 2 | Fuel & efficiency | Track every fill-up, compare prices, know your km/L |
| 3 | Rides | Record your drives, see your routes |

---

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Intro story screens (3 slides) | P0 | Aspirational, story-style interaction (tap/hold/auto-advance) |
| Country selection with optional state/region | P0 | Determines items, currency, units — see [Country Profiles](../country-profiles/epic.md) |
| Vehicle type selection (car / motorcycle) | P0 | New — affects icon and future item defaults |
| Brand selection (arc picker) | P0 | FanScalePicker component — full brand list with "Other" option |
| Model, year, nickname | P0 | Nickname optional — defaults to model name if empty |
| Plate number (skippable) | P1 | User can skip and add later |
| Odometer (skippable) | P1 | Wheel picker component; user can set later in Settings |
| Progress indicator on setup screens | P0 | 6 steps total |
| Skip option on every setup step | P0 | No friction |
| Navigate to Dashboard on completion | P0 | |

---

## Design Notes

- Intro stories: full-screen, dark background, minimal text, bold visuals
- Setup screens: one question per screen, large touch targets, clean transitions
- Progress indicator visible on setup screens (not on intro stories — those use the story progress bar)
- No required fields — nickname defaults to model name, which defaults to brand name
- Country defaults to Brazil; can be changed later in [Settings](../settings/epic.md)
- Consider pre-filling common makes/models per country market
