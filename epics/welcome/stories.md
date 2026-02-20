# Welcome Page — Content Update

## Lovable Prompt

Paste the following directly into Lovable:

---

I need to update the auth pages (`/welcome`, `/login`, `/signup`) to reflect the app's full scope. Only text content and icons change — layout, animations, CTAs, and structure stay the same.

### 1. Tagline (shared across /welcome, /login, /signup)

The `auth.tagline` key is used on all 3 auth pages. Change it once in each locale file and it updates everywhere:

- EN: "Your copilot for vehicle maintenance" → "Your car's companion app"
- PT: "Seu copiloto para manutenção veicular" → "O app companheiro do seu carro"
- IT: "Il tuo copilota per la manutenzione del veicolo" → "L'app compagna della tua auto"

### 2. Feature cards — replace all 3

Replace the current 3 feature cards in `Welcome.tsx` and the corresponding translation keys in all locale files.

**Card 1** — Icon: Shield (keep current)
- EN: `features.manageVehicle` → "Never miss a thing"
- EN: `features.manageVehicleDesc` → "Track deadlines, maintenance, and regulatory items — all color-coded by urgency"
- PT: `features.manageVehicle` → "Nunca mais esqueça"
- PT: `features.manageVehicleDesc` → "Acompanhe prazos, manutenções e documentos — tudo organizado por urgência"
- IT: `features.manageVehicle` → "Non dimenticare più nulla"
- IT: `features.manageVehicleDesc` → "Monitora scadenze, manutenzioni e documenti — tutto organizzato per urgenza"

**Card 2** — Icon: change from Bell to TrendingUp (import from lucide-react)
- EN: `features.getReminders` → "Track every cent"
- EN: `features.getRemindersDesc` → "Log fuel, mechanic visits, and see your spending by category"
- PT: `features.getReminders` → "Controle cada centavo"
- PT: `features.getRemindersDesc` → "Registre abastecimentos, visitas ao mecânico e veja seus gastos por categoria"
- IT: `features.getReminders` → "Traccia ogni centesimo"
- IT: `features.getRemindersDesc` → "Registra rifornimenti, visite dal meccanico e visualizza le spese per categoria"

**Card 3** — Icon: change from Shield to MapPin (import from lucide-react). The first card already uses Shield.
- EN: `features.keepUpToDate` → "Know your car"
- EN: `features.keepUpToDateDesc` → "Record drives with GPS, track mileage, and see your full vehicle history"
- PT: `features.keepUpToDate` → "Conheça seu carro"
- PT: `features.keepUpToDateDesc` → "Registre viagens com GPS, acompanhe a quilometragem e veja o histórico completo"
- IT: `features.keepUpToDate` → "Conosci la tua auto"
- IT: `features.keepUpToDateDesc` → "Registra i viaggi con il GPS, monitora il chilometraggio e consulta lo storico completo"

### Summary of icon changes in Welcome.tsx:
- Card 1: Shield (no change)
- Card 2: Bell → TrendingUp
- Card 3: Car → MapPin

### Files to change:
- `src/pages/Welcome.tsx` — update icon imports (replace Bell and Car with TrendingUp and MapPin)
- `src/i18n/locales/en.json` — update `auth.tagline` + all 6 feature strings
- `src/i18n/locales/pt-BR.json` — update `auth.tagline` + all 6 feature strings
- `src/i18n/locales/it.json` — update `auth.tagline` + all 6 feature strings

Do NOT change: layout, animations, CTA buttons, Google Sign-In, or any structural element.
