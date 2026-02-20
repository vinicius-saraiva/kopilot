# Kopilot — Internationalization (i18n)
## Spec & User Stories Document

**Feature:** Multi-Language Support  
**Version:** v1.x  
**Status:** Ready for Implementation  
**Languages:** Portuguese (pt-BR), English (en), Italian (it)

---

## Overview

**Goal:** Make Kopilot accessible to Portuguese, English, and Italian speakers with a seamless language switching experience.

**Approach:** Use `react-i18next` — the industry-standard React internationalization library. It's mature, well-documented, and handles translations, pluralization, date/number formatting, and dynamic content.

**User control:** Language is selectable from Settings screen, persisted to user preferences, and applied app-wide instantly.

---

## Technical Architecture

### Library Stack

| Package | Purpose |
|---------|---------|
| `i18next` | Core i18n framework |
| `react-i18next` | React bindings (hooks, components) |
| `i18next-browser-languagedetector` | Auto-detect browser language on first visit |
| `i18next-http-backend` | Load translation files dynamically (optional, for large apps) |

### Installation

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### File Structure

```
src/
├── i18n/
│   ├── index.ts              # i18next configuration
│   └── locales/
│       ├── pt-BR/
│       │   ├── common.json       # Shared UI elements
│       │   ├── dashboard.json    # Dashboard screen
│       │   ├── maintenance.json  # Maintenance items
│       │   ├── fuel.json         # Fuel tracking
│       │   ├── rides.json        # Rides tracking
│       │   └── settings.json     # Settings screen
│       ├── en/
│       │   ├── common.json
│       │   ├── dashboard.json
│       │   ├── maintenance.json
│       │   ├── fuel.json
│       │   ├── rides.json
│       │   └── settings.json
│       └── it/
│           ├── common.json
│           ├── dashboard.json
│           ├── maintenance.json
│           ├── fuel.json
│           ├── rides.json
│           └── settings.json
```

### i18next Configuration

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ptBRCommon from './locales/pt-BR/common.json';
import ptBRDashboard from './locales/pt-BR/dashboard.json';
// ... other imports

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        common: ptBRCommon,
        dashboard: ptBRDashboard,
        // ... other namespaces
      },
      'en': { /* ... */ },
      'it': { /* ... */ },
    },
    fallbackLng: 'pt-BR',  // Default to Portuguese
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,  // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation('dashboard');
  
  return (
    <h1>{t('title')}</h1>  // "Meu Veículo" | "My Vehicle" | "Il Mio Veicolo"
  );
}
```

### Language Switching

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Persisted automatically to localStorage
  };
  
  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="pt-BR">Português</option>
      <option value="en">English</option>
      <option value="it">Italiano</option>
    </select>
  );
}
```

---

## Locale-Specific Formatting

### Date Formatting

Use `Intl.DateTimeFormat` or i18next's built-in datetime formatter.

| Locale | Example Date |
|--------|--------------|
| pt-BR | 30 de janeiro de 2026 |
| en | January 30, 2026 |
| it | 30 gennaio 2026 |

```typescript
// In translation file
{
  "lastUpdated": "Last updated: {{date, datetime}}"
}

// In component
t('lastUpdated', { date: new Date() })
```

### Number Formatting

| Locale | Example Number |
|--------|----------------|
| pt-BR | 1.234,56 |
| en | 1,234.56 |
| it | 1.234,56 |

### Currency Formatting

| Locale | Example (BRL) |
|--------|---------------|
| pt-BR | R$ 1.234,56 |
| en | BRL 1,234.56 |
| it | 1.234,56 BRL |

```typescript
// Custom formatter for BRL
const formatCurrency = (value: number, locale: string) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
```

---

## Translation Content Organization

### Namespaces

| Namespace | Content |
|-----------|---------|
| `common` | Buttons, labels, errors, navigation, generic UI |
| `dashboard` | Dashboard screen, vehicle overview |
| `maintenance` | Maintenance items, reminders, history |
| `fuel` | Fuel tracking, stations, efficiency |
| `rides` | Trip tracking, route, stats |
| `settings` | Settings screen, preferences |
| `onboarding` | Welcome flow, setup prompts |

