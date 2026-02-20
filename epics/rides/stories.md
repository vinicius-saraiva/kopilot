# Kopilot — Rides Feature
## User Stories Document

**Feature:** Trip Tracking (Strava for Driving)  
**Version:** v2.0  
**Status:** Ready for Implementation

---

## Overview

**Problem:** Users have no visibility into their driving patterns — how often they drive, typical routes, trip durations, total km driven per month. This makes maintenance intervals guesswork.

**Solution:** Strava-like ride tracking for car trips. Record trips with GPS, view route maps, track aggregate driving stats over time.

**Core value:**
- Self-awareness: "I drive 1,200 km/month" → better maintenance planning
- Trip memories: "That road trip to Floripa in March 2024"
- Automatic mileage: No more manual odometer input
- Future: Usage-based insurance data

---

## Data Model

```
Ride {
  id: string
  vehicleId: string
  startTime: DateTime
  endTime: DateTime (null if in progress)
  status: 'active' | 'completed' | 'discarded'
  
  // Route data
  routePoints: Array<{lat, lng, timestamp, speed?}>
  
  // Computed stats
  distanceKm: number
  durationMinutes: number
  avgSpeedKmh: number
  maxSpeedKmh: number
  
  // Metadata
  title: string (optional) — user can name trips
  notes: string (optional)
  startLocation: string (reverse geocoded)
  endLocation: string (reverse geocoded)
  
  createdAt: Date
  updatedAt: Date
}
```

```
DrivingStats {
  vehicleId: string
  period: 'week' | 'month' | 'year' | 'all'
  totalKm: number
  totalRides: number
  totalDurationMinutes: number
  avgRideDistanceKm: number
  avgRideDurationMinutes: number
}
```

---

## User Stories

### Epic 1: Core Ride Tracking

#### Story 1.1: Start a Ride
**As a** user  
**I want to** start recording a trip with one tap  
**So that** I can track my drive without friction

**Acceptance Criteria:**
- [ ] Prominent "Start Ride" button on Rides tab
- [ ] Tap starts GPS tracking immediately
- [ ] UI shows active ride state (timer running, distance accumulating)
- [ ] App requests location permission if not granted
- [ ] Works in foreground initially (background is Story 1.4)

**Priority:** P0

---

#### Story 1.2: View Active Ride
**As a** user  
**I want to** see my current trip stats while driving  
**So that** I know the ride is being recorded

**Acceptance Criteria:**
- [ ] Live display: elapsed time, distance traveled
- [ ] Current speed (optional, if GPS provides)
- [ ] Map showing route traced so far
- [ ] Clear visual that recording is active (pulsing indicator)
- [ ] "End Ride" button always accessible

**Priority:** P0

---

#### Story 1.3: End a Ride
**As a** user  
**I want to** stop recording and see my trip summary  
**So that** I can review what I just drove

**Acceptance Criteria:**
- [ ] "End Ride" stops GPS tracking
- [ ] Summary screen shows: total distance, duration, avg speed
- [ ] Map displays complete route
- [ ] Start/end locations shown (reverse geocoded addresses)
- [ ] Option to save or discard
- [ ] Save stores ride to history

**Priority:** P0

---

#### Story 1.4: Background Tracking
**As a** user  
**I want to** track my ride even when the app is in background  
**So that** I can use other apps or lock my phone while driving

**Acceptance Criteria:**
- [ ] GPS continues recording when app backgrounded
- [ ] Notification shows ride in progress (Android/iOS)
- [ ] Tapping notification returns to active ride screen
- [ ] Battery optimization: reduce GPS frequency when stationary
- [ ] Graceful handling if OS kills background process

**Priority:** P0 (critical for real-world use)

**Technical Note:** This may require native capabilities. For PWA/web, document limitations clearly to user.

---

#### Story 1.5: Discard a Ride
**As a** user  
**I want to** discard a ride I don't want to keep  
**So that** my history stays clean

**Acceptance Criteria:**
- [ ] "Discard" option on ride summary screen
- [ ] Confirmation dialog: "Discard this ride?"
- [ ] Discarded rides are deleted (not soft-deleted)
- [ ] Returns to Rides tab

