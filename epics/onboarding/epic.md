# Onboarding

**Epic:** New user onboarding flow
**Status:** MVP

---

## Goal

Guide a new user from first launch to a functional dashboard with at least one vehicle and a few trackable items configured. The flow should feel fast, friendly, and skippable — no one should feel blocked.

---

## User Flow

```
1. Welcome screen → value proposition ("Own Your Drive")
2. Country selection:
   - Select country (Brazil, USA, Italy)
   - Optional: select state/region (Brazil, USA) for precise portal links
   - Sets currency, units, and default language automatically
   - See [Country Profiles](../country-profiles/epic.md) for full mapping
3. Add vehicle (manual input):
   - Nickname (e.g., "Meu Palio")
   - Make / Model / Year (optional but encouraged)
   - Current mileage (km or miles, based on country)
   - Plate final digit + state (Brazil) or other identifiers per country
4. Quick setup prompts (vary by selected country):
   - Brazil: "When is your IPVA due?", "When does your insurance expire?", "When did you last change the oil?"
   - USA: "When is your registration due?", "When does your insurance expire?", "When did you last change the oil?"
   - Italy: "When is your Bollo Auto due?", "When does your RCA expire?", "When did you last change the oil?"
   (User can skip any/all and add later)
5. → Dashboard
```

---

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Welcome screen with value proposition | P0 | First impression |
| Country selection (Brazil, USA, Italy) | P0 | Determines items, currency, units — see [Country Profiles](../country-profiles/epic.md) |
| Optional state/region selection | P1 | For Brazil and USA; refines portal links and conditional items |
| Add vehicle (nickname, make, model, year, mileage, plate) | P0 | Core setup |
| Quick setup prompts for key items (country-dependent) | P0 | Prompts adapt to selected country profile |
| Skip option on every step | P0 | No friction |
| Navigate to Dashboard on completion | P0 | |

---

## Design Notes

- Keep it to 3-4 screens max
- Progress indicator so user knows how many steps remain
- Vehicle nickname is required; everything else optional
- Consider pre-filling common makes/models per country market
- Country defaults to Brazil; user can change during onboarding or later in [Settings](../settings/epic.md)
