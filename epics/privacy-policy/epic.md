# Privacy Policy

**Epic:** Privacy policy page for Kopilot
**Status:** Planned
**Target:** Before landing page goes live

---

## Goal

Provide a clear, legally sound privacy notice accessible from the landing page footer ("Privacy" link). Must cover all data the app collects today — authentication, vehicle data, GPS tracking, financial data, photos, and third-party services.

---

## Scope

The privacy policy must disclose:

| Category | Data collected |
|----------|---------------|
| **Account** | Email, password (hashed), Google/Apple OAuth tokens |
| **Vehicle** | Make, model, year, mileage, plate digit, state |
| **Maintenance** | Service dates, costs, mileage, notes, completion history |
| **Location/GPS** | Real-time coordinates, speed, bearing, route history (during ride tracking) |
| **Fuel** | Cost, liters, price per liter, fuel type, station name, station GPS coordinates |
| **Financial** | All fuel, maintenance, and mechanic visit costs |
| **Photos** | Invoice images (JPG/PNG/WebP/HEIC, up to 10MB, stored in cloud) |
| **Preferences** | Language, currency (stored in browser localStorage) |
| **Session** | JWT tokens, session data (browser localStorage) |

### Third parties

| Service | Data shared | Purpose |
|---------|------------|---------|
| **Supabase** | All user data, photos | Database, auth, file storage |
| **Mapbox** | GPS coordinates (ride routes) | Road-snapping / route matching |
| **Google** | Email, profile (at OAuth time) | Authentication |
| **Apple** | User identity (at OAuth time) | Authentication |
| **Google Fonts** | IP address, User-Agent | Font delivery (Outfit) |

### Key facts to disclose
- No analytics or tracking pixels
- No data sold to third parties
- Invoice photos stored in cloud (Supabase Storage)
- GPS data stored indefinitely unless user deletes
- Row-Level Security: users can only access their own data
- PWA caches assets locally for offline use

---

## Implementation

See [privacy-policy.md](./privacy-policy.md) for the full document ready to publish.
