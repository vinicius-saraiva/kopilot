# Rides

**Epic:** Trip/ride tracking (Strava-like for cars)
**Status:** Planned (v2.0)
**Related stories:** [stories.md](stories.md)

---

## Problem

Users don't have visibility into their driving patterns — how often they drive, typical routes, trip durations, total km driven per month.

---

## Solution

Strava-like ride tracking for car trips with GPS trail capture and aggregate statistics.

---

## Features

- Start/stop ride recording
- GPS trail capture
- Trip statistics: duration, distance, average speed, route taken
- Aggregate stats: trips per week, most common routes, monthly km
- Trip history with map visualization

---

## User Flow

```
1. User starts a trip → taps "Start Ride" (or auto-detect via motion)
2. App records GPS trail in background
3. User ends trip → sees summary (distance, time, route)
4. Trip saved to history
5. Dashboard shows driving stats over time
```

---

## Value

- **Self-awareness:** "I drive 1,200 km/month" → better maintenance planning
- **Trip memories:** "That road trip to Floripa in March 2024"
- **Mileage estimation:** Auto-calculate current km based on tracked rides
- **Insurance potential:** Usage-based insurance data

---

## Technical Considerations

- Background GPS tracking (battery optimization critical)
- Map rendering (Mapbox / Google Maps)
- Privacy: local-first, user controls what's shared
- May require native app for reliable background tracking
