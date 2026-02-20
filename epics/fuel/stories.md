# Kopilot — Fuel Tracking Feature
## User Stories Document

**Feature:** Fuel Logging & Spending Insights  
**Version:** v2.x  
**Status:** Ready for Implementation

---

## Overview

**Problem:** Users have no visibility into fuel spending. They fill up, pay, and forget. Over time, they can't answer: "How much do I spend on gas monthly?" "Is this station cheaper?" "Is my car's efficiency getting worse?"

**Solution:** Simple fuel logging that builds into powerful spending insights over time.

**Core value:**
- Financial awareness: Know exactly what you spend on fuel
- Find savings: Identify cheaper stations over time
- Early problem detection: Declining efficiency signals maintenance needs
- Complete car cost picture: Fuel + maintenance = true cost of ownership

---

## Data Model

```
FuelEntry {
  id: string
  vehicleId: string
  date: DateTime
  
  // Core data
  liters: number
  totalCost: number (BRL)
  pricePerLiter: number (auto-calculated or manual override)
  
  // Optional enrichment
  odometer: number (optional) — enables efficiency calc
  station: string (optional) — station name
  location: {lat, lng} (optional) — GPS coordinates
  fuelType: 'gasolina' | 'etanol' | 'diesel' | 'gnv' (optional)
  fullTank: boolean (default true) — needed for accurate efficiency
  
  notes: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

```
FuelStats {
  vehicleId: string
  period: 'week' | 'month' | 'year' | 'all'
  
  // Spending
  totalSpent: number (BRL)
  avgFillUpCost: number
  avgPricePerLiter: number
  fillUpCount: number
  
  // Efficiency (requires odometer data)
  avgKmPerLiter: number (nullable)
  totalKmDriven: number (nullable)
  totalLitersUsed: number
}
```

---

## User Stories

### Epic 1: Core Fuel Logging

#### Story 1.1: Log a Fill-Up
**As a** user  
**I want to** quickly log a fuel fill-up with liters and cost  
**So that** I can track my fuel spending over time

**Acceptance Criteria:**
- [ ] "Log Fuel" accessible from Fuel tab (FAB or prominent button)
- [ ] Required fields: Date (default today), Liters, Total Cost (R$)
- [ ] Price per liter auto-calculates (totalCost ÷ liters)
- [ ] User can override price per liter if needed
- [ ] BRL currency formatting with R$ symbol
- [ ] Save creates entry in fuel history
- [ ] Success feedback: toast confirmation

**Priority:** P0

---

#### Story 1.2: Add Odometer Reading
**As a** user  
**I want to** optionally log my odometer when filling up  
**So that** I can track fuel efficiency (km/L)

**Acceptance Criteria:**
- [ ] Optional odometer field on fill-up form
- [ ] Validates odometer > previous reading (if exists)
- [ ] Shows last recorded odometer as reference
- [ ] Efficiency only calculated when odometer data available

**Priority:** P0

---

#### Story 1.3: Add Station Location
**As a** user  
**I want to** save which station I filled up at  
**So that** I can compare prices between stations

**Acceptance Criteria:**
- [ ] Optional station name field (free text)
- [ ] Optional "Use current location" button (GPS)
- [ ] If GPS used, reverse geocode to readable address
- [ ] Station name auto-suggests from previous entries

**Priority:** P1

---

#### Story 1.4: Select Fuel Type
**As a** user  
**I want to** log which fuel type I used  
**So that** I can track spending by fuel type (especially etanol vs gasolina)

**Acceptance Criteria:**
- [ ] Optional fuel type selector: Gasolina, Etanol, Diesel, GNV
- [ ] Default based on last fill-up (or vehicle setting)
- [ ] Stats can filter/group by fuel type

**Priority:** P1

**Note:** Brazil-specific — etanol vs gasolina decision is common for flex-fuel vehicles.

---

#### Story 1.5: Mark Partial Fill
**As a** user  
**I want to** indicate when I didn't fill the tank completely  
**So that** efficiency calculations remain accurate

**Acceptance Criteria:**
- [ ] "Full tank?" toggle (default: yes)
- [ ] When partial, efficiency not calculated for this fill-up
- [ ] Visual indicator on partial fill entries

**Priority:** P2

**Note:** Accurate km/L requires full-tank-to-full-tank measurement.

---

### Epic 2: Fuel History

#### Story 2.1: View Fuel History
**As a** user  
**I want to** see a list of all my fill-ups  
**So that** I can review my fuel spending history

**Acceptance Criteria:**
- [ ] Fuel tab shows entries in reverse chronological order
- [ ] Each card shows: Date, Liters, Total Cost, Price/L
- [ ] Shows station name if entered
- [ ] Shows efficiency (km/L) if calculable
- [ ] Empty state: "No fill-ups yet. Log your first!"
- [ ] Pull-to-refresh

**Priority:** P0

---

#### Story 2.2: View Fill-Up Details
**As a** user  
**I want to** tap a fill-up to see full details  
**So that** I can review all logged information

**Acceptance Criteria:**
- [ ] Detail view shows all fields
- [ ] If location saved, show on mini-map
- [ ] Edit and delete options available
- [ ] Shows calculated efficiency if odometer data exists

**Priority:** P0

---

#### Story 2.3: Edit a Fill-Up
**As a** user  
**I want to** edit a past fill-up entry  
**So that** I can correct mistakes

**Acceptance Criteria:**
- [ ] All fields editable
- [ ] Recalculates price/L and efficiency on save
- [ ] Validates odometer against adjacent entries

**Priority:** P1

---

#### Story 2.4: Delete a Fill-Up
**As a** user  
**I want to** delete a fill-up entry  
**So that** I can remove incorrect records

**Acceptance Criteria:**
- [ ] Delete requires confirmation
- [ ] Stats recalculate after deletion
- [ ] Returns to history list

**Priority:** P1

---

### Epic 3: Spending Statistics

#### Story 3.1: View Spending Summary
**As a** user  
**I want to** see how much I spend on fuel  
**So that** I understand my fuel costs

**Acceptance Criteria:**
- [ ] Stats card on Fuel tab (above history)
- [ ] Period toggle: This Week / This Month / This Year / All Time
- [ ] Display: Total spent (R$), Number of fill-ups
- [ ] Display: Average fill-up cost, Average price per liter

**Priority:** P0

---

#### Story 3.2: View Monthly Spending Trend
**As a** user  
**I want to** see my fuel spending over time  
**So that** I can spot trends and budget better

**Acceptance Criteria:**
- [ ] Bar or line chart: spending per month (last 6 months)
- [ ] Tappable to see exact values
- [ ] Follows brand colors (Blaze for bars/line)

**Priority:** P1

---

#### Story 3.3: Compare Price Per Liter Over Time
**As a** user  
**I want to** see how fuel prices have changed  
**So that** I know if I'm paying more or less than usual

**Acceptance Criteria:**
- [ ] Line chart: price per liter over time
- [ ] Shows my average vs recent fill-ups
- [ ] Can filter by fuel type (gasolina vs etanol)

**Priority:** P2

---

### Epic 4: Fuel Efficiency

#### Story 4.1: Calculate Km per Liter
**As a** user  
**I want to** see my car's fuel efficiency  
**So that** I can monitor if something's wrong

**Acceptance Criteria:**
- [ ] Efficiency = (current odometer - previous odometer) ÷ liters
- [ ] Only calculated when both fill-ups have odometer + full tank
- [ ] Displayed on fill-up detail and in stats
- [ ] Unit: km/L (Brazilian standard)

**Priority:** P0

---

#### Story 4.2: View Average Efficiency
**As a** user  
**I want to** see my overall fuel efficiency average  
**So that** I have a baseline for comparison

**Acceptance Criteria:**
- [ ] Stats show: Average km/L (when data available)
- [ ] Based on all valid efficiency calculations
- [ ] Shows "Add odometer to track efficiency" if no data

**Priority:** P1

---

#### Story 4.3: Efficiency Trend Chart
**As a** user  
**I want to** see my efficiency over time  
**So that** I can detect if my car is consuming more fuel

**Acceptance Criteria:**
- [ ] Line chart: km/L per fill-up (where calculable)
- [ ] Horizontal line showing average
- [ ] Visual alert if recent values significantly below average

**Priority:** P2

---

#### Story 4.4: Efficiency Warning
**As a** user  
**I want to** be alerted if my fuel efficiency drops significantly  
**So that** I can investigate potential issues early

**Acceptance Criteria:**
- [ ] Alert if last 3 fill-ups average >15% below historical average
- [ ] Non-intrusive: banner on Fuel tab, not push notification
- [ ] Message: "Your efficiency dropped 18% recently. Might be worth checking."
- [ ] Dismissable

**Priority:** P2

---

### Epic 5: Station Insights

#### Story 5.1: View Stations List
**As a** user  
**I want to** see all stations I've used  
**So that** I can compare where I fill up

**Acceptance Criteria:**
- [ ] List of unique stations from history
- [ ] Each shows: Station name, times visited, avg price paid
- [ ] Sorted by most visited or cheapest

**Priority:** P2

---

#### Story 5.2: Compare Station Prices
**As a** user  
**I want to** see which station is cheapest  
**So that** I can save money

**Acceptance Criteria:**
- [ ] Stations ranked by average price per liter
- [ ] Shows price difference from your overall average
- [ ] "You save R$X per fill-up at [station]"

**Priority:** P2

---

## UI/UX Notes

**Fuel Tab Structure:**
```
┌─────────────────────────────┐
│  [Stats Summary Card]       │
│  This month: R$ 847         │
│  6 fill-ups · 8.2 km/L avg  │
├─────────────────────────────┤
│  [Log Fuel Button]          │  ← Prominent FAB or card
│  ⛽  LOG FILL-UP            │
├─────────────────────────────┤
│  Recent Fill-ups            │
│  ┌─────────────────────┐    │
│  │ Today · 45L · R$270 │    │
│  │ Shell Centro · 8.4km/L│   │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Jan 22 · 40L · R$232│    │
│  │ Ipiranga Mall       │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Log Fuel Form:**
```
┌─────────────────────────────┐
│  LOG FILL-UP                │
├─────────────────────────────┤
│  Date          [Today    ▼] │
│  Liters        [45.0      ] │
│  Total Cost    [R$ 270.00 ] │
│  Price/L       R$ 6.00  ✓   │ ← Auto-calculated
├─────────────────────────────┤
│  + Add Details (optional)   │
│    Odometer    [87,234 km ] │
│    Station     [Shell...  ] │
│    📍 Use location          │
│    Fuel type   [Gasolina ▼] │
│    ☑ Full tank              │
├─────────────────────────────┤
│         [SAVE FILL-UP]      │
└─────────────────────────────┘
```

