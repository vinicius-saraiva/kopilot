# Kopilot — Gas Station Lookup Feature
## User Stories Document

**Feature:** API-Based Gas Station Lookup (Brazilian Market)
**Version:** v2.x
**Status:** Research Complete — Ready for Planning
**Depends on:** Fuel Tracking (stories.md, Story 1.3)

---

## Overview

**Problem:** When logging a fill-up, users currently type station names as free text. This means no standardization (same station logged as "Shell Centro", "Posto Shell", "shell centro sp"), no brand data, and no way to show fuel prices or compare stations meaningfully.

**Solution:** Replace free-text station entry with an API-backed station search powered by ANP (Agencia Nacional do Petroleo) open data. Users search by name or location and pick from real, verified stations — complete with brand, address, CNPJ, and latest surveyed fuel prices.

**Core value:**
- Accurate station data: Real names, brands, and addresses from the official ANP registry
- Price visibility: See latest ANP-surveyed fuel prices when selecting a station
- Better insights: Structured data enables station comparison (Epic 5 in fuel-tracking)
- Zero cost: ANP data is free and open, covering 100% of legal fuel retailers in Brazil

---

## Research Summary: Available Data Sources

### ANP (Agencia Nacional do Petroleo) — Recommended Primary Source

The ANP is Brazil's federal regulator for fuel retailers and provides two key free datasets:

#### Station Registry (Cadastral Data)
- **Source:** https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/dados-cadastrais-dos-revendedores-varejistas-de-combustiveis-automotivos
- **Format:** CSV download (updated regularly)
- **API:** REST API at `https://revendedoresapi.anp.gov.br/swagger/index.html` (no auth required)
- **Coverage:** Every authorized fuel retailer in Brazil (~40,000+ stations)
- **Fields:** CNPJ, trade name (Nome Fantasia), legal name (Razao Social), brand/flag (Bandeira), full address (logradouro, numero, bairro, municipio, UF, CEP), coordinates (when available), fuel types sold, tank capacity, regulatory status

#### Fuel Price Series (Weekly Survey)
- **Source:** https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/serie-historica-de-precos-de-combustiveis
- **Format:** CSV download (weekly updates, historical data from 2004)
- **Coverage:** 459 municipalities surveyed weekly
- **Fields:** Region, state, municipality, station name, CNPJ, fuel type, survey date, sale price (R$/liter), purchase price, brand, neighborhood, CEP
- **Fuel types:** Gasolina Comum, Gasolina Aditivada, Etanol Hidratado, Diesel S500, Diesel S10, GNV, GLP

#### ANP Data Strengths
| Aspect | Detail |
|--------|--------|
| Cost | Free (open government data) |
| Auth | None required |
| Reliability | Official government source, updated weekly |
| Coverage | 100% of legal fuel retailers in Brazil |
| Joinable | CNPJ links station registry to price surveys |
| Limitation | No geospatial "nearby" search; addresses need geocoding for lat/lng |

### Mapbox — Not Viable for Brazil

Mapbox was evaluated and **ruled out** for gas station POI search:

- **Mapbox Search Box API** (the only Mapbox product that supports POI/category search) is **limited to US, Canada, and Europe**. Brazil is not supported.
- Mapbox Geocoding API v5/v6 no longer supports POI search at all.
- Mapbox GL JS remains a good choice for **map rendering** (Rides feature) but cannot be used for station lookup.

### Google Places API — Optional Enhancement

- **Nearby Search** works well in Brazil with `includedTypes: ["gas_station"]`
- Rich data: name, brand, address, coordinates, ratings, opening hours
- Cost: ~$32 per 1,000 requests ($200/month free credit covers ~6,250 calls)
- No fuel prices unless using Enterprise tier ($35/1K — not recommended)
- **Recommendation:** Use as Phase 2 enhancement for "find nearby" UX, not as primary data source

### OpenStreetMap / Overpass API — Supplemental

- Free, no auth, has `amenity=fuel` tagged stations in Brazil
- Good for supplementing coordinate data for stations missing lat/lng in ANP
- No fuel prices, incomplete coverage vs ANP, variable data freshness
- **Recommendation:** Use for batch geocoding gap-fill, not as primary source

### Other Sources Evaluated

