# Fuel

**Epic:** Fuel tracking and spending insights
**Status:** Live (v1.3)
**Related stories:** [stories.md](stories.md) | [stories-station-lookup.md](stories-station-lookup.md)

---

## Problem

Users have no visibility into their fuel spending. They fill up, pay, and forget. Over time, they can't answer basic questions: "How much do I spend on gas monthly?" "Is this station cheaper?" "Is my fuel efficiency getting worse?"

---

## Solution

Simple fuel logging that builds into powerful spending insights over time.

---

## Core Logging (per fill-up)

| Field | Type | Notes |
|-------|------|-------|
| Date | Date picker | Calendar popup |
| Station | Place search | Mapbox GPS or manual entry (PlaceSearchInput) |
| Odometer | Wheel picker | 6-digit OdometerWheelPicker, pre-filled from vehicle mileage |
| Liters | Decimal input | Side-by-side with cost |
| Total cost | Decimal input | Side-by-side with liters |
| Price per liter | Auto-calculated | Read-only (cost / liters) |
| Full tank | Toggle | Default on; required for efficiency calculation |
| Fuel type | Dropdown | Options vary by country — see [Country Profiles](../country-profiles/epic.md) |
| Notes | Textarea | Optional |

> **Note:** Fuel types, volume units, efficiency units, and currency are determined by the user's [Country Profile](../country-profiles/epic.md). For example, Etanol and Flex are Brazil-only fuel types, while GPL and Metano are Italy-specific.

---

## Screens

### Add Fuel (`/fuel/add`)

Full-screen form with staggered field animations. Fields appear in the order listed above. Sticky header with back button, sticky bottom submit button. Pre-fills odometer from vehicle's `current_mileage`. Preloads success page assets (Lottie animation + audio) while the user fills the form. On save, updates vehicle mileage if the new reading is higher.

### Edit Fuel (`/fuel/edit/:id`)

Same form as Add Fuel, pre-populated from the existing entry. Shows "Save Changes" instead of "Save".

### Fuel Detail (`/fuel/:id`)

Detail view for a single entry with edit and delete actions in the header.

- **Dark card:** date, fuel type, liters, total value, price per liter
- **Light card:** odometer, efficiency (if calculable), station, full tank status, notes
- Delete with confirmation dialog

Efficiency is only shown when both the current and previous entries have odometer readings and `full_tank=true`.

### Fuel Success (`/fuel/success`)

Full-screen celebration after logging a fill-up:

- Looping Lottie animation
- Auto-dismiss progress bar (10 seconds)
- 3-column grid: total cost, liters, price per liter
- Price comparison badge vs historical average:
  - Green if cheaper (>1% threshold)
  - Red if more expensive (>1% threshold)
  - "First fill-up!" message if no history
- Tap to dismiss, hold to pause, release to resume

### Fuel Dashboard (`/fuel`)

Main fuel screen with dark header ("Fuel" + "Add Fuel" button). Shows all the following components in order:

1. **Efficiency warning** — alert banner if recent efficiency dropped >15% vs historical (requires 5+ full tank entries)
2. **Time period filter** — Week / Month / Year / All (aligned to calendar boundaries)
3. **Stats card** — 2x2 grid: total spent, fill-ups, avg price/L, avg km/L
4. **Spending chart** — 6-month bar chart with average reference line
5. **Efficiency chart** — km/L line chart over time (requires odometer + full tank entries)
6. **Station insights** — top 3 most recent stations with price vs 30-day average
7. **Fuel history list** — entries grouped by month, each showing liters, fuel type, cost, date, station, price/L, efficiency, "Partial" badge if not full tank

### Stations (`/fuel/stations`)

Full-page view of all stations where the user has filled up:

- **Map** — Mapbox GL (dark style, 220px) with color-coded markers:
  - Green marker = cheaper than overall average
  - Red marker = more expensive than average
  - Each marker shows price badge (e.g., "R$5.50/L")
  - Centers on user location, auto-fits bounds to all stations
- **30-day average price card** — rolling average across all entries
- **Station list** — sorted by last visit (newest first), each showing:
  - Station name and address (city, district)
  - Visit count and last visit date
  - Average price with trending icon (up/down vs 30-day avg)
  - Absolute price difference
