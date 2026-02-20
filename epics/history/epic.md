# History

**Epic:** Complete activity history
**Status:** MVP (basic) / v1.x (photo-based logging)
**Related stories:** [stories.md](stories.md)

---

## Goal

A unified timeline of everything that happens with the vehicle: mechanic visits, fuel fill-ups, document renewals, maintenance completions, and any other update logged in the app. History is the single place to answer "when did I last do X?"

---

## What Gets Logged

| Source | Examples |
|--------|----------|
| Maintenance completions | Oil change, tire rotation, brake pads replaced |
| Mechanic visits | Invoice/receipt photos, work performed |
| Regulatory events | IPVA paid, insurance renewed, CNH renewed |
| Fuel fill-ups | Date, liters, cost, station |
| Documents | Photos of invoices, receipts, certificates |
| General updates | Any user-added note or event |

---

## Entry Structure

Each history entry contains:
- Date
- Category (maintenance / regulatory / fuel / mechanic / document / general)
- Description
- Mileage at time (if available)
- Notes (optional)
- Cost (optional)
- Attachments (photos — v1.x)

---

## Viewing History

```
1. Navigate to History tab
2. See chronological timeline of all events
3. Filter by category (maintenance, fuel, regulatory, etc.)
4. Tap entry → see full details, photos, notes
5. Search: "When did I last change the oil?"
```

---

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Log completion with date | P0 | MVP |
| Log mileage at completion | P0 | MVP |
| Chronological timeline view | P0 | MVP |
| Filter by category | P1 | |
| Optional notes field | P1 | |
| Optional cost field | P2 | For future expense tracking |
| Photo-based maintenance logging | P2 | v1.x — photo of invoice |
| AI extraction from invoice photos | P3 | Future — OCR line items |
| Export history | P2 | Useful for resale |
| Search history | P2 | |

---

## Photo-Based Logging (v1.x)

```
1. User completes a mechanic visit
2. Takes photo of invoice/receipt
3. App stores photo in maintenance history
4. Optional: AI extracts line items from invoice
5. Optional: User manually links items to tracked categories
6. Over time → complete, searchable service history
```

**Value:**
- Full maintenance history for peace of mind
- Easy lookup: "When did I last touch X?"
- Resale value: documented service history increases car value
- Pattern recognition: "You replaced the battery twice in 2 years — might be an alternator issue"

---

## Technical Considerations

- Image storage (Supabase Storage or similar)
- OCR for invoice extraction (future — can be manual MVP)
- Data model: HistoryEvent → links to categories, attachments, costs
