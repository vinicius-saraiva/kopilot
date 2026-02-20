# Kopilot Landing Page — Content Update

## Lovable Prompt

Paste the following directly into Lovable:

---

I need to update the content of my landing page to reflect the full scope of the app. The design, layout, animations, and structure stay exactly the same. Only the text content, mockup UIs inside sections, and translation files change. Here are all the changes:

### 1. Hero Section — Update subheadline only

**EN:** Change `hero.subtitle` to:
"Your car's companion app. Track maintenance, control spending, record every drive."

**PT:** Change `hero.subtitle` to:
"O app companheiro do seu carro. Acompanhe manutenções, controle gastos, registre cada viagem."

**IT:** Change `hero.subtitle` to:
"L'app compagna della tua auto. Monitora la manutenzione, controlla le spese, registra ogni viaggio."

Everything else in the hero stays the same.

### 2. Problem Section — Reduce to 3 cards + update description

**EN:** Change `problem.description` to:
"You don't know when to change the oil. You can't remember when you paid the vehicle tax. You have no idea how much you spend on fuel every month."

**PT:** Change `problem.description` to:
"Você não sabe quando trocar o óleo. Não lembra quando pagou o IPVA. Nem faz ideia de quanto gasta com combustível por mês."

**IT:** Change `problem.description` to:
"Non sai quando cambiare l'olio. Non ricordi quando hai pagato il bollo. Non hai idea di quanto spendi di carburante al mese."

**Replace the current 4 cards with these 3:**

**Card 1 — Missed deadline** (Calendar icon, error color border):
- EN: "Missed deadline" / "Vehicle tax due 2 weeks ago"
- PT: "Prazo perdido" / "IPVA vencido há 2 semanas"
- IT: "Scadenza persa" / "Bollo scaduto da 2 settimane"

**Card 2 — Surprise invoice** (Receipt icon, error color border):
- EN: "Surprise invoice" / "$1,200 for repairs you could've avoided"
- PT: "Conta surpresa" / "R$ 6.000 em reparos que poderiam ser evitados"
- IT: "Conto a sorpresa" / "€1.200 per riparazioni evitabili"

**Card 3 — Invisible spending** (Droplets/Fuel icon, warning color border):
- EN: "Invisible spending" / "You think you spend $300/month on fuel. It's $500."
- PT: "Gasto invisível" / "Você acha que gasta R$400/mês em combustível. São R$600."
- IT: "Spesa invisibile" / "Pensi di spendere €200/mese di carburante. Sono €350."

Remove the "Warning light" and "Stranded" cards entirely.

The grid should be responsive: 1 col on mobile, 3 cols on desktop.

### 3. Solution Section — Update copy + replace mockup

**EN:**
- Change `solution.description1` to: "Kopilot is the app that takes care of your car — and your wallet."
- Change `solution.description2` to: "It remembers the deadlines. Tracks your spending. Records your drives."
- Keep `solution.youJustDrive` as "You just drive."

**PT:**
- Change `solution.description1` to: "Kopilot é o app que cuida do seu carro — e do seu bolso."
- Change `solution.description2` to: "Lembra dos prazos. Acompanha seus gastos. Registra suas viagens."
- Keep `solution.youJustDrive` as "Você só dirige."

**IT:**
- Change `solution.description1` to: "Kopilot è l'app che si prende cura della tua auto — e del tuo portafoglio."
- Change `solution.description2` to: "Ricorda le scadenze. Traccia le spese. Registra i viaggi."
- Keep `solution.youJustDrive` as "Tu guidi e basta."

**Replace the phone mockup.** The current one only shows a maintenance checklist. Replace it with a dashboard-style mockup that shows 3 summary cards stacked vertically inside the phone frame:

1. **Checklist card** — icon: Shield or CheckCircle
   - EN: "Maintenance" / "3 on track · 1 due soon"
   - PT: "Manutenção" / "3 em dia · 1 vence logo"
   - IT: "Manutenzione" / "3 in regola · 1 in scadenza"

2. **Fuel card** — icon: Droplets/Fuel
   - EN: "Fuel this month" / "$420 · 12.4 km/L"
   - PT: "Combustível do mês" / "R$ 520 · 12,4 km/L"
   - IT: "Carburante del mese" / "€280 · 12,4 km/L"

3. **Rides card** — icon: MapPin or Route
   - EN: "Last drive" / "12.4 km · 23 min"
   - PT: "Última viagem" / "12,4 km · 23 min"
   - IT: "Ultimo viaggio" / "12,4 km · 23 min"

Change the car name in the mockup header:
- EN: "MY FIAT PULSE"
- PT: "MEU FIAT PULSE"
- IT: "LA MIA FIAT PULSE"

Keep the health percentage "92% HEALTHY" / "92% SAUDÁVEL" / "92% IN SALUTE". Remove the streak badge. Keep the same phone frame styling, rounded corners, and staggered animation.

### 4. Features Section — Replace all 3 pillars

Keep the headline "EVERYTHING YOU NEED. NOTHING YOU DON'T." and the "FEATURES" label. Replace the 3 feature blocks:

**Feature 1: Never Miss a Thing** (was: Smart Reminders)
- Icon: Shield (or Bell)
- EN title: "Never Miss a Thing"
- EN description: "Kopilot tracks every deadline — oil changes, tires, insurance, registration, inspections. Color-coded status shows what's ok, what's approaching, and what's overdue."
- PT title: "Nunca Mais Esqueça"
- PT description: "Kopilot rastreia cada prazo — troca de óleo, pneus, seguro, licenciamento, vistorias. Status por cores mostra o que tá em dia, o que tá chegando e o que tá atrasado."
- IT title: "Non Dimenticare Più Nulla"
- IT description: "Kopilot traccia ogni scadenza — cambio olio, gomme, assicurazione, bollo, revisione. Lo stato a colori mostra cosa è in regola, in arrivo o scaduto."
- Mock UI: Keep the existing notification-style mockup but change text:
  - EN: "Tire Rotation" / "in 12 days" / "Tap to see details"
  - PT: "Rodízio de Pneus" / "em 12 dias" / "Toque para ver detalhes"
  - IT: "Rotazione Gomme" / "tra 12 giorni" / "Tocca per i dettagli"

