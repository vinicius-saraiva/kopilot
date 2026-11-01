# Landing Page (v2)

**Epic:** Marketing landing page — full redesign
**Status:** Planned
**Target:** v1.x (alongside Native App launch)
**Supersedes:** [epic-v1.md](./epic-v1.md)

---

## Why a v2

The v1 landing was built before the app had its current scope and before the Native App push. It still works, but it has three problems:

1. **Too abstract.** It tells visitors Kopilot is "a copilot for your car" without showing the product in motion.
2. **No native-app readiness.** The CTA only handles waitlist/web signup. With Capacitor Android (and later iOS) coming, the hero needs to flip cleanly to store badges + email-when-ready.
3. **Pre-launch trust gap.** No users, no testimonials, no social proof. v1 leans on copy to build trust — v2 should lean on the product itself, the roadmap, and the founder.

v2 is a full redesign of the page. Brand system stays. Tech stack stays.

---

## Goal

Convert visitors into one of three actions, in priority order:

| Priority | Action | Trigger |
|----------|--------|---------|
| 1 | Install the app (web PWA today, native store post-launch) | Visitor is decided |
| 2 | Join the waitlist | Visitor is interested but not ready (e.g. iOS user, country not yet supported) |
| 3 | Open the live demo | Visitor is curious, wants to feel the product first |

Every section is judged by whether it moves a visitor toward one of these.

---

## Positioning

> **Kopilot is the operating system for your car ownership.**
> Not your driving. Not your car. Your *ownership* — the maintenance, the deadlines, the spending, the history.

Drop the "Strava for cars" framing. It's catchy but misleading: Strava is about performance; Kopilot is about responsibility. The closer analogy is **a personal CFO + calendar + logbook for the thing in your driveway**.

Audience framing — two profiles, same page:

| Profile | What they feel | What we show them |
|---------|----------------|-------------------|
| **The non-car-person** | Anxiety, guilt, avoidance | Relief — "the app remembers so you don't have to" |
| **The cost-aware driver** | "Where does my money actually go?" | Clarity — fuel km/L, spending by category, history |

Both profiles see the same page. The narrative addresses both without splitting.

---

## Page Structure

8 sections. Each must justify its scroll cost.

| # | Section | Purpose | Primary asset |
|---|---------|---------|---------------|
| 1 | **Hero** | Hook + immediate CTA + visual proof | Headline, sub, dual CTA, animated phone screenshot |
| 2 | **Cold Open** | Make the cost of *not* tracking visceral | 3 scenarios with real numbers (forgotten oil change, missed IPVA, fuel waste) |
| 3 | **Live Preview** | Show the product in motion, no install needed | Interactive phone mockup — tap hotspots to switch screens |
| 4 | **Three Pillars** | Compress the value prop into 3 ideas | Never Miss / Track Every Cent / Know Your Car |
| 5 | **Built for Your Country** | Show country-aware regulatory + units | BR / USA / IT toggle showing different items, currency, fuel types |
| 6 | **Why Not a Spreadsheet** | Differentiation against the most common alternative | Side-by-side: spreadsheet/notes vs. Kopilot, on the same data |
| 7 | **Roadmap & Founder** | Replace missing social proof with momentum + a face | Public changelog excerpt, native app countdown, founder note |
| 8 | **Final CTA** | One last conversion attempt, no friction | Email field + country picker, native badge placeholders |
| | Footer | Legal + links | Privacy, Contact, GitHub (changelog), Language switcher |

---

## Section Notes

### 1. Hero

- One headline. Currently testing: **"Your car has a to-do list. You just can't see it."**
- Sub-line names the relief in one breath: *Kopilot tracks every deadline, every cost, every kilometer — so you stop guessing.*
- Dual CTA: primary "Try it free" → opens web app; secondary "Get the app" → store badges (placeholder until native lands, then live).
- Visual: animated phone showing the dashboard cycling through checklist → fuel chart → ride map. Auto-loops, pauses on hover.
- Language switcher (PT-BR / EN / IT) + country pill (auto-detected, user can override).

### 2. Cold Open

3 scenario cards, each with:
- A short title ("You forgot your oil change for 4 months.")
- A real-money consequence ("Average engine flush: R$ 1.800. Worst case: R$ 12.000.")
- One line of empathy, no judgement.

Cards are localized — currency and amounts swap based on country pill.

### 3. Live Preview

The most important section. A single phone mockup, scroll- or tap-driven, showing 4 actual screens:
1. Dashboard with checklist
2. Ride detail with map
3. Fuel entry with km/L chart
4. History timeline

Each screen has 1-2 annotation labels appearing on hover/tap. Not a video — actual rendered screens with light interactivity. If interactive demo cost is too high for v1, fall back to a horizontally-scrollable carousel of high-res screenshots.

### 4. Three Pillars

Same three pillars as v1 — they're solid. Tighter copy, each pillar has one supporting micro-stat ("Tracks 13+ items per car", "Computes km/L from your last 30 fill-ups", "Snap-to-road GPS").

### 5. Built for Your Country

Toggle row at top: 🇧🇷 Brazil · 🇺🇸 USA · 🇮🇹 Italy.

For each country, show:
- 3-4 regulatory items unique to that country (IPVA, Smog Check, Bollo Auto, etc.)
- Currency + units used
- Sample dashboard screenshot localized

The point: prove Kopilot isn't a generic translation — it knows the rules where the visitor lives.