### Translation Key Conventions

Use dot notation for nested keys, descriptive names:

```json
{
  "dashboard": {
    "title": "My Vehicle",
    "healthScore": "Health Score",
    "nextDue": "Next Due",
    "noItems": "No items to display"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit"
  },
  "status": {
    "ok": "OK",
    "approaching": "Approaching",
    "overdue": "Overdue"
  }
}
```

### Pluralization

i18next handles plurals automatically:

```json
{
  "rides_one": "{{count}} ride",
  "rides_other": "{{count}} rides"
}
```

```tsx
t('rides', { count: 5 })  // "5 rides"
t('rides', { count: 1 })  // "1 ride"
```

### Interpolation (Dynamic Content)

```json
{
  "greeting": "Hello, {{name}}!",
  "oilDue": "Oil change due in {{days}} days",
  "efficiency": "{{value}} km/L"
}
```

```tsx
t('greeting', { name: 'Vinicius' })  // "Hello, Vinicius!"
t('oilDue', { days: 15 })            // "Oil change due in 15 days"
```

---

## User Stories

### Epic 1: Core i18n Infrastructure

#### Story 1.1: Set Up i18next
**As a** developer  
**I want to** configure i18next with react-i18next  
**So that** the app can support multiple languages

**Acceptance Criteria:**
- [ ] i18next installed and configured
- [ ] Language detection from browser on first visit
- [ ] Fallback language set to Portuguese (pt-BR)
- [ ] Language preference persisted to localStorage
- [ ] App wrapped in I18nextProvider

**Priority:** P0

**Technical Notes:**
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

---

#### Story 1.2: Create Translation File Structure
**As a** developer  
**I want to** organize translation files by language and namespace  
**So that** translations are maintainable as the app grows

**Acceptance Criteria:**
- [ ] Folder structure: `src/i18n/locales/{lang}/{namespace}.json`
- [ ] Namespaces created: common, dashboard, maintenance, fuel, rides, settings, onboarding
- [ ] All three languages have matching file structure
- [ ] Keys are consistent across all language files

**Priority:** P0

---

#### Story 1.3: Translate Common UI Elements
**As a** user  
**I want to** see buttons, labels, and navigation in my language  
**So that** I can understand the basic interface

**Acceptance Criteria:**
- [ ] `common.json` contains: buttons (Save, Cancel, Delete, Edit, Back, Next)
- [ ] Navigation labels translated
- [ ] Error messages translated
- [ ] Success messages/toasts translated
- [ ] Empty states translated
- [ ] All three languages complete

**Priority:** P0

---

### Epic 2: Language Selection

#### Story 2.1: Add Language Setting
**As a** user  
**I want to** select my preferred language from Settings  
**So that** I can use the app in my native language

**Acceptance Criteria:**
- [ ] Settings screen has "Language" / "Idioma" option
- [ ] Tapping opens language selector
- [ ] Options: Português, English, Italiano
- [ ] Current language shown as selected
- [ ] Selection changes app language immediately
- [ ] Preference saved and persists across sessions

**Priority:** P0

**UI Note:**
```
┌─────────────────────────────┐
│  SETTINGS                   │
├─────────────────────────────┤
│  Language              🇧🇷  │  ← Shows flag or language name
│  Português             ▶    │
├─────────────────────────────┤
│  Notifications         ON   │
│  ...                        │
└─────────────────────────────┘
```

---

#### Story 2.2: Language Selector Component
**As a** user  
**I want to** choose from available languages in a clear UI  
**So that** switching languages is easy

**Acceptance Criteria:**
- [ ] Modal or bottom sheet with language options
- [ ] Each option shows: Language name (in that language), optional flag
- [ ] Current language has checkmark or highlight
- [ ] Tapping a language closes selector and applies change
- [ ] Smooth transition (no page reload)

**Priority:** P0

**UI Options:**
| Language | Native Name | Flag |
|----------|-------------|------|
| pt-BR | Português (Brasil) | 🇧🇷 |
| en | English | 🇺🇸 or 🇬🇧 |
| it | Italiano | 🇮🇹 |

---