**Priority:** P1

---

### Epic 2: Ride History

#### Story 2.1: View Ride History
**As a** user  
**I want to** see a list of all my past rides  
**So that** I can review my driving history

**Acceptance Criteria:**
- [ ] Rides tab shows list in reverse chronological order
- [ ] Each card shows: Date, distance, duration, start→end locations
- [ ] Visual grouping by week or month
- [ ] Empty state: "No rides yet. Start your first trip!"
- [ ] Pull-to-refresh

**Priority:** P0

---

#### Story 2.2: View Ride Details
**As a** user  
**I want to** tap a ride to see full details and map  
**So that** I can remember a specific trip

**Acceptance Criteria:**
- [ ] Full-screen map showing route
- [ ] Stats: distance, duration, avg speed, max speed
- [ ] Start/end times and locations
- [ ] Title and notes (if added)
- [ ] Edit and delete options

**Priority:** P0

---

#### Story 2.3: Edit Ride Details
**As a** user  
**I want to** add a title and notes to a ride  
**So that** I can remember the context of memorable trips

**Acceptance Criteria:**
- [ ] Edit title (e.g., "Road trip to Floripa")
- [ ] Edit notes (free text)
- [ ] Cannot edit route data or stats (those are recorded facts)
- [ ] Save updates the ride

**Priority:** P1

---

#### Story 2.4: Delete a Ride
**As a** user  
**I want to** delete a ride from my history  
**So that** I can remove incorrect or unwanted records

**Acceptance Criteria:**
- [ ] Delete option in ride detail view
- [ ] Confirmation required
- [ ] Deletion removes ride and route data
- [ ] Stats recalculate to exclude deleted ride

**Priority:** P1

---

### Epic 3: Driving Statistics

#### Story 3.1: View Weekly/Monthly Stats
**As a** user  
**I want to** see aggregate driving statistics  
**So that** I understand my driving patterns

**Acceptance Criteria:**
- [ ] Stats section on Rides tab (above or below history)
- [ ] Toggle: This Week / This Month / All Time
- [ ] Display: Total km, Total rides, Total time
- [ ] Display: Avg distance per ride, Avg duration per ride
- [ ] Updates automatically as rides are added

**Priority:** P1

---

#### Story 3.2: Monthly Km for Maintenance
**As a** user  
**I want to** see my average monthly km  
**So that** I can estimate when maintenance is due

**Acceptance Criteria:**
- [ ] "You drive ~X km/month" prominently shown
- [ ] Calculated from last 3 months of data (or available data)
- [ ] Links conceptually to maintenance reminders (future integration)

**Priority:** P1

---

#### Story 3.3: Visual Stats Chart
**As a** user  
**I want to** see a chart of my driving over time  
**So that** I can spot patterns visually

**Acceptance Criteria:**
- [ ] Bar chart: km per week (last 8 weeks) or per month (last 6 months)
- [ ] Tappable bars show exact values
- [ ] Follows brand colors (Blaze for bars)

**Priority:** P2

---

### Epic 4: Map & Route Display

#### Story 4.1: Route Map on Ride Detail
**As a** user  
**I want to** see my route drawn on a map  
**So that** I can visualize where I drove