- Empty state when no stations have location data
- Accessible from station insights section ("See all stations")

---

## Station Search Flow

1. User taps station field → PlaceSearchInput drawer opens
2. Browser geolocation requested in background
3. **Proximity mode** (default): Mapbox category search for nearby gas stations with distance display
4. **Manual mode**: toggle to text input with debounced (300ms) suggest search, filtered by `gas_station,fuel` POI category
5. User selects a station → retrieve call extracts coordinates + reverse geocodes for state code
6. Address formatted as "Street, City - STATE" and saved with lat/lng and Mapbox ID

Uses the `search-places` edge function with three actions: `category` (proximity), `suggest` (text), `retrieve` (details + reverse geocode enrichment). Language-aware via i18n. Session tokens reused across suggest→retrieve flow.

---

## Statistics & Insights

- **Spending:** weekly, monthly, yearly totals with bar chart (6 months)
- **Averages:** average price per liter, average fill-up cost
- **Efficiency:** km/L over time (line chart), requires odometer + full tank
- **Efficiency warning:** alert when recent 3 fill-ups drop >15% vs historical average
- **Station insights:** top stations by recency, price comparison vs 30-day rolling average
- **Stations map:** color-coded markers showing price relative to average
- **Price comparison:** success screen shows if fill-up was cheaper or more expensive than average

---

## Data Model

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK, auto-generated |
| vehicle_id | UUID | FK to vehicles |
| date | DATE | Fill-up date |
| liters | NUMERIC | Required |
| total_cost | NUMERIC | Required |
| price_per_liter | NUMERIC | Calculated (cost / liters) |
| odometer | INTEGER | Nullable; enables efficiency calc |
| station | TEXT | Nullable; station name |
| station_mapbox_id | TEXT | Nullable; Mapbox place ID |
| station_address | TEXT | Nullable; formatted address from Mapbox |
| location_lat | NUMERIC | Nullable; station latitude |
| location_lng | NUMERIC | Nullable; station longitude |
| fuel_type | TEXT | Default 'gasolina' |
| full_tank | BOOLEAN | Default true |
| notes | TEXT | Nullable |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

Index: `idx_fuel_entries_vehicle_date` on (vehicle_id, date DESC).
RLS: users access only their own vehicle's entries.

---

## Key Algorithms

- **Efficiency:** calculated only from consecutive full tank entries with odometer: `(odometer_current - odometer_previous) / liters_current`
- **Efficiency warning:** compares average of last 3 full tank entries vs all previous; triggers at >15% drop; dismissible
- **Station aggregation:** normalized by lowercase station name; aggregates visit count, avg price, total spent, last visit, coordinates
- **30-day rolling average:** filters entries from last 30 days, averages price_per_liter
- **Odometer sync:** vehicle.current_mileage updated when fuel entry odometer exceeds current value
- **Time period filter:** ISO week start / month start / year start / no filter

---

## Advanced Features (future)

- Price alerts: "Gas at [station] is R$0.20 cheaper than your average"
- Budget setting: "You've spent 80% of your R$500 monthly fuel budget"
- Data export for personal finance tracking

---

## Value

- Financial awareness: know exactly what you spend on fuel
- Find savings: identify cheaper stations via map and price comparisons
- Early problem detection: efficiency warning signals maintenance needs
- Complete car cost picture: fuel + maintenance = true cost of ownership

---

## Technical Considerations

- GPS for station location (optional, respects privacy)
- Mapbox Search Box API v1 via `search-places` edge function (category, suggest, retrieve + reverse geocode)
- Mapbox GL JS for stations map (dark style, auth token via edge function)
- Recharts for spending and efficiency charts
- OdometerWheelPicker: 6 columns, 48px item height, circular scrolling, haptic feedback
- Lottie + audio for success page celebration
- Currency formatting based on country profile (R$, $, EUR)
- Fuel type list driven by country profile — see [Country Profiles](../country-profiles/epic.md)
- Volume and efficiency units adapt to country (liters/km per L vs gallons/MPG)
- Offline-first with React Query (5min cache, 24h GC)
