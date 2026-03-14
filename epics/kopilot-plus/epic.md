# Kopilot+

**Epic:** Subscription plan with partner discounts
**Status:** Planned
**Related:** [Dashboard](../dashboard/epic.md), [Settings](../settings/epic.md)

---

## Goal

Monetize Kopilot through a monthly subscription (Kopilot+) that gives subscribers discounts at auto parts retailers, maintenance networks, and gas stations. This epic covers the subscription experience only — not the partner program structure.

---

## How It Works

1. **Discovery:** User sees a promotional card on the Dashboard (above Checklist) inviting them to subscribe.
2. **Learn more:** Tapping the card opens a dedicated Kopilot+ page explaining benefits and pricing.
3. **Subscribe:** A CTA on the page redirects the user to Stripe Checkout.
4. **Confirmation:** After successful payment, Stripe redirects the user back to Kopilot. The Dashboard now shows an active Kopilot+ card instead of the promotional one.
5. **Manage:** The user can see their subscription status in Settings.

---

## Availability

- **Brazil only** for now. R$15/month.
- Only users with country set to Brazil see the promotional card and subscription option.

---

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Promotional card on Dashboard (above Checklist) | P0 | Visible only to non-subscribers with country = Brazil |
| Kopilot+ info page | P0 | Explains benefits, pricing (R$15/mês), CTA to Stripe |
| Stripe Checkout integration | P0 | Monthly recurring payment, R$15 BRL |
| Post-payment redirect to Kopilot | P0 | User returns to Dashboard after successful payment |
| Active subscriber card on Dashboard | P0 | Replaces promotional card; not clickable for now |
| Subscription status in Settings | P0 | Shows whether user is Kopilot+ or not |
| Stripe webhook for payment events | P1 | Handle subscription created, cancelled, payment failed |
| Manage/cancel subscription (via Stripe portal) | P2 | Future: link to Stripe Customer Portal from Settings |

---

## User Flows

### Non-subscriber (Brazil)

```
Dashboard
  → Promotional card "Kopilot+" (above Checklist)
  → Tap card
  → Kopilot+ info page (benefits + pricing)
  → Tap "Assinar Kopilot+" CTA
  → Stripe Checkout (R$15/mês)
  → Payment success
  → Redirect back to Kopilot Dashboard
  → Dashboard shows active Kopilot+ card (not clickable)
```

### Non-subscriber (USA / Italy)

```
Dashboard
  → No Kopilot+ card shown
```

### Subscriber checking status

```
Settings
  → Subscription section
  → Shows "Kopilot+" badge / active status
```

---

## Dashboard Cards

### Promotional Card (non-subscriber, Brazil only)

- Positioned above the Checklist card
- Communicates the value proposition briefly: discounts on parts, maintenance, and fuel
- Clear CTA to learn more

### Active Card (subscriber)

- Replaces the promotional card in the same position
- Shows that the user is a Kopilot+ subscriber
- Not clickable for now (future: link to benefits/partner list)

---

## Kopilot+ Info Page

A standalone page (not a modal) with:

- Kopilot+ branding / header
- Key benefits: discounts on auto parts retailers, maintenance networks, gas stations
- Pricing: R$15/mês
- CTA button: redirects to Stripe Checkout
- Back navigation to Dashboard

---

## Stripe Integration

| Aspect | Detail |
|--------|--------|
| Payment method | Stripe Checkout (hosted) |
| Billing cycle | Monthly, R$15 BRL |
| Success URL | Redirect back to Kopilot Dashboard |
| Cancel URL | Redirect back to Kopilot+ info page |
| Subscription tracking | Store subscription status per user (active / inactive) |
| Webhook events | `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed` |

---

## Settings Changes

Add a **Subscription** section to Settings (under Account):

- **If subscriber:** Show "Kopilot+" with active badge
- **If not subscriber (Brazil):** Show "Kopilot+" with option to subscribe
- **If not subscriber (USA/Italy):** Section not visible

---

## Design Notes

- The promotional card should feel distinct from the existing dashboard cards — it's a promotion, not a status card. Use brand accent colors or a subtle gradient to differentiate.
- The active card should feel like a status indicator, not a promotion — more subdued, confirming membership.
- The info page should be simple and scannable. Not a long sales page.
