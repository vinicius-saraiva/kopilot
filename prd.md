# Kopilot — Product Requirements Document

**Tagline:** Own Your Drive.
**Last Updated:** February 2025
**Status:** Draft

---

## 1. Overview

Kopilot is a mobile app that helps non-car-people maintain their vehicles. It transforms forgotten maintenance and regulatory obligations into trackable reminders with a clear, motivating interface.

The app tracks 13+ items out of the box (regulatory + maintenance, varying by country), sends proactive reminders, and logs a complete vehicle history over time. Country profiles for Brazil, USA, and Italy define which items are shown. Future versions will add ride tracking, fuel insights, an AI mechanic assistant, and hardware integration.

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

### Core (MVP)

| Feature | Description | Spec |
|---------|-------------|------|
| **Onboarding** | New user flow: welcome, country selection, add vehicle, quick setup | [epics/onboarding/epic.md](epics/onboarding/epic.md) |
| **Dashboard** | Home page with all trackable items, status indicators, reminders | [epics/dashboard/epic.md](epics/dashboard/epic.md) |
| **Country Profiles** | Country-based configuration of regulatory items, maintenance items, currency, and units (Brazil, USA, Italy) | [epics/country-profiles/epic.md](epics/country-profiles/epic.md) |
| **History** | Unified timeline of all vehicle events (maintenance, fuel, docs, mechanic visits) | [epics/history/epic.md](epics/history/epic.md) |
| **Settings** | Account, country, language, currency, vehicle management, updates | [epics/settings/epic.md](epics/settings/epic.md) |
| **i18n** | Multi-language support (PT-BR, EN, IT) | [epics/i18n/epic.md](epics/i18n/epic.md) |

### Planned

| Feature | Description | Target | Spec |
|---------|-------------|--------|------|
| **Insurance** | Dedicated insurance section: contacts, shortcuts, policy PDF, payment tracking | v1.x | [epics/insurance/epic.md](epics/insurance/epic.md) |
| **Landing Page** | Marketing page for waitlist/download conversion | Pre-launch | [epics/landing-page/epic.md](epics/landing-page/epic.md) |
| **Rides** | Strava-like trip tracking with GPS and stats | v2.0 | [epics/rides/epic.md](epics/rides/epic.md) |
| **Fuel** | Fuel logging, spending insights, station comparison | v2.x | [epics/fuel/epic.md](epics/fuel/epic.md) |

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
| **Platform** | Mobile-responsive web app (PWA potential) | Native apps post-MVP |
| **Offline** | Core functionality works offline, sync when connected | |

---

## 6. Roadmap

| Phase | Focus | Key Features |
|-------|-------|--------------|
| **MVP (v1.0)** | Core utility | Onboarding, Dashboard, History, Settings |
| **v1.x** | Richer history | Photo-based maintenance logging, invoice storage |
| **v2.0** | Engagement | Rides tracking, driving stats |
| **v2.x** | Financial + AI | Fuel tracking, spending insights, AI Mechanic |
| **v3.0+** | Hardware | OBD-II integration, real-time car data |

---

## 7. Success Criteria

Since this is initially a tool for personal use:

- [ ] I (Vinicius) use it weekly
- [ ] It successfully reminds me before IPVA/Licenciamento deadlines
- [ ] I never miss an oil change again
- [ ] I check tire pressure monthly because it reminds me
- [ ] The app is simple enough that I don't abandon it

---

*Kopilot PRD — February 2025*