| Source | Verdict | Reason |
|--------|---------|--------|
| HERE Fuel Prices API | Not available | Restricted to automotive OEMs |
| TomTom Fuel Prices API | Not available | Restricted to automotive OEMs |
| Waze | No public API | No developer access to fuel data |
| Combustivel API | Too limited | State-level averages only, not per-station |
| Base dos Dados (BigQuery) | Good for analytics | Pre-cleaned ANP data via SQL; useful for bulk analysis |

---

## Recommended Architecture: Phased Approach

### Phase 1 (MVP): ANP-Only Backend — Zero API Cost

Build a backend that ingests ANP open data and exposes a search API. Users search stations by name/city when logging fill-ups.

### Phase 2 (Enhancement): Add Google Places "Nearby"

Add a "Find nearby" button that uses device GPS + Google Places to show closest stations, cross-referenced with ANP data for prices.

---

## Data Model

### Gas Station (from ANP Registry)

```
GasStation {
  id: string
  cnpj: string (unique)              — ANP registry identifier
  tradeName: string                   — "Nome Fantasia" (e.g., "Posto Shell Centro")
  legalName: string                   — "Razao Social"
  brand: string                       — "Bandeira" (Shell, Ipiranga, BR, Bandeira Branca, etc.)

  // Address
  address: string                     — Street + number
  neighborhood: string
  city: string
  state: string                       — UF code (SP, RJ, MG, etc.)
  zipCode: string                     — CEP

  // Geolocation
  latitude: number (nullable)         — from ANP or geocoded
  longitude: number (nullable)

  // Metadata
  fuelTypes: string[]                 — products sold (gasolina, etanol, diesel, gnv)
  status: 'active' | 'inactive'      — regulatory status
  updatedAt: DateTime
}
```

### Fuel Price (from ANP Weekly Survey)

```
FuelPrice {
  id: string
  stationCnpj: string                — FK to GasStation
  fuelType: string                    — gasolina_comum | gasolina_aditivada | etanol | diesel_s500 | diesel_s10 | gnv
  salePrice: number                   — R$/liter (consumer price)
  purchasePrice: number (nullable)    — R$/liter (station's cost)
  surveyDate: Date                    — when ANP collected this price
  createdAt: DateTime
}
```

### Updated FuelEntry (extends fuel-tracking data model)

```diff
  FuelEntry {
    ...
-   station: string (optional)                    — free text station name
+   stationName: string (optional)                — display name (from ANP or manual)
+   stationCnpj: string (optional)                — links to ANP GasStation registry
+   stationBrand: string (optional)               — Shell, Ipiranga, BR, etc.
+   stationAddress: string (optional)             — formatted address
    location: {lat, lng} (optional)               — GPS coordinates (unchanged)
    ...
  }
```

**Note:** `stationCnpj` is the key link. When present, it connects the fill-up to the full GasStation record and its price history. When null, the user entered the station manually (free text fallback).

---

## Database Schema (Supabase/PostgreSQL)

```sql
-- Gas station registry (from ANP cadastral data)
CREATE TABLE gas_stations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj          text UNIQUE NOT NULL,
  trade_name    text,
  legal_name    text,
  brand         text,
  address       text,
  neighborhood  text,
  city          text,
  state         text,
  zip_code      text,
  latitude      decimal,
  longitude     decimal,
  fuel_types    text[],
  status        text DEFAULT 'active',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Fuel prices (from ANP weekly survey)
CREATE TABLE fuel_prices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_cnpj    text NOT NULL REFERENCES gas_stations(cnpj),
  fuel_type       text NOT NULL,
  sale_price      decimal NOT NULL,
  purchase_price  decimal,
  survey_date     date NOT NULL,
  created_at      timestamptz DEFAULT now(),
  UNIQUE(station_cnpj, fuel_type, survey_date)
);

-- Indexes for search performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;            -- trigram for fuzzy text search
CREATE EXTENSION IF NOT EXISTS postgis;             -- geospatial queries

CREATE INDEX idx_stations_city_state ON gas_stations(city, state);
CREATE INDEX idx_stations_brand ON gas_stations(brand);
CREATE INDEX idx_stations_trade_name_trgm ON gas_stations USING gin(trade_name gin_trgm_ops);
CREATE INDEX idx_prices_cnpj_date ON fuel_prices(station_cnpj, survey_date DESC);

-- Geospatial column + index (for nearby search)
ALTER TABLE gas_stations ADD COLUMN geom geometry(Point, 4326);
CREATE INDEX idx_stations_geom ON gas_stations USING gist(geom);

-- Trigger to keep geom in sync with lat/lng
CREATE OR REPLACE FUNCTION update_station_geom()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_station_geom
BEFORE INSERT OR UPDATE OF latitude, longitude ON gas_stations
FOR EACH ROW EXECUTE FUNCTION update_station_geom();
```

