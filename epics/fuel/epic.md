# Fuel

**Epic:** Fuel tracking and spending insights
**Status:** Live (v1.1)
**Related stories:** [stories.md](stories.md) | [stories-station-lookup.md](stories-station-lookup.md)

---

## Problem

Users have no visibility into their fuel spending. They fill up, pay, and forget. Over time, they can't answer basic questions: "How much do I spend on gas monthly?" "Is this station cheaper?" "Is my fuel efficiency getting worse?"

---

## Solution

Simple fuel logging that builds into powerful spending insights over time.

---

## Core Logging (per fill-up)

- Date
- Fuel type (options vary by country — see [Country Profiles](../country-profiles/epic.md))
- Volume purchased (liters or gallons, based on country)
- Total cost (currency based on country)
- Price per unit (auto-calculated or manual)
- Location/station (optional, with GPS)
- Odometer reading (optional, enables efficiency calculation)

> **Note:** Fuel types, volume units, efficiency units, and currency are determined by the user's [Country Profile](../country-profiles/epic.md). For example, Etanol and Flex are Brazil-only fuel types, while GPL and Metano are Italy-specific.

---

## User Flow

```
1. User fills up at gas station
2. Opens Kopilot → taps "Log Fuel" (full-screen page)
3. Inputs: date, fuel type, liters (decimal), total cost
4. Station: nearby search via Mapbox GPS or manual entry (PlaceSearchInput)
5. Odometer: 6-digit wheel picker (OdometerWheelPicker) with haptic feedback
6. Optional: full tank toggle, notes
7. Price per liter auto-calculates (read-only)
8. Save → animated success page with Lottie + audio feedback
9. Over time → fuel dashboard with charts and insights
```

## What's Built

- Full fuel logging with all fields above
- Station search via Mapbox (search-places edge function) with distance display
- OdometerWheelPicker with circular scrolling and snap behavior
- Fuel success page with Lottie animation, story timer, audio feedback
- Preloaded success assets while form is being filled
- Edit fuel entries with pre-filled form
- Fuel statistics card: monthly spending, fill-up count, avg km/L
- Fuel efficiency chart (km/L over time)
- Fuel spending chart with time period filter
- Station insights (frequent stations, average prices)
- Fuel history list sorted by date with efficiency display
- Time period filter (Week, Month, Year, All) aligned to calendar
- Fuel type selection per country profile

---

## Statistics & Insights

- **Spending:** Weekly, monthly, yearly totals
- **Averages:** Average price per liter paid, average fill-up cost
- **Efficiency:** km/L or MPG (based on country; requires odometer tracking)
- **Trends:** Spending over time (line chart), efficiency changes
- **Location insights:** Price comparison between stations, cheapest stations map

---

## Advanced Features (future)

- Price alerts: "Gas at [station] is R$0.20 cheaper than your average"
- Anomaly detection: "Your efficiency dropped 15% — might indicate a problem"
- Budget setting: "You've spent 80% of your R$500 monthly fuel budget"

---

## Value

- Financial awareness: know exactly what you spend on fuel
- Find savings: identify cheaper stations over time
- Early problem detection: declining efficiency signals maintenance needs
- Complete car cost picture: fuel + maintenance = true cost of ownership

---

## Technical Considerations

- GPS for station location (optional, respects privacy)
- Integration with Rides feature: auto-prompt fuel log after long trips
- Charts/visualization library for stats
- Currency formatting based on country profile (R$, $, euro)
- Fuel type list driven by country profile — see [Country Profiles](../country-profiles/epic.md)
- Volume and efficiency units adapt to country (liters/km per L vs gallons/MPG)
- Data export for personal finance tracking
