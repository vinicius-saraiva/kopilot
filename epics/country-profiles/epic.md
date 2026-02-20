# Country Profiles

**Epic:** Country-based configuration of regulatory and maintenance items
**Status:** MVP

---

## Goal

Define which regulatory items, maintenance items, external links, currency, and units are shown based on the user's country selection. Each country profile provides sensible defaults that can be customized by the user after setup.

Country selection happens during [onboarding](../onboarding/epic.md) (step 1.5) and can be changed later in [Settings](../settings/epic.md).

---

## How It Works

1. User selects their country during onboarding or in Settings > Preferences
2. The app loads the corresponding country profile
3. Default regulatory and maintenance items are pre-populated on the [Dashboard](../dashboard/epic.md)
4. Currency, units, and external links are configured automatically
5. User can optionally select a state/region (Brazil, USA) for more precise portal links and conditional items

---

## Country Profiles

### Brazil

| Setting | Value |
|---------|-------|
| **Currency** | BRL (R$) |
| **Units** | km |
| **Language** | Portugues (BR) |
| **State selection** | Yes — determines DETRAN links and state-specific rules |

#### Regulatory Items

| Item | Name | Description | Reminder Logic |
|------|------|-------------|----------------|
| Vehicle Tax | IPVA | Annual vehicle property tax | Configurable (e.g., 30 days before due date) |
| Registration | Licenciamento (CRLV) | Annual registration renewal | Configurable |
| Insurance | Seguro | Private vehicle insurance (voluntary) | 30 days before expiry |
| License Renewal | CNH | Driver's license renewal | 30-60 days before expiry |
| Fines | Multas (DETRAN) | Traffic fine check | Periodic nudge (every 45 days) with link to state DETRAN |
| Inspection | Vistoria Veicular | Vehicle inspection (state-conditional) | Configurable, only shown if required by state |

#### Maintenance Items

| Item | Name | Interval |
|------|------|----------|
| Engine Oil | Oleo do motor | 5,000-10,000 km or 6 months |
| Coolant | Agua de resfriamento | 30,000 km or 2 years |
| Power Steering Fluid | Oleo da direcao | 50,000 km or 2 years |
| Brake Fluid | Fluido de freio | 20,000 km or 2 years |
| Battery | Bateria | 3 years |
| Tire Pressure | Pressao dos pneus | Monthly check |
| Brake Pads | Pastilhas de freio | 30,000-50,000 km |
| Tire Replacement | Troca de pneus | 40,000-60,000 km or 5 years |

#### Country-Specific Items

| Item | Name | Condition | Notes |
|------|------|-----------|-------|
| CNG Inspection | Inspecao GNV | Vehicle uses CNG fuel | Annual mandatory inspection for CNG-equipped vehicles |

#### Fuel Options

| Fuel Type | Notes |
|-----------|-------|
| Gasolina Comum | Standard gasoline |
| Gasolina Aditivada | Premium gasoline |
| Etanol | Sugarcane ethanol — Brazil-specific |
| Flex (Gasolina/Etanol) | Dual-fuel vehicles, very common in Brazil |
| Diesel | Trucks and some SUVs |
| Diesel S-10 | Low-sulfur diesel |
| GNV | Compressed natural gas |

- **Fuel unit:** Litros (L)
- **Efficiency unit:** km/L
- **Currency in fuel logging:** BRL (R$)

#### External Links

- Fines check: state DETRAN portal (varies by state) or Serasa/Zapay
- IPVA schedule: state treasury website

---

### USA

| Setting | Value |
|---------|-------|
| **Currency** | USD ($) |
| **Units** | miles |
| **Language** | English |
| **State selection** | Yes — determines DMV links, emissions requirements, and inspection rules |

#### Regulatory Items

| Item | Name | Description | Reminder Logic |
|------|------|-------------|----------------|
| Vehicle Tax | Vehicle Registration Fee / Property Tax | Annual vehicle registration fee (varies by state) | Configurable (e.g., 30 days before due date) |
| Registration | Vehicle Registration Renewal | Annual or biennial registration renewal | Configurable |
| Insurance | Liability Insurance | Mandatory liability insurance | 30 days before expiry |
| License Renewal | Driver's License Renewal | License renewal (every 4-8 years, varies by state) | 60 days before expiry |
| Fines | Traffic Ticket Lookup (DMV) | Traffic ticket / violation check | Periodic nudge (every 45 days) with link to state DMV |
| Inspection | Safety / Emissions Inspection | State vehicle inspection (state-conditional) | Configurable, only shown if required by state |

#### Maintenance Items

| Item | Name | Interval |
|------|------|----------|
| Engine Oil | Engine Oil | 5,000-7,500 miles or 6 months |
| Coolant | Coolant | 30,000 miles or 2 years |
| Power Steering Fluid | Power Steering Fluid | 50,000 miles or 2 years |
| Brake Fluid | Brake Fluid | 20,000 miles or 2 years |
| Battery | Battery | 3-5 years |
| Tire Pressure | Tire Pressure | Monthly check |
| Brake Pads | Brake Pads | 25,000-50,000 miles |
| Tire Replacement | Tire Replacement | 40,000-60,000 miles or 5 years |

#### Country-Specific Items

| Item | Name | Condition | Notes |
|------|------|-----------|-------|
| Transmission Fluid | Transmission Fluid | All vehicles | 30,000-60,000 miles |
| Smog / Emissions Check | Smog / Emissions Check | State-dependent | Required in CA, NY, and other states; annual or biennial |

#### Fuel Options