**Brand Alignment:**
- Blaze (#FF5F1F) for CTAs, chart highlights
- Clean card-based layout
- Numbers prominent — this is a financial tracking feature
- Success green for good efficiency, warning amber for drops

---

## Technical Considerations

**Currency & Locale:**
- Format as Brazilian Real: R$ 6,00 (comma decimal separator)
- Use Intl.NumberFormat for proper BRL formatting
- Handle both comma and period input for decimals

**Efficiency Calculation:**
```
km/L = (currentOdometer - previousOdometer) / liters
```
- Only valid when both readings exist and both were full tanks
- Store calculated efficiency on the entry for quick retrieval

**GPS & Location:**
- Request location permission only when user taps "Use location"
- Reverse geocode to human-readable address
- Store both coordinates and formatted address

**Integration with Rides:**
- Future: Auto-prompt "Log fuel?" after long rides end
- Future: Use ride distance data if odometer not logged

**Data Export:**
- Future: Export to CSV for personal finance apps
- Include all fields for spreadsheet analysis

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Fuel logging adoption | >40% of active users log ≥1 fill-up in first 30 days | Feature discovery |
| Logging frequency | >3 fill-ups/month for engaged users | Matches real-world fill-up frequency |
| Odometer capture rate | >50% of fill-ups include odometer | Enables efficiency tracking |
| Efficiency awareness | Users can state their avg km/L | Core value delivered |

---

## Out of Scope (v2.x)

- Real-time gas price data from external APIs — v3.0
- Price alerts ("Gas is cheap at X right now") — v3.0
- Budget setting and alerts — v2.x+
- Fuel cost prediction ("You'll spend R$X this month") — v3.0
- Integration with payment apps — not planned
- Receipt photo capture — evaluate if users want this

---

## Implementation Sequence

**Phase 1: Core Logging (P0)**
1. Data model + storage for FuelEntry
2. Log Fuel form (date, liters, cost, price/L calculation)
3. Fuel history list
4. Fill-up detail view
5. Basic stats (total spent, avg price)

**Phase 2: Efficiency Tracking (P0-P1)**
6. Odometer field on form
7. Efficiency calculation logic
8. Display efficiency on entries and stats
9. Edit/delete fill-up

**Phase 3: Enrichment (P1-P2)**
10. Station name field with autocomplete
11. GPS location capture
12. Fuel type selection
13. Full tank toggle

**Phase 4: Insights (P2)**
14. Spending trend chart
15. Efficiency trend chart
16. Efficiency warning banner
17. Station comparison

---

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Users don't log odometer | Make it optional; show value prop ("track efficiency") |
| Inconsistent data (partial fills, missed entries) | Efficiency calcs handle gaps gracefully |
| BRL formatting edge cases | Test thoroughly with Brazilian locale |
| GPS permission denied | Gracefully degrade; manual station entry works fine |
| Feature overlap with Rides mileage | Design for integration, not competition |

---

*Ready for Lovable implementation. Start with Phase 1 (core logging loop), validate adoption, then layer in efficiency and insights.*