---

## API Endpoints

### Station Search (Text-Based)

```
GET /api/stations/search
  ?q=shell+centro          — search term (fuzzy match on trade_name)
  &city=sao+paulo          — optional city filter
  &state=SP                — optional state filter
  &limit=10                — max results (default 10, max 25)
```

**Response:**
```json
{
  "stations": [
    {
      "cnpj": "12.345.678/0001-90",
      "tradeName": "Auto Posto Shell Centro",
      "brand": "SHELL",
      "address": "Av. Paulista, 1000",
      "neighborhood": "Bela Vista",
      "city": "Sao Paulo",
      "state": "SP",
      "latitude": -23.5612,
      "longitude": -46.6559,
      "latestPrices": [
        { "fuelType": "gasolina_comum", "salePrice": 5.89, "surveyDate": "2026-02-06" },
        { "fuelType": "etanol", "salePrice": 3.99, "surveyDate": "2026-02-06" }
      ]
    }
  ]
}
```

### Nearby Stations (Geospatial)

```
GET /api/stations/nearby
  ?lat=-23.5505            — user latitude
  &lng=-46.6333            — user longitude
  &radius=5000             — radius in meters (default 5000, max 20000)
  &limit=10                — max results
```

**Response:** Same shape as search, with added `distanceMeters` field, sorted by proximity.

### Station Detail

```
GET /api/stations/:cnpj
```

**Response:** Full station record + complete price history (last 3 months).

### Station Price History

```
GET /api/stations/:cnpj/prices
  ?fuel_type=gasolina_comum    — optional filter
  &from=2025-11-01             — optional date range
  &to=2026-02-10
```

**Response:** Array of price records for the station.

---

## User Stories

### Story S.1: Search Station by Name When Logging Fill-Up

**As a** user logging a fill-up
**I want to** search for a gas station by name
**So that** I get accurate station data (brand, address, CNPJ) without typing it manually

**Acceptance Criteria:**
- [ ] Station field on fill-up form is a searchable input (not free text)
- [ ] Typing 3+ characters triggers debounced search (300ms) against `/api/stations/search`
- [ ] Results show: station trade name, brand, address, city
- [ ] Results show latest ANP price for the selected fuel type (if available)
- [ ] Selecting a station auto-fills: stationName, stationCnpj, stationBrand, stationAddress, and location (if coords available)
- [ ] Previous stations from user's fill-up history shown as suggestions before typing
- [ ] "Enter station manually" option available at bottom of results (free text fallback)
- [ ] Empty state when no results: "Station not found. Enter manually?"

**Priority:** P1

---

### Story S.2: Find Nearby Stations Using GPS

**As a** user at or near a gas station
**I want to** find stations near my current location
**So that** I can quickly select the one I'm at without searching by name

**Acceptance Criteria:**
- [ ] "Find nearby" / location icon button next to station search field
- [ ] Tapping requests device GPS permission (if not already granted)
- [ ] Queries `/api/stations/nearby` with user coordinates
- [ ] Results sorted by distance, showing distance in meters/km
- [ ] Each result shows: trade name, brand, distance, address
- [ ] Selecting a station behaves same as Story S.1 (auto-fills fields)
- [ ] Loading state while fetching GPS + querying API
- [ ] Error state if GPS denied: "Enable location to find nearby stations"
- [ ] Error state if no stations found: "No stations found nearby. Try searching by name."

**Priority:** P1

---

### Story S.3: View ANP Price When Selecting Station

**As a** user selecting a station
**I want to** see the latest surveyed fuel price at that station
**So that** I can verify my fill-up cost and spot discrepancies

**Acceptance Criteria:**
- [ ] Station search results show latest ANP price per liter for relevant fuel types
- [ ] Price shows survey date (e.g., "R$ 5.89/L — surveyed Jan 28")
- [ ] If no ANP price data available, show "Price not surveyed" (459 cities covered, not all)
- [ ] Price shown is informational only — does not override user's actual cost entry
- [ ] Fuel type filter matches the fuel type selected in the fill-up form

**Priority:** P2

---

