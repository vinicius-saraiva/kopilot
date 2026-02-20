# Landing Page

**Epic:** Marketing landing page for Kopilot
**Status:** In Progress — content update
**Target:** Pre-launch

---

## Goal

Convert visitors into waitlist signups (pre-launch) or app downloads (post-launch). The page should make non-car-people *feel* the relief of having a copilot for their car — and show car-aware people the financial clarity they've been missing.

---

## Positioning

Kopilot is to your car what Strava is to running: it turns invisible, forgettable chores into visible, trackable progress — and invisible spending into clear numbers. You don't need to know how a car works. You just need to know your car is taken care of and your money is under control.

---

## Current State

The landing page already exists (React + Vite + Tailwind + Framer Motion, i18n in EN/PT/IT). The design language is strong and stays. **The content needs to be updated** to reflect what the app actually does today.

The current page only sells maintenance reminders. The app now also includes fuel tracking with analytics, GPS ride recording, unified spending history, and mechanic visit logs. The landing page must communicate the full value.

---

## Page Structure

6 sections + footer:

| # | Section | Purpose | Headline |
|---|---------|---------|----------|
| 1 | Hero | Hook — name the pain | "OWN YOUR DRIVE." |
| 2 | Problem | Pain amplification — 3 cards | "YOUR CAR IS TALKING. YOU'RE NOT LISTENING." |
| 3 | Solution | Relief — dashboard mockup (Fiat Pulse) | "MEET YOUR COPILOT." |
| 4 | Features | 3 value pillars | Never Miss / Track Every Cent / Know Your Car |
| 5 | Stakes | Urgency — 3 consequence cards | "THE PRICE OF NOT KNOWING" |
| 6 | Final CTA | Convert | "YOUR CAR DESERVES A COPILOT." |
| | Footer | Links | About, Privacy, Contact |

Removed sections: Social Proof (no users yet), Roadmap Tease (not needed).

---

## Feature Pillars

| Pillar | Emotional hook | Covers |
|--------|---------------|--------|
| **Never Miss a Thing** | Peace of mind | Maintenance checklist, regulatory deadlines, color-coded status, completion history |
| **Track Every Cent** | Financial control | Fuel logging, km/L efficiency, spending by category, mechanic visits |
| **Know Your Car** | Visibility | GPS ride tracking, route maps, distance/speed stats, full vehicle history |

---

## Narrative Arc

1. **Problem** — 3 pain points escalating: forgot a deadline → surprise repair bill → invisible fuel overspending
2. **Solution** — Kopilot handles it all (dashboard mockup showing checklist + fuel + rides)
3. **Features** — Proof that it delivers on 3 fronts (maintenance, money, knowledge)
4. **Stakes** — Real cost of inaction: destroyed engine, seized car, monthly overspending
5. **CTA** — Start now, peace of mind

---

## Design Direction

No changes — the current design language is strong:

- Dark cinematic hero, Blaze Orange (#FF5F1F) accent on CTAs only
- Light/dark alternating sections
- Mobile-first, Outfit font, Framer Motion scroll animations
- Follow [brand-system.md](../../brand-system.md) for colors and typography

---

## Interactive Elements (Post-MVP)

| Element | Purpose |
|---------|---------|
| "What are you forgetting?" Calculator | Tangible value demo — maintenance |
| "How much are you really spending?" Calculator | Financial urgency — fuel |
| Live Demo Mode | Reduce uncertainty — clickable prototype |
| Anxiety Meter | Emotional journey — scroll-triggered animation |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Conversion rate (visitor → signup) | 5-10% |
| Scroll depth (% reaching final CTA) | >60% |
| Time on page | >45 seconds |

---

## Implementation

Two Lovable prompts, to be applied in order:

1. [stories.md](./stories.md) — Main content update (pillars, mockups, cards, copy)
2. [stories-v2.md](./stories-v2.md) — Refinements (new Problem headline, remove pricing/free references, currency formatting)

**Important:** No mention of pricing, "free", or "$0" anywhere on the page. Pricing strategy is TBD.
