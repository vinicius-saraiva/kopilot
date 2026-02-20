# Kopilot — Maintenance History Feature
## User Stories Document

**Feature:** Mechanic Visit Logging  
**Version:** v1.1  
**Status:** Ready for Implementation

---

## Overview

**Current state:** History tab shows completions of individual tracked items (oil, tires, etc.).

**Desired state:** Users can log mechanic visits as standalone events — capturing date, total cost, notes, and invoice photo. These exist independently from the 12 tracked maintenance items.

**Core insight:** Real-world maintenance happens in visits, not items. A single trip to the mechanic might include oil change + brake pads + tire rotation. Users think in visits; the app should too.

---

## Data Model

```
MaintenanceVisit {
  id: string
  vehicleId: string
  date: Date
  cost: number (optional)
  location: string (optional) — mechanic name/place
  notes: string (optional)
  invoicePhoto: string (URL, optional)
  createdAt: Date
  updatedAt: Date
}
```

This is **separate** from item-level tracking. A visit doesn't need to link to specific tracked items (that's v1.2 complexity).

---

## User Stories

### Epic: Mechanic Visit Logging

#### Story 1: Add a Mechanic Visit
**As a** user  
**I want to** log a mechanic visit with date and cost  
**So that** I have a record of when I serviced my car and how much I spent

**Acceptance Criteria:**
- [ ] User can access "Add Visit" from History tab (FAB or header action)
- [ ] Required field: Date (defaults to today)
- [ ] Optional fields: Cost (BRL), Location, Notes
- [ ] Save creates entry in History list
- [ ] Success feedback: toast or brief confirmation

**Priority:** P0

---

#### Story 2: Attach Invoice Photo
**As a** user  
**I want to** attach a photo of my invoice/receipt  
**So that** I have proof of service and can reference details later

**Acceptance Criteria:**
- [ ] Photo attachment option on Add/Edit Visit screen
- [ ] Supports camera capture or gallery selection
- [ ] Shows thumbnail preview after selection
- [ ] Photo stored and retrievable on visit detail view
- [ ] Max file size: 10MB (compress if needed)

**Priority:** P0

---

#### Story 3: View Visit History
**As a** user  
**I want to** see a chronological list of all my mechanic visits  
**So that** I can review my service history at a glance

**Acceptance Criteria:**
- [ ] History tab shows visits in reverse chronological order
- [ ] Each card shows: Date, Cost (if entered), Location (if entered)
- [ ] Visual indicator if photo attached (icon)
- [ ] Empty state: "No visits yet. Add your first mechanic visit."

**Priority:** P0

---

#### Story 4: View Visit Details
**As a** user  
**I want to** tap a visit to see full details  
**So that** I can review notes and view the attached invoice

**Acceptance Criteria:**
- [ ] Detail view shows all fields: Date, Cost, Location, Notes
- [ ] Invoice photo displayed (tappable to view full-screen)
- [ ] Edit button accessible from detail view
- [ ] Delete option (with confirmation)

**Priority:** P0

---

#### Story 5: Edit a Visit
**As a** user  
**I want to** edit a past visit entry  
**So that** I can correct mistakes or add missing info

**Acceptance Criteria:**
- [ ] All fields editable
- [ ] Can replace or remove photo
- [ ] Save updates the entry
- [ ] Cancel discards changes

**Priority:** P1

---

#### Story 6: Delete a Visit
**As a** user  
**I want to** delete a visit entry  
**So that** I can remove incorrect or duplicate records

**Acceptance Criteria:**
- [ ] Delete action requires confirmation ("Delete this visit?")
- [ ] Deletion removes entry and associated photo from storage
- [ ] Returns user to History list

**Priority:** P1

---

## UI/UX Notes

**Add Visit Screen:**
- Clean form layout following brand system
- Date picker (native mobile feel)
- Currency input with BRL formatting
- Photo capture prominent but not blocking

**History List:**
- Card-based layout
- Blaze accent for recent visits (last 7 days)
- Status colors not applicable here (no due dates)

**Empty State:**
- Motivating copy: "Your service history starts here."
- Clear CTA to add first visit

---

## Technical Notes

**Image Storage:**
- Use Lovable's file storage or Supabase Storage
- Generate thumbnails for list view performance
- Store original for detail view

**Offline Consideration:**
- Allow creating visits offline
- Queue photo uploads for when connected
- Show sync status if pending

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Visit logging adoption | >50% of active users log ≥1 visit in first 30 days | Core feature engagement |
| Photo attachment rate | >30% of visits include photo | Validates invoice capture value |
| Return usage | Users who log 1 visit log 2+ within 90 days | Habit formation |

---

## Out of Scope (v1.1)

- Linking visits to specific tracked items (v1.2)
- AI extraction of line items from invoice photo (v1.3)
- Cost analytics/totals dashboard (v1.2)
- Sharing/exporting visit history (v2.0)

---

## Implementation Sequence

1. **Data model + CRUD** — Create MaintenanceVisit entity with basic operations
2. **Add Visit flow** — Form with date, cost, location, notes
3. **History list** — Display visits in tab
4. **Photo attachment** — Camera/gallery integration + storage
5. **Detail view** — Full view with photo display
6. **Edit/Delete** — Complete CRUD cycle

---

*Ready for Lovable implementation. Start with Stories 1, 3, 4 (core loop), then layer in photo (Story 2) and edit/delete (Stories 5, 6).*