### Story S.4: ANP Data Ingestion Pipeline

**As the** system
**I want to** automatically ingest ANP station registry and fuel price data
**So that** station search results are accurate and prices are up to date

**Acceptance Criteria:**
- [ ] Scheduled job runs weekly (matches ANP survey cadence)
- [ ] Downloads ANP cadastral CSV and upserts into `gas_stations` table
- [ ] Downloads ANP price series CSV (latest 4 weeks) and upserts into `fuel_prices` table
- [ ] Handles CSV encoding (ANP uses ISO-8859-1/Latin-1)
- [ ] Logs ingestion stats: stations imported, prices imported, errors
- [ ] Stations not in latest cadastral download marked as `inactive` (not deleted)
- [ ] Idempotent: re-running does not create duplicates (upsert on CNPJ / CNPJ+fuel_type+date)
- [ ] Manual trigger available for initial load and debugging

**Priority:** P0 (prerequisite for all other stories)

---

### Story S.5: Geocode Stations Missing Coordinates

**As the** system
**I want to** geocode station addresses that lack latitude/longitude
**So that** geospatial "nearby" search works for all stations

**Acceptance Criteria:**
- [ ] After ingestion, identify stations with address but no lat/lng
- [ ] Batch geocode using Nominatim (OpenStreetMap, free) or Google Geocoding API
- [ ] Respect rate limits (Nominatim: 1 req/sec; Google: pay-per-use)
- [ ] Store geocoded coordinates on the station record
- [ ] Update PostGIS `geom` column (via trigger)
- [ ] Log geocoding stats: attempted, successful, failed
- [ ] Priority: geocode stations in major cities first (SP, RJ, BH, BSB, CWB, POA, etc.)
- [ ] Incremental: only geocode new/updated stations, not the full dataset each time

**Priority:** P1 (required for Story S.2 nearby search)

---

## UI/UX Design

### Station Picker on Fill-Up Form

```
┌─────────────────────────────────────────┐
│  Station     [🔍 Search stations...] 📍  │
│  ┌─────────────────────────────────────┐ │
│  │  Recent stations                    │ │
│  │  ┌───────────────────────────────┐  │ │
│  │  │ 🐚 Posto Shell Centro         │  │ │
│  │  │    Av. Paulista, 1000 - SP    │  │ │
│  │  └───────────────────────────────┘  │ │
│  │  ┌───────────────────────────────┐  │ │
│  │  │ 🟡 Auto Posto Ipiranga Mall   │  │ │
│  │  │    R. Augusta, 500 - SP       │  │ │
│  │  └───────────────────────────────┘  │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### After Typing 3+ Characters

```
┌─────────────────────────────────────────┐
│  Station     [shell cen             ] 📍 │
│  ┌─────────────────────────────────────┐ │
│  │  🐚 Auto Posto Shell Centro        │ │
│  │     Av. Paulista, 1000 - Bela Vista │ │
│  │     Gasolina: R$ 5.89/L (Feb 6)    │ │
│  ├─────────────────────────────────────┤ │
│  │  🐚 Posto Shell Consolacao         │ │
│  │     R. da Consolacao, 2300 - SP     │ │
│  │     Gasolina: R$ 5.95/L (Feb 6)    │ │
│  ├─────────────────────────────────────┤ │
│  │  ✏️  Enter "shell cen" manually     │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### "Find Nearby" Results (via 📍 button)

