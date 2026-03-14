# Kopilot — Product Requirements Document

**Tagline:** Own Your Drive.
**Last Updated:** March 2026
**Status:** Live

---

## 1. Overview

Kopilot is a mobile app that helps non-car-people maintain their vehicles. It transforms forgotten maintenance and regulatory obligations into trackable reminders with a clear, motivating interface.

The app tracks 13+ items out of the box (regulatory + maintenance, varying by country), sends proactive reminders, and logs a complete vehicle history over time. Country profiles for Brazil, USA, and Italy define which items are shown. It includes ride tracking with GPS, fuel logging with spending insights, maintenance visit logging with invoice photos, a unified spending history, shortcuts, offline support, and full i18n (PT-BR, EN, IT). Future versions will add an AI mechanic assistant and hardware integration.

---

## 2. Problem Statement

Vehicle owners who aren't automotive enthusiasts face two recurring problems:

**Maintenance neglect:** They forget fluid checks, oil changes, and component wear until something breaks — often at inconvenient or dangerous moments.

**Regulatory compliance:** They forget annual obligations (IPVA, licenciamento, insurance renewal, CNH) until they face fines, legal issues, or discover they're driving unprotected.

Both problems share the same root cause: no system reminds them proactively with enough lead time to act.

---

## 3. Target User

**Primary persona:** Vehicle owner (initially Brazil, expanding to USA and Italy) who:
- Is not an automotive enthusiast
- Forgets maintenance schedules
- Has been caught off-guard by regulatory deadlines
- Wants clarity, not complexity
- Responds well to reminders and progress tracking

**Not targeting (for now):**
- Car enthusiasts who already track everything
- Fleet managers (B2B use case)
- Mechanics or automotive professionals

---

## 4. Features

Each feature is documented in detail in its own file under `/epics`.

### Live

| Feature | Description | Spec |
|---------|-------------|------|
| **Onboarding** | Welcome page, auth (email + Google), forgot/reset password, add vehicle | [epics/onboarding/epic.md](epics/onboarding/epic.md) |
| **Dashboard** | Vehicle header, summary cards (checklist, fuel, rides, history), shortcuts | [epics/dashboard/epic.md](epics/dashboard/epic.md) |
| **Checklist** | 13+ trackable items (regulatory + maintenance), status indicators, mark as done with cost/mileage | [epics/dashboard/epic.md](epics/dashboard/epic.md) |
| **Country Profiles** | Country-based configuration for Brazil, USA, Italy (items, fuel types, currency, units, state selection) | [epics/country-profiles/epic.md](epics/country-profiles/epic.md) |
| **Rides** | GPS trip tracking with live map, snap-to-road, speed/distance/elevation stats, speed chart, ride history, wake lock | [epics/rides/epic.md](epics/rides/epic.md) |
| **Fuel** | Fuel logging with station search (Mapbox), stations map, efficiency charts, spending insights, odometer wheel picker | [epics/fuel/epic.md](epics/fuel/epic.md) |
| **History** | Unified spending timeline (fuel + maintenance + visits + regulatory), category filters, spending chart | [epics/history/epic.md](epics/history/epic.md) |
| **Maintenance Visits** | Mechanic visit logging with location search, invoice photo upload, signed URLs | [epics/history/epic.md](epics/history/epic.md) |
| **Settings** | Account, language, currency, vehicle management, mileage update, PWA updates | [epics/settings/epic.md](epics/settings/epic.md) |
| **i18n** | Full multi-language support (PT-BR, EN, IT) with locale-aware formatting | [epics/i18n/epic.md](epics/i18n/epic.md) |
| **Shortcuts** | Quick-access links from dashboard (URLs, phone/WhatsApp, custom icons) | — |
| **Offline & PWA** | Offline data persistence (localStorage), installable PWA, auto-update checking | — |
| **Privacy Policy** | Legal privacy disclosure covering all collected data | [epics/privacy-policy/epic.md](epics/privacy-policy/epic.md) |
| **Landing Page** | Marketing page with hero, features, CTA | [epics/landing-page/epic.md](epics/landing-page/epic.md) |

### Planned

| Feature | Description | Target | Spec |
|---------|-------------|--------|------|
| **Kopilot+** | Monthly subscription (R$15, Brazil only) with partner discounts — Stripe integration, dashboard promo card, info page | v1.x | [epics/kopilot-plus/epic.md](epics/kopilot-plus/epic.md) |
| **Insurance** | Dedicated insurance section: contacts, shortcuts, policy PDF, payment tracking | v1.x | [epics/insurance/epic.md](epics/insurance/epic.md) |

### Future (to be planned)

| Feature | Description | Target | Spec |
|---------|-------------|--------|------|
| **Mechanic AI Assistant** | AI-powered diagnostic assistant (text, voice, photo) | v2.x | [epics/mechanic-ai-assistant/epic.md](epics/mechanic-ai-assistant/epic.md) |
| **Car Sensor Hardware** | OBD-II integration for real-time vehicle data | v3.0+ | [epics/car-sensor-hardware/epic.md](epics/car-sensor-hardware/epic.md) |
| **WhatsApp / Telegram Bot** | Messaging bot for reminders and quick logging | TBD | [epics/whatsapp-telegram-bot/epic.md](epics/whatsapp-telegram-bot/epic.md) |

---

## 5. Technical Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Lovable | Visual builder, generates React code |
| **Backend** | Lovable Cloud | Managed backend services |
| **AI Features** | Lovable AI | For future Mechanic feature |
| **Maps & Location** | Mapbox | GPS tracking, station search, snap-to-road, place search |
| **Platform** | PWA (installable mobile web app) | Wake lock, offline persistence, auto-update |
| **Offline** | React Query + localStorage | 24h cache, offline-first network mode |

---

## 6. Roadmap

| Phase | Focus | Key Features | Status |
|-------|-------|--------------|--------|
| **v1.0** | Core utility | Onboarding, Dashboard, Checklist, History, Settings, i18n | Done |
| **v1.1** | Engagement | Rides (GPS tracking), Fuel (logging + insights), Shortcuts, PWA/Offline | Done |
| **v1.2** | Polish | Station search (Mapbox), Odometer wheel picker, Forgot password, Invoice photos | Done |
| **v1.3** | Depth | Stations map, ride elevation/speed chart, branded auth emails, onboarding UX | Done |
| **v1.x** | Richer features | Insurance card, photo-based history, notification reminders | Next |
| **v2.x** | AI + Advanced | AI Mechanic assistant, advanced fuel analytics | Planned |
| **v3.0+** | Hardware | OBD-II integration, real-time car data | Future |

---

## 7. Success Criteria

Since this is initially a tool for personal use:

- [ ] I (Vinicius) use it weekly
- [ ] It successfully reminds me before IPVA/Licenciamento deadlines
- [ ] I never miss an oil change again
- [ ] I check tire pressure monthly because it reminds me
- [ ] The app is simple enough that I don't abandon it

---

*Kopilot PRD — March 2026*
