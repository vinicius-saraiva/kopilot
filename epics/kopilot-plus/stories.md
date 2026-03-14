# Kopilot+ — Stories

## Story 1: Subscription experience (UI only, no Stripe yet)

We're adding **Kopilot+**, a monthly subscription (R$15/mês) that gives discounts on auto parts, maintenance, and gas stations. Available only in Brazil.

Build the full in-app experience. Do NOT integrate Stripe yet — use a placeholder for the payment step. We'll wire it up later.

### User Flows

**Non-subscriber (country = Brazil):**

```
Dashboard
  → New promotional card above Checklist: "Kopilot+"
    - Brief value prop: discounts on parts, maintenance, fuel
    - CTA to learn more
  → Tap card → navigates to Kopilot+ info page
  → Info page:
    - Header with Kopilot+ branding
    - Benefits list (auto parts, maintenance networks, gas stations)
    - Price: R$15/mês
    - CTA button "Assinar Kopilot+" (placeholder action for now — just log or show toast)
    - Back navigation to Dashboard
```

**Non-subscriber (country = USA or Italy):**

```
Dashboard
  → No Kopilot+ card shown anywhere
```

**Subscriber:**

```
Dashboard
  → Same position (above Checklist): active Kopilot+ card
    - Shows the user is a subscriber
    - Not clickable
  → The promotional card is gone
```

**Settings (all users with country = Brazil):**

```
Settings → new "Assinatura" section (under Account)
  → If subscriber: shows "Kopilot+" with active badge
  → If not subscriber: shows "Kopilot+" with option to subscribe (links to info page)
  → If country ≠ Brazil: section not visible
```

### Notes

- Store subscription status per user (active/inactive) so we can toggle the UI. For now a simple boolean is enough.
- The promotional card should feel visually distinct from the dashboard status cards — it's a promotion. Use accent colors or a subtle gradient.
- The active card should feel calm and confirmatory, not promotional.
- The info page is a standalone page, not a modal. Keep it short and scannable.

---

## Story 2: Stripe integration

In Story 1 we built the Kopilot+ subscription UI with a placeholder on the "Assinar Kopilot+" button. Now wire it up to Stripe.

### Flow

```
User taps "Assinar Kopilot+" on the info page
  → Create a Stripe Checkout session (Edge Function)
    - Mode: subscription
    - Price: R$15/mês (BRL)
    - Success URL: redirect back to Kopilot Dashboard
    - Cancel URL: redirect back to Kopilot+ info page
  → Redirect user to Stripe Checkout

After payment:
  → Stripe sends webhook → Edge Function receives it
  → On checkout.session.completed: mark user as Kopilot+ active
  → On customer.subscription.deleted: mark user as inactive
  → On invoice.payment_failed: mark user as inactive
  → User lands back on Dashboard → sees active Kopilot+ card
```

### What to build

1. **Edge Function `create-checkout-session`** — receives user ID, creates a Stripe Checkout session, returns the checkout URL.
2. **Edge Function `stripe-webhook`** — receives Stripe webhook events, updates the user's subscription status in the database.
3. **Wire the CTA button** — replace the placeholder action with a call to `create-checkout-session`, then redirect to the returned URL.
4. **On success redirect** — when the user returns from Stripe to the Dashboard, the app should re-fetch subscription status so the active card appears immediately.

### Notes

- Store the Stripe `customer_id` and `subscription_id` on the user record for future management (cancellation, portal, etc.).
- Use Stripe test mode keys for now. We'll switch to live keys at deploy time via environment variables.
- The webhook endpoint must verify the Stripe signature to ensure authenticity.