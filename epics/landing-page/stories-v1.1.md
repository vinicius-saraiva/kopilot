# Kopilot Landing Page — Refinements (v2)

## Lovable Prompt

Paste the following directly into Lovable after the first round of changes (stories.md) has been applied:

---

I need a few more refinements to the landing page. Same rules: keep design, layout, animations intact. Only content changes.

### 1. Problem Section — New headline

Replace the current headline in all 3 languages:

**EN:**
- `problem.headline1`: "YOUR CAR IS TALKING."
- `problem.headline2`: "YOU'RE NOT LISTENING."

**PT:**
- `problem.headline1`: "SEU CARRO ESTÁ FALANDO."
- `problem.headline2`: "VOCÊ NÃO ESTÁ OUVINDO."

**IT:**
- `problem.headline1`: "LA TUA AUTO STA PARLANDO."
- `problem.headline2`: "NON STAI ASCOLTANDO."

Keep the same styling: first line in dark asphalt, second line in gravel/grey.

### 2. Stakes Section — Remove pricing from closing statement

The current closing statement says "Kopilot costs $0. Forgetting/Not knowing costs a fortune." Remove the first part entirely. Keep only the consequence line.

Replace with:

**EN:**
Remove `stakes.closingLine1` and `stakes.free`. Change the closing to a single statement:
"Not knowing costs a fortune."

**PT:**
"Não saber custa uma fortuna."

**IT:**
"Non sapere costa una fortuna."

Display this as a single centered line. "fortune/fortuna" stays in error red. Remove the "$0 / R$ 0 / €0" part completely.

Also remove the cost column from the Stakes cards. Keep only: what you forgot + the consequence. The emotional impact is stronger without specific dollar amounts — the consequence itself ("Engine Destroyed", "Car Seized") is scary enough.

Updated cards structure (2 columns instead of 3):

**Card 1 — Oil Change:**
- EN: "Oil Change" → "Engine Destroyed"
- PT: "Troca de Óleo" → "Motor Destruído"
- IT: "Cambio Olio" → "Motore Distrutto"

**Card 2 — Vehicle Tax:**
- EN: "Vehicle Tax" → "Fines + Car Seized"
- PT: "IPVA" → "Multas + Carro Apreendido"
- IT: "Bollo Auto" → "Multe + Auto Sequestrata"

**Card 3 — Fuel spending:**
- EN: "Your fuel spending" → "Overpaying without realizing"
- PT: "Seus gastos com combustível" → "Pagando a mais sem perceber"
- IT: "Le tue spese di carburante" → "Stai pagando troppo senza saperlo"

### 3. CTA Section — Remove "free" reference

**EN:** Change `cta.subtitle` from "Start driving with peace of mind. It's free." to:
"Start driving with peace of mind."

**PT:** Change from "Comece a dirigir com tranquilidade. É grátis." to:
"Comece a dirigir com tranquilidade."

**IT:** Change from "Inizia a guidare con serenità. È gratis." to:
"Inizia a guidare con serenità."

### 4. Currency and unit formatting fixes

Make sure all localized content uses the correct local formatting:

**PT (Brazilian Portuguese):**
- Currency: R$ (e.g., "R$ 520")
- Per month: "/mês" (not "/mo")
- Decimal separator: comma (e.g., "12,4 km/L")

**IT (Italian):**
- Currency: € (e.g., "€280")
- Per month: "/mese" (not "/mo")
- Decimal separator: comma (e.g., "12,4 km/L")

**EN (English):**
- Currency: $ (e.g., "$420")
- Per month: "/mo"
- Decimal separator: period (e.g., "12.4 km/L")

Review all strings in all 3 locale files and fix any formatting that doesn't follow these rules.

### Summary of files to change:
- `src/i18n/locales/en.json` — problem headline, stakes closing, CTA subtitle
- `src/i18n/locales/pt.json` — problem headline, stakes closing, CTA subtitle, formatting
- `src/i18n/locales/it.json` — problem headline, stakes closing, CTA subtitle, formatting
- `src/components/landing/StakesSection.tsx` — remove cost column from cards, simplify closing to single line

Do NOT change: layout, colors, fonts, animations, spacing, dark/light alternation, or any structural element beyond what's specified above.
