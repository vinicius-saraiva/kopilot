# Onboarding Stories

Stories grouped by Lovable prompt. Implementation sequence: Story 1 first (intro screens), then Story 2+ for setup screens.

---

## Story 1 — Intro Story Screens

**Context:** Kopilot is a vehicle maintenance app. After signup, before any setup, we show 3 full-screen story slides that introduce the app's value. The interaction pattern is identical to the existing `FuelSuccess.tsx` page (progress bar, tap to advance, hold to pause).

**What to build:**

A new page `/onboarding` with 3 sequential full-screen story slides. After the last slide, navigate to the first setup screen (country selection — Story 2).

### Interaction (reuse FuelSuccess pattern)

- **Progress bar at top:** 3 segmented bars (one per slide). The active segment fills over time. Completed segments stay filled. Upcoming segments are empty.
- **Auto-advance:** Each slide auto-advances after 5 seconds (shorter than FuelSuccess's 10s — these are lighter content).
- **Tap right half:** Advance to next slide (or exit on last slide).
- **Tap left half:** Go back to previous slide (restart its timer). On first slide, do nothing.
- **Hold (pointer down):** Pause the timer and any animation.
- **Release after hold:** Resume.
- **Swipe:** Not needed — tap is enough.

### Slide content

Each slide is full-screen, dark background (`bg-asphalt`), centered content.

**Slide 1 — Maintenance & Documents**
- Icon: `Shield` (lucide) — same icon already used on Welcome.tsx
- Headline: i18n key `onboarding.intro.maintenance.title`
- Subtext: i18n key `onboarding.intro.maintenance.subtitle`
- Suggested PT-BR copy:
  - Title: "Manutenção em dia"
  - Subtitle: "Controle revisões, documentos e seguro do seu veículo. Sem surpresas."

**Slide 2 — Fuel & Efficiency**
- Icon: `CircleDollarSign` (lucide) — same icon already used on Welcome.tsx
- Headline: i18n key `onboarding.intro.fuel.title`
- Subtext: i18n key `onboarding.intro.fuel.subtitle`
- Suggested PT-BR copy:
  - Title: "Cada litro conta"
  - Subtitle: "Registre abastecimentos, compare preços e acompanhe seu km/L."

**Slide 3 — Rides**
- Icon: `MapPin` (lucide) — same icon already used on Welcome.tsx
- Headline: i18n key `onboarding.intro.rides.title`
- Subtext: i18n key `onboarding.intro.rides.subtitle`
- Suggested PT-BR copy:
  - Title: "Registre cada viagem"
  - Subtitle: "GPS, rotas e velocidade. Seu histórico completo de direção."

### Behavior

- After the 3rd slide completes (auto-advance or tap), navigate to `/onboarding/setup` (or whatever route Story 2 defines for country selection).
- If user has already completed onboarding (has a vehicle), skip directly to dashboard `/`.
- The page should be added to the router as a protected route (user must be logged in).
- Bottom of each slide: "Toque para continuar" (`onboarding.intro.tapToContinue`) — pulsing text, same as FuelSuccess.

### i18n keys to add

```json
{
  "onboarding": {
    "intro": {
      "maintenance": {
        "title": "Manutenção em dia",
        "subtitle": "Controle revisões, documentos e seguro do seu veículo. Sem surpresas."
      },
      "fuel": {
        "title": "Cada litro conta",
        "subtitle": "Registre abastecimentos, compare preços e acompanhe seu km/L."
      },
      "rides": {
        "title": "Registre cada viagem",
        "subtitle": "GPS, rotas e velocidade. Seu histórico completo de direção."
      },
      "tapToContinue": "Toque para continuar"
    }
  }
}
```

Add equivalent keys in `en.json` and `it.json`.

### Acceptance criteria

- [ ] 3 full-screen story slides with segmented progress bar
- [ ] Tap right to advance, tap left to go back, hold to pause
- [ ] Auto-advance after 5 seconds per slide
- [ ] Icons and copy match spec above
- [ ] After last slide, navigates to setup flow
- [ ] Skips onboarding if user already has a vehicle
- [ ] All strings use i18n keys (PT-BR, EN, IT)

### Reference

- `src/pages/FuelSuccess.tsx` — reuse the rAF timer loop, pointer down/up pattern, and progress bar style
- `src/pages/Welcome.tsx` — the 3 icons (Shield, CircleDollarSign, MapPin) are already used here

---

## Story 2 — Country Selection

**Context:** First setup screen after the intro stories. The user picks their country, which determines currency, units, language, regulatory items, and fuel types (see Country Profiles epic).

**What to build:**

A screen at `/onboarding/country` (or step within a multi-step onboarding page).

### Screen content

- Headline: "Onde você está?" / "Where are you?" / "Dove sei?" (`onboarding.setup.country.title`)
- Three large selectable cards, one per country. Each shows:
  - Country flag emoji (🇧🇷, 🇺🇸, 🇮🇹)
  - Country name
- Default selection: Brazil (pre-selected)
- **State/region selector** appears conditionally after selecting Brazil or USA. Not shown for Italy.
  - Brazil: dropdown with 27 UF states (reuse the state list from `AddVehicle.tsx`)
  - USA: dropdown with 50 states
  - Label: "Estado" / "State" / "Stato" (`onboarding.setup.country.state`)
- Continue button at bottom

### Behavior

- Selecting a country sets the app's locale (language, currency, units) immediately
- State/region is optional — user can skip
- Continue navigates to Story 3 (vehicle type)
- Progress indicator: step 1 of 4

### i18n keys

```json
{
  "onboarding": {
    "setup": {
      "country": {
        "title": "Onde você está?",
        "state": "Estado",
        "continue": "Continuar"
      }
    }
  }
}
```

### Acceptance criteria

- [ ] 3 country cards with flag and name
- [ ] Brazil pre-selected
- [ ] State/region dropdown appears for Brazil and USA only
- [ ] Selecting country changes app locale
- [ ] Progress indicator shows step 1 of 4
- [ ] Continue navigates to vehicle type screen

---

## Story 3 — Vehicle Type Selection

**Context:** Second setup screen. The user picks whether they have a car or a motorcycle.

**What to build:**

A screen asking the user to pick their vehicle type.

### Screen content

- Headline: "O que você dirige?" / "What do you drive?" / "Cosa guidi?" (`onboarding.setup.vehicleType.title`)
- Two large selectable cards:
  - Car — `Car` icon (lucide)
  - Motorcycle — `Bike` icon (lucide)
- No default selection — user must pick one
- Continue button at bottom (disabled until selection made)

### Behavior

- Selection stored for use in the next screens (affects icon displayed, and future item defaults)
- Continue navigates to Story 4 (brand selection)
- Progress indicator: step 2 of 4

### i18n keys

```json
{
  "onboarding": {
    "setup": {
      "vehicleType": {
        "title": "O que você dirige?",
        "car": "Carro",
        "motorcycle": "Moto"
      }
    }
  }
}
```

### Acceptance criteria

- [ ] Two large cards: car and motorcycle
- [ ] Continue button disabled until a type is selected
- [ ] Progress indicator shows step 2 of 4
- [ ] Continue navigates to brand selection screen

---

## Story 4 — Brand Selection (Arc Picker)

**Context:** Third setup screen. The user selects their vehicle's brand using a custom fan/arc picker component. This is a standalone Lovable project that must be ported into the main app.

**What to build:**

A full-screen brand selection screen using the `FanScalePicker` component from the repo `v2-kopilot-brand-arc-picker`.

### Reference component

The component is at `src/components/FanScalePicker.tsx` in the `v2-kopilot-brand-arc-picker` Lovable project. Key details:

- Uses `framer-motion` for pan gesture, spring animation, and snap-to-nearest
- Brand icons from `@cardog-icons/react` (already installed in kopilot-autos)
- Arc layout: icons arranged on a fan arc (radius 500px, 12° per item)
- Drag horizontally to scroll through brands, snaps with inertia
- Haptic feedback on brand change (`navigator.vibrate`)
- Selected brand shown as large text above the arc
- Confirm button at bottom

### What to adapt

- **Add the `FanScalePicker` component** to the main kopilot-autos project. Port it as-is — the component is self-contained.
- **Expand the brand list** to include all brands already defined in `BrandSelect.tsx` (40+ brands). Keep the same `@cardog-icons/react` icons.
- **Add an "Other" option** at the end of the arc with a generic `Car` icon (lucide). When selected, show a text input for custom brand name.
- **Replace the confirm button** label with i18n key `onboarding.setup.brand.confirm`
- **Replace "Select Your Brand"** label with i18n key `onboarding.setup.brand.subtitle`
- After confirmation, navigate to Story 5 (vehicle details)
- Progress indicator: step 3 of 4

### Screen content

- Selected brand name displayed large above the arc (already built in FanScalePicker)
- Subtitle: "Selecione a marca" / "Select your brand" / "Seleziona il marchio" (`onboarding.setup.brand.subtitle`)
- Arc picker with all brands
- Confirm button: "Confirmar" / "Confirm" / "Conferma" (`onboarding.setup.brand.confirm`)

### i18n keys

```json
{
  "onboarding": {
    "setup": {
      "brand": {
        "subtitle": "Selecione a marca",
        "confirm": "Confirmar",
        "other": "Outra"
      }
    }
  }
}
```

### Acceptance criteria

- [ ] Fan arc picker ported from v2-kopilot-brand-arc-picker
- [ ] All brands from BrandSelect.tsx available in the arc
- [ ] "Other" option with custom text input
- [ ] Haptic feedback on brand change
- [ ] Snap-to-nearest with inertia on release
- [ ] Progress indicator shows step 3 of 4
- [ ] Confirm navigates to vehicle details screen

---

## Story 4b — Country-Specific Brand List

**Context:** Story 4 (arc picker) is already implemented with a static brand list. This story makes the brand list dynamic — showing only the 20 most popular brands for the user's selected country (from Story 2).

**What to build:**

A `country_brands` table in Supabase and update the `FanScalePicker` to load brands from it instead of a hardcoded list.

### Database table: `country_brands`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| country | text | `BR`, `US`, `IT` |
| brand | text | Brand name (matches `@cardog-icons/react` naming) |
| sort_order | integer | 1–20, by popularity in that market |

### Seed data

**Brazil (BR)**

| sort_order | brand |
|------------|-------|
| 1 | Fiat |
| 2 | Volkswagen |
| 3 | Chevrolet |
| 4 | Toyota |
| 5 | Hyundai |
| 6 | Honda |
| 7 | Jeep |
| 8 | Renault |
| 9 | Nissan |
| 10 | Citroën |
| 11 | Peugeot |
| 12 | Caoa Chery |
| 13 | BYD |
| 14 | Mitsubishi |
| 15 | Ford |
| 16 | BMW |
| 17 | Mercedes-Benz |
| 18 | Kia |
| 19 | Audi |
| 20 | GWM |

**USA (US)**

| sort_order | brand |
|------------|-------|
| 1 | Toyota |
| 2 | Chevrolet |
| 3 | Ford |
| 4 | Honda |
| 5 | Hyundai |
| 6 | Kia |
| 7 | Nissan |
| 8 | Jeep |
| 9 | Tesla |
| 10 | BMW |
| 11 | Mercedes-Benz |
| 12 | Subaru |
| 13 | Volkswagen |
| 14 | Ram |
| 15 | GMC |
| 16 | Mazda |
| 17 | Lexus |
| 18 | Audi |
| 19 | Dodge |
| 20 | Buick |

**Italy (IT)**

| sort_order | brand |
|------------|-------|
| 1 | Fiat |
| 2 | Volkswagen |
| 3 | Toyota |
| 4 | Dacia |
| 5 | Peugeot |
| 6 | Renault |
| 7 | Ford |
| 8 | Citroën |
| 9 | Hyundai |
| 10 | BMW |
| 11 | Kia |
| 12 | Audi |
| 13 | Mercedes-Benz |
| 14 | Opel |
| 15 | Jeep |
| 16 | Nissan |
| 17 | Škoda |
| 18 | Alfa Romeo |
| 19 | Suzuki |
| 20 | MG |

### Changes to FanScalePicker

- On mount, query `country_brands` filtered by the user's selected country (from onboarding state), ordered by `sort_order`
- Map each brand to its `@cardog-icons/react` icon using the existing `getBrandInfo()` helper from `BrandSelect.tsx`. If no icon exists for a brand (e.g. Dacia, GWM, Buick), display the brand name as text on the arc tick instead of an icon — use a short abbreviation or the full name, styled to fit the tick size
- Append "Other" as the last item (not in the table — always added client-side) with a generic `Car` icon
- If the query fails or is slow, fall back to showing all brands from the current hardcoded list
- The table is public read — no RLS needed (reference data)

### Behavior

- The arc picker now shows 21 items (20 from table + "Other")
- Everything else about the picker interaction stays the same (pan, snap, haptic, confirm)
- "Other" still shows a text input for custom brand name when selected

### Acceptance criteria

- [ ] `country_brands` table created with seed data for BR, US, IT
- [ ] FanScalePicker loads brands from table based on selected country
- [ ] Brands appear in popularity order (sort_order)
- [ ] "Other" always appears last
- [ ] Fallback to hardcoded list if query fails
- [ ] Icon mapping reuses existing `getBrandInfo()` logic

---

## Story 5 — Model, Year & Nickname

**Context:** After brand selection. The user enters their vehicle's model, year, and optionally a nickname.

**What to build:**

A screen that collects model, year, and nickname. Brand is already selected (from Story 4) and shown as context.

### Screen content

- Header shows the selected brand (icon + name) as confirmation of previous step
- Fields:
  - **Model** — text input (`onboarding.setup.vehicle.model`)
  - **Year** — number input, 1900 to current+1 (`onboarding.setup.vehicle.year`)
  - **Nickname** (optional) — text input, placeholder: "Ex: Meu Palio" (`onboarding.setup.vehicle.nicknamePlaceholder`). Hint below: if left empty, the model name is used as the vehicle's display name (`onboarding.setup.vehicle.nicknameHint`)
- Continue button at bottom

### Behavior

- Brand comes from Story 4 state — pre-filled, not editable on this screen (user goes back to change)
- All fields optional, but model is encouraged
- If nickname is empty, the vehicle's display name defaults to the model name. If both empty, defaults to the brand name.
- Continue navigates to Story 6 (plate)
- Progress indicator: step 4 of 6

### i18n keys

```json
{
  "onboarding": {
    "setup": {
      "vehicle": {
        "model": "Modelo",
        "year": "Ano",
        "nicknamePlaceholder": "Ex: Meu Palio",
        "nicknameHint": "Opcional. Se vazio, usamos o nome do modelo."
      }
    }
  }
}
```

### Acceptance criteria

- [ ] Brand icon and name shown from previous step
- [ ] Model, year, and nickname fields
- [ ] Nickname optional with hint text
- [ ] Progress indicator shows step 4 of 6
- [ ] Continue navigates to plate screen

---

## Story 6 — Plate Number (Skippable)

**Context:** Quick optional step to capture the plate number.

**What to build:**

A screen that asks for the vehicle's plate number with a prominent skip option.

### Screen content

- Headline: "Qual a placa?" / "What's your plate?" / "Qual è la targa?" (`onboarding.setup.plate.title`)
- **Plate number** — text input, uppercase auto-format (`onboarding.setup.plate.input`)
- Continue button at bottom
- Skip link above or below the button: "Pular" / "Skip" / "Salta" (`onboarding.setup.plate.skip`)

### Behavior

- Plate is fully optional
- Skip and Continue both navigate to Story 7 (odometer)
- Progress indicator: step 5 of 6

### i18n keys

```json
{
  "onboarding": {
    "setup": {
      "plate": {
        "title": "Qual a placa?",
        "input": "Placa",
        "skip": "Pular"
      }
    }
  }
}
```

### Acceptance criteria

- [ ] Single plate input field with uppercase formatting
- [ ] Skip link clearly visible
- [ ] Progress indicator shows step 5 of 6
- [ ] Both skip and continue navigate to odometer screen

---

## Story 7 — Odometer (Skippable)

**Context:** Last setup step. The user sets their current mileage using the wheel picker.

**What to build:**

A screen with the `OdometerWheelPicker` component (already exists in the app) and a skip option.

### Screen content

- Headline: "Quilometragem atual" / "Current mileage" / "Chilometraggio attuale" (`onboarding.setup.odometer.title`)
- `OdometerWheelPicker` component — centered, prominent
- Finish button: "Começar" / "Let's go" / "Iniziamo" (`onboarding.setup.odometer.finish`)
- Skip link: "Definir depois" / "Set later" / "Imposta dopo" (`onboarding.setup.odometer.skip`)

### Behavior

- If skipped, mileage is saved as 0 (can be set later in Settings)
- On submit (finish or skip): create the vehicle in the database with all data collected across Stories 4–7, then navigate to dashboard `/`
- Progress indicator: step 6 of 6
- The existing `AddVehicle.tsx` page should be kept but is no longer part of the onboarding flow. It can still be used for adding a second vehicle later.

### i18n keys

```json
{
  "onboarding": {
    "setup": {
      "odometer": {
        "title": "Quilometragem atual",
        "finish": "Começar",
        "skip": "Definir depois"
      }
    }
  }
}
```

### Acceptance criteria

- [ ] OdometerWheelPicker centered and prominent
- [ ] Skip link clearly visible
- [ ] Creates vehicle on submit with all accumulated onboarding data
- [ ] Navigates to dashboard on finish or skip
- [ ] Progress indicator shows step 6 of 6
- [ ] Existing AddVehicle.tsx preserved for adding additional vehicles