**Feature 2: Track Every Cent** (was: Complete History)
- Icon: TrendingUp (or Wallet)
- EN title: "Track Every Cent"
- EN description: "Log every fill-up. Track fuel efficiency over time. See spending by category — fuel, maintenance, regulatory. Know exactly where your money goes."
- PT title: "Controle Cada Centavo"
- PT description: "Registre cada abastecimento. Acompanhe a eficiência ao longo do tempo. Veja gastos por categoria — combustível, manutenção, documentação. Saiba pra onde vai seu dinheiro."
- IT title: "Traccia Ogni Centesimo"
- IT description: "Registra ogni rifornimento. Monitora l'efficienza nel tempo. Visualizza le spese per categoria — carburante, manutenzione, documenti. Sappi esattamente dove vanno i tuoi soldi."
- Mock UI: Replace the history timeline with a mini fuel stats card showing:
  - EN: "This month" / "$420 spent" / "6 fill-ups" / "12.4 km/L avg"
  - PT: "Este mês" / "R$ 520 gastos" / "6 abastecimentos" / "12,4 km/L média"
  - IT: "Questo mese" / "€280 spesi" / "6 rifornimenti" / "12,4 km/L media"

**Feature 3: Know Your Car** (was: Zero Complexity)
- Icon: MapPin (or Navigation)
- EN title: "Know Your Car"
- EN description: "Track your drives with GPS. See routes on a map, distance, duration, speed. Your car's full story — maintenance, spending, and every kilometer driven."
- PT title: "Conheça Seu Carro"
- PT description: "Acompanhe suas viagens com GPS. Veja rotas no mapa, distância, duração, velocidade. A história completa do seu carro — manutenção, gastos e cada quilômetro rodado."
- IT title: "Conosci la Tua Auto"
- IT description: "Traccia i tuoi viaggi con il GPS. Vedi i percorsi sulla mappa, distanza, durata, velocità. La storia completa della tua auto — manutenzione, spese e ogni chilometro percorso."
- Mock UI: Replace the "Done! ✓" mockup with a mini ride card showing:
  - EN: "Morning Drive" / "12.4 km · 23 min · 32 km/h"
  - PT: "Viagem da Manhã" / "12,4 km · 23 min · 32 km/h"
  - IT: "Viaggio Mattutino" / "12,4 km · 23 min · 32 km/h"
  - Add a small abstract route line (a simple curved SVG line, like a road snippet) above the text

### 5. Stakes Section — Update headline + replace cards (keep 3)

**Change headline:**
- EN: Change `stakes.headlineAccent` from "FORGETTING" to "NOT KNOWING"
- PT: Change `stakes.headlineAccent` from "ESQUECER" to "NÃO SABER"
- IT: Change `stakes.headlineAccent` from "DIMENTICARE" to "NON SAPERE"

**Replace the 3 consequence cards with these 3:**

**Card 1 — Oil Change:**
- EN: Forgot: "Oil Change" / Consequence: "Engine Destroyed" / Cost: "$2,000+"
- PT: Forgot: "Troca de Óleo" / Consequence: "Motor Destruído" / Cost: "R$ 10.000+"
- IT: Forgot: "Cambio Olio" / Consequence: "Motore Distrutto" / Cost: "€2.000+"

**Card 2 — Vehicle Tax:**
- EN: Forgot: "Vehicle Tax" / Consequence: "Fines + Car Seized" / Cost: "$500+"
- PT: Forgot: "IPVA" / Consequence: "Multas + Carro Apreendido" / Cost: "R$ 2.500+"
- IT: Forgot: "Bollo Auto" / Consequence: "Multe + Auto Sequestrata" / Cost: "€500+"

**Card 3 — Fuel spending** (new, replaces Registration):
- EN: Forgot: "Your fuel spending" / Consequence: "Overpaying without realizing" / Cost: "$200+/mo"
- PT: Forgot: "Seus gastos com combustível" / Consequence: "Pagando a mais sem perceber" / Cost: "R$200+/mês"
- IT: Forgot: "Le tue spese di carburante" / Consequence: "Stai pagando troppo senza saperlo" / Cost: "€150+/mese"

**Change closing statement:**
- EN: Change `stakes.closingLine2` from "Forgetting costs a" to "Not knowing costs a"
- PT: Change `stakes.closingLine2` from "Esquecer custa uma" to "Não saber custa uma"
- IT: Change `stakes.closingLine2` from "Dimenticare costa una" to "Non sapere costa una"

### Summary of files to change:
- `src/i18n/locales/en.json` — updated strings
- `src/i18n/locales/pt.json` — updated strings
- `src/i18n/locales/it.json` — updated strings
- `src/components/landing/ProblemSection.tsx` — 3 cards instead of 4
- `src/components/landing/SolutionSection.tsx` — new dashboard mockup replacing checklist mockup
- `src/components/landing/FeaturesSection.tsx` — new pillar content + new mock UIs
- `src/components/landing/StakesSection.tsx` — new headline accent, replaced cards (3 total)

Do NOT change: layout, colors, fonts, animations, spacing, dark/light alternation, CTAs, footer, or any structural element. This is a content update only.