#### Story 2.3: Auto-Detect Language on First Visit
**As a** new user  
**I want to** see the app in my browser's language automatically  
**So that** I don't have to manually set it

**Acceptance Criteria:**
- [ ] On first visit, detect browser language preference
- [ ] If browser is pt/pt-BR → use Portuguese
- [ ] If browser is en/en-US/en-GB → use English
- [ ] If browser is it → use Italian
- [ ] If none match → default to Portuguese
- [ ] User can still change manually in Settings

**Priority:** P1

---

### Epic 3: Screen-by-Screen Translation

#### Story 3.1: Translate Dashboard
**As a** user  
**I want to** see the Dashboard in my language  
**So that** I can understand my vehicle status

**Acceptance Criteria:**
- [ ] Vehicle nickname label
- [ ] Status indicators (OK, Approaching, Overdue)
- [ ] Item names (IPVA, Licenciamento, Óleo do motor, etc.)
- [ ] "Next due" labels
- [ ] Empty states
- [ ] All three languages complete

**Priority:** P0

---

#### Story 3.2: Translate Maintenance Items
**As a** user  
**I want to** see maintenance item names and descriptions in my language  
**So that** I understand what each item means

**Acceptance Criteria:**
- [ ] All 12 trackable items translated (see table below)
- [ ] Item descriptions/help text translated
- [ ] Reminder text translated
- [ ] Input labels (Last done, Interval, etc.)
- [ ] All three languages complete

**Translation Reference:**

| Key | pt-BR | en | it |
|-----|-------|----|----|
| ipva | IPVA | Vehicle Tax (IPVA) | Tassa Veicolo (IPVA) |
| licenciamento | Licenciamento | Registration (CRLV) | Immatricolazione |
| seguro | Seguro | Insurance | Assicurazione |
| cnh | CNH | Driver's License | Patente |
| multas | Multas | Traffic Fines | Multe |
| oleo_motor | Óleo do Motor | Engine Oil | Olio Motore |
| agua_resfriamento | Água de Resfriamento | Coolant | Liquido Raffreddamento |
| oleo_direcao | Óleo da Direção | Power Steering Fluid | Olio Servosterzo |
| fluido_freio | Fluido de Freio | Brake Fluid | Liquido Freni |
| bateria | Bateria | Battery | Batteria |
| pressao_pneus | Pressão dos Pneus | Tire Pressure | Pressione Pneumatici |
| pastilhas_freio | Pastilhas de Freio | Brake Pads | Pastiglie Freno |

**Priority:** P0

---

#### Story 3.3: Translate Fuel Tracking
**As a** user  
**I want to** see Fuel screens in my language  
**So that** I can log and understand my fuel data

**Acceptance Criteria:**
- [ ] "Log Fuel" / "Registrar Abastecimento" / "Registra Rifornimento"
- [ ] Form labels: Liters, Cost, Price per liter, Odometer, Station
- [ ] Fuel types: Gasolina, Etanol, Diesel, GNV (keep Portuguese names or translate?)
- [ ] Stats labels: Total spent, Average, Efficiency
- [ ] All three languages complete

**Priority:** P1

---

#### Story 3.4: Translate Rides Tracking
**As a** user  
**I want to** see Rides screens in my language  
**So that** I can track and review my trips

**Acceptance Criteria:**
- [ ] "Start Ride" / "Iniciar Viagem" / "Inizia Viaggio"
- [ ] Active ride labels: Distance, Time, Speed
- [ ] Summary labels: Duration, Average speed, Route
- [ ] Stats: Total km, Total rides, Average
- [ ] All three languages complete

**Priority:** P1

---

#### Story 3.5: Translate Settings Screen
**As a** user  
**I want to** see Settings in my language  
**So that** I can configure the app

**Acceptance Criteria:**
- [ ] All setting labels translated
- [ ] Language option shows current selection
- [ ] Notification preferences
- [ ] Vehicle management labels
- [ ] About/version information
- [ ] All three languages complete

**Priority:** P0

---

#### Story 3.6: Translate Onboarding Flow
**As a** new user  
**I want to** see the setup flow in my language  
**So that** I can configure the app correctly

