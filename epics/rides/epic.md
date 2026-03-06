# Rides

**Epic:** Trip/ride tracking (Strava-like for cars)
**Status:** Live (v1.1)
**Related stories:** [stories.md](stories.md)

---

## Problem

Users don't have visibility into their driving patterns — how often they drive, typical routes, trip durations, total km driven per month.

---

## Solution

Strava-like ride tracking for car trips with GPS trail capture and aggregate statistics.

---

## Features

- Start/stop ride recording with live GPS tracking
- GPS trail capture with high accuracy (10m minimum distance threshold)
- Snap-to-road route matching via Mapbox Directions API
- Trip statistics: duration, distance, average speed, max speed, route taken
- Trip history with Strava-style map previews
- Full-screen active ride mode with Waze-style live map
- Navigation arrow marker aligned with bearing
- Auto-named rides by time of day (Morning Ride, Afternoon Drive, etc.)
- Screen wake lock to keep display on during tracking
- Ride detail page with interactive map, stats cards, start/end locations
- Delete ride with confirmation
- Cached snapped routes in database for performance

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

- GPS tracking via browser Geolocation API (high accuracy mode)
- Map rendering via Mapbox GL JS
- Snap-to-road via Mapbox Directions API (match-route edge function)
- Wake Lock API for screen-on during tracking (progressive enhancement)
- Haversine formula for distance calculation
- Route points stored as JSON array (lat, lng, timestamp, speed, bearing)
- Mapbox token fetched via authenticated edge function
- PWA required for reliable foreground tracking
