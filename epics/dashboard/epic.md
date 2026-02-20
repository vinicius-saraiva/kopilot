# Dashboard

**Epic:** Home screen / main dashboard
**Status:** MVP

---

## Goal

The dashboard is the home page of Kopilot. It gives the user an at-a-glance view of all their vehicle's trackable items — both regulatory and maintenance — with clear status indicators showing what's OK, what's approaching, and what's overdue.

---

## Trackable Items

> **Note:** The items listed below are the **Brazil profile** defaults. Trackable items vary by country — the user's selected country determines which regulatory and maintenance items appear on the dashboard. See [Country Profiles](../country-profiles/epic.md) for the full mapping across Brazil, USA, and Italy.

### Regulatory (5)

| Item | Description | Input Method | Reminder Logic |
|------|-------------|--------------|----------------|
| **IPVA** | Annual vehicle property tax | User inputs due date | Configurable reminder (e.g., 30 days before) |
| **Licenciamento** | Annual registration renewal (CRLV) | User inputs due date | Configurable reminder |
| **Seguro** | Private vehicle insurance | User inputs expiry date | Reminder 30 days before |
| **CNH** | Driver's license renewal | User inputs expiry date | Reminder 30-60 days before |
| **Multas** | Traffic fine check | No date input | Periodic nudge (every 45 days) with link to check |

### Maintenance (8)

| Item | Description | Input Method | Reminder Logic |
|------|-------------|--------------|----------------|
| **Oleo do motor** | Engine oil | Last change date + interval (km or months) | When interval approaches |
| **Agua de resfriamento** | Coolant | Last check/top-up date + interval | When interval approaches |
| **Oleo da direcao** | Power steering fluid | Last change date + interval | When interval approaches |
| **Fluido de freio** | Brake fluid | Last change date + interval | When interval approaches |
| **Bateria** | Battery | Installation date + lifespan (e.g., 3 years) | When approaching replacement age |
| **Pressao dos pneus** | Tire pressure | Last check date | Periodic reminder (e.g., monthly) |
| **Pastilhas de freio** | Brake pads | Last change date + interval (km) | When interval approaches |
| **Troca de pneus** | Tire replacement | Last change date + interval (km or years) | When interval approaches |

**Total: 13 trackable items**

---

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| List of all items (regulatory + maintenance) | P0 | Core view |
| Status indicator per item (OK / Approaching / Overdue) | P0 | Visual clarity |
| Next due item highlighted | P1 | Quick scan value |
| Sort/filter options | P2 | Post-MVP |

---

## Reminder System

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Time-based reminders | P0 | "X days before due date" |
| Interval-based reminders | P0 | "Every X months" or "Every X km" |
| Push notifications | P0 | Core value delivery |
| Configurable lead time | P1 | User chooses how far in advance |
| Snooze reminder | P1 | "Remind me tomorrow" |

---

## Adding/Editing a Reminder

```
1. Tap item (e.g., "Oleo do motor")
2. Input screen:
   - Last done: [date picker]
   - Interval: [number] + [km / months]
   - Remind me: [X days/km before]
3. Save → returns to dashboard with updated status
```

---

## Completing a Maintenance Item

```
1. Receive reminder notification
2. Tap notification → opens item detail
3. User performs maintenance
4. Tap "Mark as Done"
5. Input:
   - Date completed: [today by default]
   - Current mileage: [input]
   - Notes (optional): [free text]
   - Cost (optional): [input]
6. Save → resets interval, schedules next reminder
```

---

## Multas (Periodic Nudge)

```
1. Receive periodic notification: "Time to check for multas"
2. Tap → opens item with:
   - "Check on DETRAN" button (deep link to state DETRAN or Serasa/Zapay)
   - "Dismiss for now" option
3. Resets timer for next nudge
```

---

## Mileage Tracking

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Manual mileage input | P0 | When completing items |
| Periodic mileage check-in | P1 | Monthly prompt to update |
| Mileage-based reminder calculation | P1 | Estimate based on last updates |