**Acceptance Criteria:**
- [ ] Welcome screen text
- [ ] Vehicle setup prompts
- [ ] Quick setup questions
- [ ] Skip/Continue buttons
- [ ] All three languages complete

**Priority:** P1

---

### Epic 4: Locale-Aware Formatting

#### Story 4.1: Format Dates by Locale
**As a** user  
**I want to** see dates formatted according to my language  
**So that** they're familiar and readable

**Acceptance Criteria:**
- [ ] pt-BR: "30 de janeiro de 2026" or "30/01/2026"
- [ ] en: "January 30, 2026" or "01/30/2026"
- [ ] it: "30 gennaio 2026" or "30/01/2026"
- [ ] Relative dates work: "2 days ago", "há 2 dias", "2 giorni fa"
- [ ] Applied across all date displays

**Priority:** P1

---

#### Story 4.2: Format Numbers by Locale
**As a** user  
**I want to** see numbers formatted according to my locale  
**So that** they're easy to read

**Acceptance Criteria:**
- [ ] pt-BR/it: 1.234,56 (period for thousands, comma for decimal)
- [ ] en: 1,234.56 (comma for thousands, period for decimal)
- [ ] Applied to: distances (km), efficiency (km/L), liters

**Priority:** P1

---

#### Story 4.3: Format Currency (BRL)
**As a** user  
**I want to** see currency formatted correctly  
**So that** costs are clear

**Acceptance Criteria:**
- [ ] Always display as Brazilian Real (R$)
- [ ] pt-BR: R$ 1.234,56
- [ ] en: R$ 1,234.56 (or BRL 1,234.56)
- [ ] it: 1.234,56 R$ (or R$ 1.234,56)
- [ ] Applied to: fuel costs, maintenance costs

**Priority:** P1

---

### Epic 5: Edge Cases & Polish

#### Story 5.1: Handle Missing Translations
**As a** developer  
**I want to** gracefully handle missing translation keys  
**So that** the app doesn't break if a translation is missing

**Acceptance Criteria:**
- [ ] Missing key shows fallback (Portuguese or key name)
- [ ] Console warning in development for missing keys
- [ ] No crashes or blank text
- [ ] Easy to identify missing translations during testing

**Priority:** P1

---

#### Story 5.2: Persist Language Across Sessions
**As a** user  
**I want to** see my language preference remembered  
**So that** I don't have to set it every time

**Acceptance Criteria:**
- [ ] Language saved to localStorage on change
- [ ] On app load, check localStorage before browser detection
- [ ] If user has cloud account, sync preference (future)

**Priority:** P0

---

#### Story 5.3: Handle Text Length Variations
**As a** designer  
**I want to** ensure UI accommodates different text lengths  
**So that** layouts don't break in different languages

**Acceptance Criteria:**
- [ ] Buttons expand to fit text or use min-width
- [ ] Labels truncate gracefully if too long
- [ ] Test all screens in all languages for overflow
- [ ] Italian/Portuguese often longer than English — plan for it

**Priority:** P1

**Examples of length variation:**
| Key | en | pt-BR | it |
|-----|----|----|----| 
| Save | Save | Salvar | Salva |
| Settings | Settings | Configurações | Impostazioni |
| Tire Pressure | Tire Pressure | Pressão dos Pneus | Pressione Pneumatici |

---

## Translation Files Starter

### common.json (pt-BR)

```json
{
  "app": {
    "name": "Kopilot",
    "tagline": "Own Your Drive."
  },
  "actions": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Excluir",
    "edit": "Editar",
    "back": "Voltar",
    "next": "Próximo",
    "done": "Concluído",
    "skip": "Pular",
    "confirm": "Confirmar",
    "close": "Fechar"
  },
  "status": {
    "ok": "OK",
    "approaching": "Aproximando",
    "overdue": "Atrasado",
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso"
  },
  "errors": {
    "generic": "Algo deu errado. Tente novamente.",
    "network": "Sem conexão. Verifique sua internet.",
    "required": "Este campo é obrigatório"
  },
  "empty": {
    "noData": "Nenhum dado ainda",
    "noItems": "Nenhum item para exibir"
  },
  "time": {
    "today": "Hoje",
    "yesterday": "Ontem",
    "daysAgo": "há {{count}} dias",
    "thisWeek": "Esta semana",
    "thisMonth": "Este mês"
  },
  "units": {
    "km": "km",
    "kmPerLiter": "km/L",
    "liters": "L",
    "days": "dias",
    "months": "meses"
  }
}
```