```
┌─────────────────────────────────────────┐
│  Nearby stations                    ✕   │
│  ┌─────────────────────────────────────┐ │
│  │  🟢 BR Posto Bela Vista    120m    │ │
│  │     R. Bela Cintra, 80 - SP        │ │
│  │     Gasolina: R$ 5.79/L (Feb 6)    │ │
│  ├─────────────────────────────────────┤ │
│  │  🐚 Posto Shell Centro     350m    │ │
│  │     Av. Paulista, 1000 - SP        │ │
│  │     Gasolina: R$ 5.89/L (Feb 6)    │ │
│  ├─────────────────────────────────────┤ │
│  │  🟡 Ipiranga Jardins       800m    │ │
│  │     Al. Santos, 200 - SP           │ │
│  │     Gasolina: R$ 5.92/L (Feb 6)    │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Brand Icons

Map station brands to recognizable icons/colors:
- 🟢 BR (Petrobras) — Green
- 🐚 Shell — Yellow/Red
- 🟡 Ipiranga — Yellow
- ⬜ Bandeira Branca (unbranded) — Neutral
- Other brands: default fuel pump icon

---

## Technical Considerations

**ANP CSV Encoding:** Files use ISO-8859-1 (Latin-1) encoding, not UTF-8. Must handle character conversion during ingestion.

**ANP Survey Coverage:** Weekly surveys cover 459 municipalities — not every station in Brazil has price data. The station registry is complete (all ~40K), but prices are sampled. UI must gracefully handle "no price data."

**CNPJ Format:** ANP uses formatted CNPJ (XX.XXX.XXX/XXXX-XX). Normalize to digits-only for storage/comparison; format for display.

**Geocoding Budget:** ~40K stations need geocoding. Using Nominatim (free, 1 req/sec) = ~11 hours for initial batch. Google Geocoding ($5/1K) = ~$200 one-time. Recommend Nominatim for initial batch, Google for gap-fill.

**Search Performance:** Trigram index (`gin_trgm_ops`) enables fast fuzzy text search. PostGIS `<->` operator for efficient nearest-neighbor queries. Both should handle the ~40K station dataset easily.

**Offline Consideration:** If the user has no connectivity when logging a fill-up, fall back to free-text entry (as current design). Station can be linked later via edit.

---

## Implementation Sequence

**Step 1: Data Foundation (Story S.4)**
- Set up Supabase tables with PostGIS
- Build ANP CSV ingestion (cadastral + prices)
- Run initial data load
- Verify data quality

**Step 2: Geocoding (Story S.5)**
- Batch geocode stations missing coordinates
- Verify geospatial queries work

**Step 3: Search API**
- Implement `/api/stations/search` (text)
- Implement `/api/stations/nearby` (geospatial)
- Implement `/api/stations/:cnpj` (detail + prices)

**Step 4: Station Picker UI (Story S.1)**
- Build searchable station input component
- Integrate with search API
- Add recent stations from history
- Add manual entry fallback

**Step 5: Nearby Search UI (Story S.2)**
- Add GPS "find nearby" button
- Integrate with nearby API
- Show distance in results

**Step 6: Price Display (Story S.3)**
- Show ANP prices in search results
- Handle "no price data" state

---

## Cost Summary

| Component | Cost | Notes |
|-----------|------|-------|
| ANP station registry | Free | Open government data |
| ANP fuel prices | Free | Open government data, weekly |
| Supabase (free tier) | Free | Up to 500MB DB, 50K monthly active users |
| Nominatim geocoding | Free | 1 req/sec rate limit, ~11h initial batch |
| Google Geocoding (optional) | ~$200 one-time | For gap-fill after Nominatim |
| Google Places Nearby (Phase 2) | ~$32/1K requests | $200/mo free credit; on-demand only |
| **Total MVP (Phase 1)** | **$0** | ANP + Nominatim + Supabase free tier |

---

## Dependencies & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| ANP CSV format changes | Ingestion breaks | Version detection + alerts on parse failures |
| ANP API/data unavailability | No fresh data | Cache previous data; manual re-import fallback |
| Not all stations geocoded | Nearby search incomplete | Text search always works; geocode incrementally |
| ANP prices only cover 459 cities | Many stations without prices | Show "Price not surveyed"; still useful for name/brand/address |
| Supabase free tier limits | DB size or request caps | Monitor usage; ~40K stations + prices fits well within 500MB |
| CNPJ mismatch between datasets | Prices not linked to stations | Normalize CNPJ format; log unmatched records |

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Station picker usage | >60% of fill-ups use station picker (vs manual) | Feature adoption |
| Search success rate | >80% of searches return the intended station | Data quality |
| Nearby search usage | >30% of fill-ups use "find nearby" | Location convenience |
| Data freshness | Prices <7 days old | Weekly ANP sync working |

---

## Out of Scope

- Real-time price alerts ("Gas is cheap at X right now") — planned for v3.0
- Station ratings/reviews — would require user-generated content system
- Route-based station suggestions ("cheapest station on your commute") — future
- Price crowdsourcing (users report prices) — evaluate post-MVP
- Non-Brazilian markets — ANP is Brazil-specific; other countries need different sources

---

*This feature extends the Fuel Tracking stories (stories.md). Story 1.3 "Add Station Location" becomes the integration point for this station lookup capability. Implementation should follow the Fuel Tracking Phase 3 (Enrichment) timeline.*
