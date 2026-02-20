# Settings

**Epic:** App settings and preferences
**Status:** MVP
**Related:** [i18n / Localisation](../i18n/epic.md)

---

## Goal

Centralized place for the user to manage their account, preferences, vehicles, and app configuration.

---

## Settings Sections

### Account
- User profile (name, email)
- Log out
- Delete account

### Preferences
- **Country:** Brazil, USA, Italy — changing country re-configures default regulatory and maintenance items, currency, units, and external links. See [Country Profiles](../country-profiles/epic.md).
- **State/Region:** Optional sub-selection for Brazil and USA; determines portal links and conditional items (e.g., emissions inspection)
- **Language:** Portugues (BR), English, Italiano
- **Currency:** BRL (R$), USD ($), EUR (euro) — auto-set by country, can be overridden
- **Units:** km / miles — auto-set by country, can be overridden
- **Notification preferences:** Enable/disable, quiet hours

### Vehicle Management
- View current vehicle(s)
- Edit vehicle details (nickname, make, model, year, mileage, plate)
- Delete vehicle (with confirmation)
- Add new vehicle (post-MVP: multiple vehicles)

### App
- Check for updates
- App version info
- Terms of service / Privacy policy
- Send feedback / Report a bug

---

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Account info and logout | P0 | Core |
| Country selection | P0 | Brazil default; changes re-configure items — see [Country Profiles](../country-profiles/epic.md) |
| State/region selection | P1 | Brazil and USA only |
| Language selection | P0 | PT-BR default |
| Currency selection | P1 | BRL default; auto-set by country |
| Vehicle management (view/edit/delete) | P0 | |
| Add multiple vehicles | P2 | Post-MVP |
| Notification preferences | P1 | |
| Check for updates | P1 | |
| Delete account | P1 | LGPD compliance |