### common.json (en)

```json
{
  "app": {
    "name": "Kopilot",
    "tagline": "Own Your Drive."
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "done": "Done",
    "skip": "Skip",
    "confirm": "Confirm",
    "close": "Close"
  },
  "status": {
    "ok": "OK",
    "approaching": "Approaching",
    "overdue": "Overdue",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "network": "No connection. Check your internet.",
    "required": "This field is required"
  },
  "empty": {
    "noData": "No data yet",
    "noItems": "No items to display"
  },
  "time": {
    "today": "Today",
    "yesterday": "Yesterday",
    "daysAgo": "{{count}} days ago",
    "thisWeek": "This week",
    "thisMonth": "This month"
  },
  "units": {
    "km": "km",
    "kmPerLiter": "km/L",
    "liters": "L",
    "days": "days",
    "months": "months"
  }
}
```

### common.json (it)

```json
{
  "app": {
    "name": "Kopilot",
    "tagline": "Own Your Drive."
  },
  "actions": {
    "save": "Salva",
    "cancel": "Annulla",
    "delete": "Elimina",
    "edit": "Modifica",
    "back": "Indietro",
    "next": "Avanti",
    "done": "Fatto",
    "skip": "Salta",
    "confirm": "Conferma",
    "close": "Chiudi"
  },
  "status": {
    "ok": "OK",
    "approaching": "In avvicinamento",
    "overdue": "Scaduto",
    "loading": "Caricamento...",
    "error": "Errore",
    "success": "Successo"
  },
  "errors": {
    "generic": "Qualcosa è andato storto. Riprova.",
    "network": "Nessuna connessione. Controlla internet.",
    "required": "Questo campo è obbligatorio"
  },
  "empty": {
    "noData": "Ancora nessun dato",
    "noItems": "Nessun elemento da visualizzare"
  },
  "time": {
    "today": "Oggi",
    "yesterday": "Ieri",
    "daysAgo": "{{count}} giorni fa",
    "thisWeek": "Questa settimana",
    "thisMonth": "Questo mese"
  },
  "units": {
    "km": "km",
    "kmPerLiter": "km/L",
    "liters": "L",
    "days": "giorni",
    "months": "mesi"
  }
}
```

---

## Implementation Sequence

**Phase 1: Infrastructure (P0)**
1. Install i18next packages
2. Create i18n configuration file
3. Set up folder structure for locales
4. Create common.json for all three languages
5. Wrap app in I18nextProvider
6. Test basic translation with one component

**Phase 2: Settings & Switching (P0)**
7. Add Language option to Settings screen
8. Create LanguageSwitcher component
9. Implement language persistence
10. Test language switching works app-wide

**Phase 3: Core Screens (P0)**
11. Translate Dashboard
12. Translate maintenance items
13. Translate Settings screen
14. Translate onboarding flow

**Phase 4: Feature Screens (P1)**
15. Translate Fuel tracking screens
16. Translate Rides tracking screens
17. Translate Maintenance History screens

**Phase 5: Formatting & Polish (P1)**
18. Implement date formatting by locale
19. Implement number formatting by locale
20. Implement currency formatting
21. Test all screens for text overflow
22. Handle missing translations gracefully

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Translation coverage | 100% of user-facing strings | No hardcoded text |
| Language switch time | <500ms | Instant feel |
| User language preference | Portuguese 70%, English 20%, Italian 10% | Validates market |
| Settings completion | Users who change language stay in app | Feature works |

---

## Out of Scope (v1.x)

- RTL language support (Arabic, Hebrew) — not needed for PT/EN/IT
- Machine translation integration — manual translations only
- Per-user cloud sync of language preference — localStorage for now
- Additional languages beyond PT/EN/IT — future request
- In-app translation editor — not needed