### 6. Why Not a Spreadsheet

A simple two-column comparison on the same fictional vehicle data:
- Left: a messy spreadsheet screenshot (real-looking)
- Right: the same data in Kopilot

Caption: *Same data. One reminds you. The other doesn't.*

### 7. Roadmap & Founder

Two side-by-side blocks:
- **Roadmap** — Pulled from `prd.md` Roadmap table, but visual: a horizontal timeline showing v1.0 (done) → v1.x (Native App, Insurance) → v2.x (AI Mechanic). Last 3 changelog entries listed below with dates.
- **Founder note** — Photo + 3 sentences from Vinicius: who he is, why he's building this, why it's not a side-project that'll disappear. Links to GitHub.

This section replaces the missing testimonials. It says: "There are no users yet. Here's what there is instead."

### 8. Final CTA

- One email field, one country picker, one button.
- Below: store badges (Android live post-launch, iOS coming).
- Microcopy: *No spam. We email twice — once when your country's native app is ready, once when there's a real update.*

---

## Requirements

| # | Requirement | Priority |
|---|-------------|----------|
| R1 | Page is responsive mobile-first, works at 320px width | Must |
| R2 | All 3 languages (PT-BR, EN, IT) supported, content localized end-to-end | Must |
| R3 | Country pill swaps currency, units, regulatory items in cold open + country section | Must |
| R4 | Lighthouse Performance ≥ 90 on mobile, LCP < 2.5s | Must |
| R5 | A11y: keyboard-navigable, alt text on all images, color contrast AA | Must |
| R6 | SEO: per-locale meta, OG image per locale, sitemap, hreflang | Must |
| R7 | Hero CTA is wired to PostHog event `landing_cta_clicked` with section + variant props | Must |
| R8 | Native app store badges hidden behind feature flag until launch | Must |
| R9 | Live Preview interactive on desktop + tap-to-cycle on mobile | Should |
| R10 | Country pill auto-detects via Accept-Language + IP fallback | Should |
| R11 | Founder section pulls last 3 changelog entries dynamically | Should |
| R12 | A/B test infrastructure ready for hero headline variants (PostHog experiment) | Should |
| R13 | Landing renders without JS for SEO crawlers (SSG or SSR) | Should |
| R14 | "Open the live demo" deep-links into a sandboxed app instance with seed data | Could |
| R15 | Anxiety meter or "what are you forgetting" calculator returns | Could |

---

## Constraints

- **No pricing copy.** Don't say "free", "$0", "no card needed". Pricing is TBD per [Kopilot+ epic](../kopilot-plus/epic.md).
- **No fake social proof.** No invented testimonials, no "10,000 drivers". The Founder section + Roadmap is the trust anchor until users exist.
- **Brand stays.** Follow [brand-system.md](../../brand-system/brand-system.md). Blaze Orange (#FF5F1F) reserved for primary CTAs. Don't introduce new accent colors.
- **i18n parity is binding.** A section ships in all three languages or it doesn't ship.
- **Native app integration.** Hero + Final CTA must support both states (pre-launch waitlist, post-launch store badges) via a single feature flag — see [Native App epic](../native-app/epic.md).

---

## Dependencies

| Epic | Why |
|------|-----|
| [Country Profiles](../country-profiles/epic.md) | Source of truth for regulatory items, currency, units shown in section 5 |
| [Native App](../native-app/epic.md) | Drives the store-badge state in hero + final CTA |
| [Analytics](../analytics/epic.md) | PostHog events on every CTA, scroll-depth, section-visible |
| [i18n](../i18n/epic.md) | Translation infrastructure, locale routing |
| [Privacy Policy](../privacy-policy/epic.md) | Footer link, must be live before email capture |

---

## Success Metrics

| Metric | Target | How measured |
|--------|--------|--------------|
| Visitor → email signup | ≥ 8% | PostHog conversion funnel |
| Visitor → app open (web demo) | ≥ 15% | PostHog `demo_opened` event |
| Scroll depth to final CTA | ≥ 50% | PostHog scroll milestones |
| Time on page (median) | ≥ 60s | PostHog session duration |
| LCP (mobile, p75) | < 2.5s | Vercel Speed Insights |

Targets are pre-launch, low-volume. Re-baseline once weekly visitors > 500.

---

## Out of Scope

- Pricing page or comparison table
- Blog or content marketing
- Affiliate / referral program landing variants
- B2B / fleet messaging
- Detailed feature pages (one per pillar) — possible v3

---

## Open Questions

- Should the Live Preview render the actual app in an iframe (with a demo account) or be a curated set of screenshots? Iframe is more honest, screenshots are faster.
- Founder photo — yes/no. Increases trust but adds personal exposure for Vinicius.
- Country auto-detect: Accept-Language alone, or pair with IP geolocation? IP costs money + privacy concerns.
- Native app pre-launch: do we collect email + country only, or also "which app store do you use" to size demand?

---

## Implementation

Stories will be written in a separate pass, split by section group:
1. Hero + Cold Open + Live Preview (the conversion top half)
2. Pillars + Country + Comparison (the proof middle)
3. Roadmap + Founder + Final CTA + Footer (the trust bottom + closer)
4. i18n pass + analytics wiring + a11y/perf cleanup

See `epic-v1.md` and existing `stories-v1.md` / `stories-v1.1.md` for what was shipped under v1 — useful reference, not binding.
