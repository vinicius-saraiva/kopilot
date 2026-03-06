# Changelog

All notable changes to Kopilot are documented here. Organized by date, newest first.

---

## 2026-03-06

### Rides
- Screen wake lock keeps display on during active GPS tracking
- Mapbox token fetched with auth headers for security
- Removed map rounded corners for cleaner ride visuals

### PWA & Offline
- Hardened PWA geolocation handling and permissions

### Fixes
- Fixed Supabase storage UPDATE/DELETE policies
- Fixed add-visit scroll behavior

---

## 2026-03-04

### Fuel
- Generalized PlaceSearchInput component (reused for gas stations and mechanic shops)
- Refined station picker UI with distance display

### Maintenance Visits
- Fixed invoice photo access with signed URLs
- Fixed image-to-signed-URL conversion

---

## 2026-03-01

### Fuel — Station Search
- Added station search input with Mapbox integration
- Nearby gas station suggestions with distance display
- Locale-aware default search on focus
- Category endpoint for empty input queries
- Persisted Mapbox ID for selected stations
- Refined station picker UI and layout

---

## 2026-02-28

### UX — Odometer Wheel Picker
- Integrated OdometerWheelPicker across fuel and vehicle forms
- Auto-updates vehicle mileage on fuel entry

---

## 2026-02-27

### i18n
- Translated all checklist item names via i18n keys
- Integrated i18n into status calculation logic
- Fixed Portuguese ride translation strings

### Checklist
- Added next due date field for regulatory items (auto-calculated from interval)

---

## 2026-02-20

### Shortcuts
- Added phone and WhatsApp shortcut types (tel: protocol)

### Offline & PWA
- Added offline data persistence via React Query + localStorage (24h cache)

### Security
- Made invoice photos private with secure signed-URL access

### Rides
- Improved match-route validation for snap-to-road

### UX — Odometer Wheel Picker
- Circular scrolling behavior with snap-after-release
- Enhanced snapping guard for precise digit selection

---

## 2026-02-19

### Auth
- Added forgot password flow (email verification link)
- Added reset password page with confirmation
- Fixed OAuth redirect URI

### UX — Odometer Wheel Picker
- Built 6-digit odometer wheel picker with haptic feedback
- Circular scrolling, smooth snap-to-nearest, mount timing fixes

### Welcome Page
- Refined Welcome page visuals and auth copy
- Updated feature card icons
- Removed install gap when PWA prompt hidden

---

## 2026-02-18

### Fuel
- Built fuel success page with Lottie animation and audio feedback
- Preloaded success assets while form is being filled
- Story-style timer with pause/resume on hold
- Added recent stations page
- Unified fuel form structure (add + edit)
- Converted fuel edit to full-screen page
- Full-screen AddFuel page
- Allowed decimal input for liters and cost
- Fixed fuel chart margins, labels, and axis formatting

---

## 2026-02-11

### Rides
- Full-screen active ride mode with live GPS tracking
- Strava-style map previews in ride history
- Snap-to-road route matching via Mapbox Directions API
- Cached snapped routes in database for performance
- Auto-named rides by time of day (Morning Ride, etc.)
- Navigation arrow marker aligned with bearing
- Waze-style live map during active tracking
- Improved ride timer accuracy
- Improved ride map rendering and load performance
- Preserved GPS state during full-screen ride view
- Fixed Mapbox token CORS issues

### Shortcuts
- Added shortcuts feature with preset options
- Icon-based quick links from dashboard (URLs, phone numbers)

### Dashboard
- Moved checklist to dedicated page (cleaner dashboard)
- Synced fuel history to calendar filter period

### Fuel
- Refactored fuel history list
- Aligned fuel period filter to calendar months

---

## 2026-02-10

### i18n
- Completed batch 3 i18n updates across all screens
- Added fuel-specific i18n strings and headers
- Enhanced i18n coverage for remaining UI elements

---

## 2026-02-06

### Auth
- Added Google Sign-In to Welcome page
- Added auth translation keys

### Fixes
- Fixed subpage scrolling issues

---

## 2026-01-30

### i18n
- Added full i18n support (PT-BR, EN, IT)
- Currency selection UI (BRL, USD, EUR, INR, GBP, AED)

### History
- Added spending chart with time period filter
- Category filter (All, Gas, Maintenance, Regulatory)
- Responsive spending summary card
- Harmonized spending header and total display

### PWA
- Added favicon SVG and 1024px splash icon
- Fixed PWA viewport and update flow
- Added PWA update button

### Dashboard
- Brand icon display with Cardog icons
- Enhanced brand select dropdown
- Car image placeholder
- Reordered bottom nav items

### Fuel
- Separately filtered fuel stats by time period

---

## 2026-01-29

### Fuel
- Implemented core fuel logging (date, type, volume, cost, station, odometer)
- Fuel statistics: spending totals, fill-up count, average efficiency
- Fuel efficiency chart (km/L over time)
- Fuel spending chart with trends

### Rides
- Reworked rides access and navigation

### History
- Consolidated unified history UI with tabs
- Refactored history into spending-focused view

### Layout
- Implemented sticky headers layout
- Removed top header from AppLayout (cleaner mobile feel)

---

## 2026-01-27 — Launch Day

### Core App
- App shell with bottom navigation (Dashboard, Checklist, Fuel, Rides, History)
- Dashboard with vehicle header, summary cards, status overview
- Checklist with 13+ trackable items (regulatory + maintenance)
- Status indicators: OK (green), Approaching (yellow), Overdue (red)
- Item detail pages with completion history
- Mark as done modal with date, mileage, cost, notes

### Vehicle Management
- Add vehicle form (nickname, make, model, year, mileage, state, plate digit)
- Vehicle data editing

### Auth
- Email/password signup and login
- Session management with protected routes

### History & Settings
- Unified history timeline
- Settings page (account, vehicle, preferences)

### Maintenance Visits
- Mechanic visit logging with date, cost, location, notes
- Invoice photo upload support

### Database
- Lovable Cloud (Supabase) schema: vehicles, tracked_items, completion_logs, fuel_entries, maintenance_visits, rides, shortcuts
- Row-level security policies

### PWA
- PWA-enabled with install prompt
- SVG icons and splash screen

### Misc
- Empty states and skeleton loading screens
- Dashboard sorting by due date per category