---

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Translation quality | Use native speakers for review; start with PT as source |
| Maintenance burden | Keep translations organized; use consistent keys |
| Text overflow in UI | Test all screens in all languages; plan for longest strings |
| Missing translations | Fallback to Portuguese; log missing keys |

---

## Notes for Lovable Implementation

1. **Start with infrastructure** — Get i18next working with one test string before translating everything.

2. **Use the `useTranslation` hook** — It's the cleanest pattern for React components.

3. **Namespace by feature** — Don't put everything in one giant file.

4. **Test language switching** — Make sure the entire app re-renders with new language.

5. **Keep Portuguese as the source** — Since it's the primary market, write PT first, then translate to EN and IT.

---

*Ready for Lovable implementation. Start with Phase 1-2 to validate the infrastructure works, then systematically translate screens.*

---

## Lovable Knowledge File

**Copy the content below into Lovable's Knowledge File so it always remembers how to work with i18n in Kopilot.**

---

```markdown
# Kopilot i18n Guidelines

This project uses `react-i18next` for internationalization. Follow these rules when working with any user-facing text.

## Supported Languages

- `pt-BR` — Portuguese (Brazil) — PRIMARY/FALLBACK
- `en` — English
- `it` — Italian

## Golden Rule

**NEVER hardcode user-facing strings.** Always use the `t()` function from `useTranslation`.

## File Structure

```
src/i18n/
├── index.ts                    # i18next config (don't modify unless adding languages)
└── locales/
    ├── pt-BR/
    │   ├── common.json         # Shared: buttons, errors, status, units
    │   ├── dashboard.json      # Dashboard screen
    │   ├── maintenance.json    # Maintenance items & reminders
    │   ├── fuel.json           # Fuel tracking
    │   ├── rides.json          # Rides/trips
    │   ├── settings.json       # Settings screen
    │   └── onboarding.json     # Welcome/setup flow
    ├── en/
    │   └── [same files]
    └── it/
        └── [same files]
```

## How to Use Translations

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');  // Specify namespace
  
  return (
    <button>{t('actions.save')}</button>  // "Salvar" | "Save" | "Salva"
  );
}
```

### Multiple Namespaces

```tsx
const { t } = useTranslation(['dashboard', 'common']);

// Access dashboard namespace (first in array)
t('title')

// Access common namespace explicitly
t('common:actions.save')
```

### Interpolation (Dynamic Values)

```tsx
// In JSON: "greeting": "Hello, {{name}}!"
t('greeting', { name: 'Vinicius' })  // "Hello, Vinicius!"

// In JSON: "dueIn": "Due in {{days}} days"
t('dueIn', { days: 15 })  // "Due in 15 days"
```

### Pluralization

```tsx
// In JSON:
// "rides_one": "{{count}} ride"
// "rides_other": "{{count}} rides"

t('rides', { count: 1 })   // "1 ride"
t('rides', { count: 5 })   // "5 rides"
```

### Date Formatting

```tsx
// In JSON: "lastUpdated": "Updated: {{date, datetime}}"
t('lastUpdated', { date: new Date() })
```

## How to Add New Strings

1. **Identify the namespace** — Which screen/feature does this belong to?

2. **Add the key to ALL THREE language files:**
   - `src/i18n/locales/pt-BR/{namespace}.json`
   - `src/i18n/locales/en/{namespace}.json`
   - `src/i18n/locales/it/{namespace}.json`

3. **Use descriptive, nested keys:**
   ```json
   {
     "fuel": {
       "logFillUp": "Log Fill-Up",
       "form": {
         "liters": "Liters",
         "totalCost": "Total Cost",
         "pricePerLiter": "Price per Liter"
       },
       "stats": {
         "totalSpent": "Total Spent",
         "avgEfficiency": "Average Efficiency"
       }
     }
   }
   ```

4. **Use the translation in code:**
   ```tsx
   const { t } = useTranslation('fuel');
   t('form.liters')  // "Liters"
   ```

## Key Naming Conventions