| Fuel Type | Notes |
|-----------|-------|
| Regular (87) | Standard unleaded |
| Mid-Grade (89) | Mid-grade unleaded |
| Premium (91-93) | Premium unleaded |
| Diesel | Common for trucks and some cars |
| E85 | Ethanol blend — limited availability, flex-fuel vehicles only |

- **Fuel unit:** Gallons (gal)
- **Efficiency unit:** MPG (miles per gallon)
- **Currency in fuel logging:** USD ($)

#### External Links

- Fines / tickets: state DMV portal (varies by state)
- Registration renewal: state DMV website

---

### Italy

| Setting | Value |
|---------|-------|
| **Currency** | EUR (euro) |
| **Units** | km |
| **Language** | Italiano |
| **State selection** | No — regulations are national |

#### Regulatory Items

| Item | Name | Description | Reminder Logic |
|------|------|-------------|----------------|
| Vehicle Tax | Bollo Auto | Annual vehicle ownership tax | Configurable (e.g., 30 days before due date) |
| Inspection | Revisione | Mandatory vehicle inspection (every 2 years; first at 4 years) | 30 days before due date |
| Insurance | Assicurazione RC Auto (RCA) | Mandatory third-party liability insurance | 30 days before expiry |
| License Renewal | Rinnovo Patente di Guida | Driver's license renewal (every 10 years until age 50, then shorter) | 60 days before expiry |
| Fines | Consulta Violazioni | Traffic violation check | Periodic nudge (every 45 days) with link to Portale dell'Automobilista |

#### Maintenance Items

| Item | Name | Interval |
|------|------|----------|
| Engine Oil | Olio Motore | 15,000-30,000 km or 12 months |
| Coolant | Liquido di Raffreddamento | 30,000 km or 2 years |
| Power Steering Fluid | Olio Servosterzo | 50,000 km or 2 years |
| Brake Fluid | Liquido Freni | 20,000 km or 2 years |
| Battery | Batteria | 3-5 years |
| Tire Pressure | Pressione Pneumatici | Monthly check |
| Brake Pads | Pastiglie Freno | 30,000-50,000 km |
| Tire Replacement | Sostituzione Pneumatici | 40,000-60,000 km or 5 years |

#### Country-Specific Items

| Item | Name | Condition | Notes |
|------|------|-----------|-------|
| Superbollo | Bollo Auto Superbollo | Vehicle power >185 kW | Additional annual surcharge on high-power vehicles |
| Winter Tires | Pneumatici Invernali | Seasonal (Nov 15 - Apr 15) | Mandatory winter tire swap or snow chains; reminder before Nov 15 and Apr 15 |
| DPF/FAP Filter | Filtro DPF/FAP | Diesel vehicles only | Periodic cleaning/check, every 80,000-120,000 km |

#### Fuel Options

| Fuel Type | Notes |
|-----------|-------|
| Benzina | Standard gasoline |
| Diesel | Common, especially outside cities |
| GPL | Liquefied petroleum gas — popular aftermarket conversion |
| Metano | Compressed natural gas — available at select stations |

- **Fuel unit:** Litri (L)
- **Efficiency unit:** km/L
- **Currency in fuel logging:** EUR (euro)

#### External Links

- Fines check: [Portale dell'Automobilista](https://www.ilportaledellautomobilista.it)
- Bollo payment: ACI or regional tax agency
- Revisione booking: authorized inspection centers (MCTC)

---

## Comparison Matrix

| | Brazil | USA | Italy |
|---|---|---|---|
| **Vehicle Tax** | IPVA | Vehicle Registration Fee / Property Tax | Bollo Auto |
| **Registration** | Licenciamento (CRLV) | Vehicle Registration Renewal | Revisione (mandatory inspection) |
| **Insurance** | Seguro (voluntary) | Liability Insurance | Assicurazione RC Auto (RCA) |
| **License Renewal** | CNH | Driver's License Renewal | Rinnovo Patente di Guida |
| **Fines** | Multas (DETRAN) | Traffic Ticket Lookup (DMV) | Consulta Violazioni (Portale Automobilista) |
| **Inspection** | Vistoria Veicular (state-conditional) | Safety/Emissions Inspection (state-conditional) | Revisione (mandatory, national) |
| **Currency** | BRL (R$) | USD ($) | EUR (euro) |
| **Units** | km | miles | km |
| **State-level variation** | Yes | Yes | No (national) |
| **Fuel types** | Gasolina, Etanol, Flex (Gas/Etanol), Diesel, GNV | Regular, Mid-Grade, Premium, Diesel, E85 | Benzina, Diesel, GPL, Metano |
| **Fuel unit** | Litros (L) | Gallons (gal) | Litri (L) |
| **Efficiency unit** | km/L | MPG | km/L |
| **Winter tires** | -- | -- | Pneumatici Invernali (Nov 15 - Apr 15) |

---

## State-Level Variation

Brazil and the USA operate many vehicle regulations at the state level. The country profile supports an optional **state selection** to:

- Surface the correct portal links (e.g., correct DETRAN in Brazil, correct DMV in the USA)
- Determine which conditional items apply (e.g., emissions inspection is mandatory in some US states but not others; vistoria veicular varies by Brazilian state)
- Show state-specific deadlines or schedules (e.g., IPVA calendar varies by state in Brazil)

Italy is regulated nationally — no state selection is needed.

---

## Adding New Countries

To add a new country profile:

1. Define the regulatory items with localized names and reminder logic
2. Define maintenance items with localized names and default intervals
3. Set currency, units, and default language
4. Identify country-specific items and their conditions
5. Add external links for fine checking, tax payment, and government services
6. Note whether state/region selection is needed