**Acceptance Criteria:**
- [ ] Map displays full route as polyline
- [ ] Route color: Blaze (#FF5F1F)
- [ ] Start point marker (green or distinct)
- [ ] End point marker (red or distinct)
- [ ] Map auto-zooms to fit entire route
- [ ] Supports pan/zoom gestures

**Priority:** P0

**Technical Note:** Use Mapbox, Google Maps, or Leaflet with OpenStreetMap.

---

#### Story 4.2: Live Map During Active Ride
**As a** user  
**I want to** see my route building in real-time  
**So that** I can confirm tracking is working

**Acceptance Criteria:**
- [ ] Map updates as new GPS points recorded
- [ ] Current position shown with distinct marker
- [ ] Map follows current position (can be toggled off)
- [ ] Smooth polyline rendering

**Priority:** P1

---

## UI/UX Notes

**Rides Tab Structure:**
```
┌─────────────────────────────┐
│  [Stats Summary Card]       │
│  This month: 847 km         │
│  12 rides · 14h 23m         │
├─────────────────────────────┤
│  [Start Ride Button]        │  ← Prominent FAB or card
│  ●  START RIDE              │
├─────────────────────────────┤
│  Recent Rides               │
│  ┌─────────────────────┐    │
│  │ Today · 23 km · 34m │    │
│  │ Home → Office       │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Yesterday · 45 km   │    │
│  │ Office → Gym → Home │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Active Ride Screen:**
```
┌─────────────────────────────┐
│  ● RECORDING                │  ← Pulsing indicator
├─────────────────────────────┤
│                             │
│      [Map with route]       │
│                             │
├─────────────────────────────┤
│   12.4 km    00:18:32      │
│   distance      time        │
├─────────────────────────────┤
│      [END RIDE]             │  ← Blaze button
└─────────────────────────────┘
```

**Brand Alignment:**
- Use Blaze (#FF5F1F) for active states, route lines, CTAs
- Athletic/Strava-like feel: bold stats, minimal chrome
- Celebratory moment on ride completion (streak potential for v2.1)

---

## Technical Considerations

**GPS & Location:**
- Request `ACCESS_FINE_LOCATION` (Android) / `whenInUse` + `always` (iOS)
- Sample rate: 1 point per 5 seconds (balance accuracy vs battery)
- Filter out GPS noise (points with low accuracy)
- Handle tunnel/parking garage signal loss gracefully

**Battery Optimization:**
- Reduce sample rate when speed < 5 km/h (stopped)
- Use significant location changes API where available
- Show battery impact warning on first use

**Map Provider:**
- Mapbox GL JS (free tier generous, good offline support)
- Alternative: Leaflet + OpenStreetMap (fully free)
- Google Maps (reliable but costs scale with usage)

**Data Storage:**
- Route points can be large — compress or simplify for storage
- Consider storing simplified polyline for display, full data optionally
- Lovable Cloud should handle, but monitor storage costs

**Privacy:**
- All data local-first (stored on device/user's account only)
- No sharing features in v2.0
- Clear data deletion path

**PWA Limitations:**
- Background GPS unreliable in browsers
- Consider: "Keep app open while driving" guidance
- Native app may be required for production-quality tracking

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Ride recording adoption | >30% of active users record ≥1 ride in first 30 days | Feature discovery |
| Rides per active user | >4 rides/month for engaged users | Habit formation |
| Completion rate | >80% of started rides are saved (not discarded) | UX quality |
| Background tracking success | >90% of rides complete without data loss | Technical reliability |

---

## Out of Scope (v2.0)

- Auto-start detection (motion sensors) — v2.1
- Ride sharing/social features — v3.0
- Leaderboards/challenges — v2.1
- Fuel consumption tracking — separate feature
- Speed limit warnings — v2.1
- Integration with maintenance reminders — v2.1
- Offline maps — v2.1
- Export rides (GPX/KML) — v2.1

---

## Implementation Sequence

**Phase 1: Core Loop (P0)**
1. Data model + storage for Rides
2. Start Ride flow with GPS capture
3. Active Ride screen with live stats
4. End Ride + summary screen
5. Basic ride history list
6. Ride detail with static map

**Phase 2: Background & Polish (P0-P1)**
7. Background tracking implementation
8. Notification for active ride
9. Ride editing (title, notes)
10. Delete ride flow

**Phase 3: Stats & Visualization (P1-P2)**
11. Aggregate stats calculation
12. Stats display on Rides tab
13. Live map during active ride
14. Stats chart visualization

---

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Background GPS unreliable in PWA | Document limitation; plan native app for v2.1 |
| Battery drain concerns | Optimize sampling; show battery tips; let users adjust |
| Map costs at scale | Start with Mapbox free tier; monitor usage |
| Large route data storage | Implement polyline simplification |
| GPS accuracy in urban canyons | Filter low-accuracy points; show data quality indicator |

---

*Ready for Lovable implementation. Start with Phase 1 to validate core loop, then iterate based on real-world testing.*