| Pattern | Example | Use For |
|---------|---------|---------|
| `screen.element` | `dashboard.title` | Screen-specific labels |
| `actions.verb` | `actions.save` | Buttons, CTAs |
| `status.state` | `status.overdue` | Status indicators |
| `errors.type` | `errors.network` | Error messages |
| `empty.context` | `empty.noRides` | Empty states |
| `form.field` | `form.odometer` | Form labels |

## Common Namespace Keys (Always Available)

These are in `common.json` and can be used anywhere:

```tsx
t('common:actions.save')      // Save button
t('common:actions.cancel')    // Cancel button
t('common:actions.delete')    // Delete button
t('common:actions.edit')      // Edit button
t('common:status.ok')         // OK status
t('common:status.overdue')    // Overdue status
t('common:errors.generic')    // Generic error message
t('common:units.km')          // "km"
t('common:units.kmPerLiter')  // "km/L"
```

## Language Switching

Already configured. To change language programmatically:

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);  // Automatically persists to localStorage
  };
  
  return (
    <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="pt-BR">Português</option>
      <option value="en">English</option>
      <option value="it">Italiano</option>
    </select>
  );
}
```

## Locale-Aware Formatting

### Numbers
```tsx
// Use Intl.NumberFormat with current language
const { i18n } = useTranslation();
new Intl.NumberFormat(i18n.language).format(1234.56)
// pt-BR: "1.234,56"
// en: "1,234.56"
```

### Currency (BRL)
```tsx
new Intl.NumberFormat(i18n.language, { 
  style: 'currency', 
  currency: 'BRL' 
}).format(1234.56)
// pt-BR: "R$ 1.234,56"
// en: "R$1,234.56"
```

### Dates
```tsx
new Intl.DateTimeFormat(i18n.language, { 
  dateStyle: 'long' 
}).format(new Date())
// pt-BR: "30 de janeiro de 2026"
// en: "January 30, 2026"
// it: "30 gennaio 2026"
```

## DO's and DON'Ts

### ✅ DO

```tsx
// Use translation hook
const { t } = useTranslation('dashboard');
<h1>{t('title')}</h1>

// Use interpolation for dynamic content
t('dueIn', { days: count })

// Keep keys organized by feature
t('fuel:stats.totalSpent')
```

### ❌ DON'T

```tsx
// Never hardcode strings
<h1>My Vehicle</h1>  // BAD!

// Never concatenate translations
t('due') + ' ' + t('in') + ' ' + days  // BAD!

// Never forget to add keys to ALL language files
// If you add to pt-BR, add to en and it too!
```

## Checklist When Adding UI

- [ ] All visible text uses `t()` function
- [ ] Keys added to pt-BR, en, AND it JSON files
- [ ] Correct namespace selected
- [ ] Dynamic values use interpolation `{{variable}}`
- [ ] Plurals handled with `_one` / `_other` suffixes
- [ ] Dates/numbers use Intl formatters with `i18n.language`

## Quick Reference: Maintenance Items

| Key | pt-BR | en | it |
|-----|-------|----|----|
| `maintenance:items.ipva` | IPVA | Vehicle Tax (IPVA) | Tassa Veicolo (IPVA) |
| `maintenance:items.licenciamento` | Licenciamento | Registration | Immatricolazione |
| `maintenance:items.seguro` | Seguro | Insurance | Assicurazione |
| `maintenance:items.cnh` | CNH | Driver's License | Patente |
| `maintenance:items.multas` | Multas | Traffic Fines | Multe |
| `maintenance:items.oleo_motor` | Óleo do Motor | Engine Oil | Olio Motore |
| `maintenance:items.agua_resfriamento` | Água de Resfriamento | Coolant | Liquido Raffreddamento |
| `maintenance:items.oleo_direcao` | Óleo da Direção | Power Steering Fluid | Olio Servosterzo |
| `maintenance:items.fluido_freio` | Fluido de Freio | Brake Fluid | Liquido Freni |
| `maintenance:items.bateria` | Bateria | Battery | Batteria |
| `maintenance:items.pressao_pneus` | Pressão dos Pneus | Tire Pressure | Pressione Pneumatici |
| `maintenance:items.pastilhas_freio` | Pastilhas de Freio | Brake Pads | Pastiglie Freno |
```

---

**End of Knowledge File content.**
