# Welcome Page — Refinements (v2)

## Lovable Prompt

Paste the following directly into Lovable after the first round of changes (stories.md) has been applied:

---

I need a few more refinements to the Welcome page. Same rules: keep structure intact, only change what's specified.

### 1. Remove "Bem-vindo ao Kopilot" title

The hero section currently shows the logo AND a title "Welcome to Kopilot" (`auth.welcome`). Since the logo is already prominent, the title is redundant. Remove the `<h1>` element that renders `auth.welcome` from the hero section in `Welcome.tsx`.

The tagline (`auth.tagline`) moves up to sit directly under the logo, becoming the subtitle. Keep the same styling (`text-body-small text-dust mt-xs text-center max-w-xs`) but change `mt-xs` to `mt-md` so it has a bit more breathing room under the logo.

### 2. Update tagline text

Change `auth.tagline` in all 3 locale files:

- EN: "Your copilot for vehicle maintenance" → "The copilot your car was missing"
- PT: "Seu copiloto para manutenção veicular" → "O copiloto que seu carro precisava"
- IT: "Il tuo copilota per la manutenzione del veicolo" → "Il copilota che mancava alla tua auto"

This tagline is shared across `/welcome`, `/login`, and `/signup` — changing it in the locale files updates all 3 pages.

### 3. Change "Track every cent" icon to CircleDollarSign

In `Welcome.tsx`, change the icon for the second feature card (currently Bell, or TrendingUp if stories.md was already applied) to `CircleDollarSign` from lucide-react. This icon looks like a coin with a dollar sign — much more intuitive for a spending/money feature.

Update the import line to include `CircleDollarSign` instead of `Bell` or `TrendingUp`.

### 4. Fix the laggy loading / layout shift on the Install Prompt

The current Welcome page has a jarring animation issue: elements load in one by one with staggered delays (250ms, 300ms, 400ms, 500ms, 600ms), and the "Install Kopilot" banner pops in late because `usePWAInstall` resolves asynchronously. This causes a layout shift that feels low quality.

Fix this with a better approach:

**Option A (recommended): Reserve space for the install prompt**

In `Welcome.tsx`, instead of conditionally rendering `<InstallPrompt>` (which causes layout shift when it appears), always render a wrapper div with a fixed minimum height. The `InstallPrompt` component should fade in when ready, but the space should already be reserved.

Replace the current install prompt section:
```tsx
<div className="max-w-sm mx-auto mb-md animate-fade-in" style={{ animationDelay: "250ms" }}>
  <InstallPrompt variant="banner" />
</div>
```

With:
```tsx
<div className="max-w-sm mx-auto mb-md min-h-[80px]">
  <InstallPrompt variant="banner" />
</div>
```

And in `InstallPrompt.tsx`, when `isInstalled || !canShowPrompt` returns true, instead of returning `null`, return an empty div with the same height to prevent layout shift:
```tsx
if (isInstalled || !canShowPrompt) {
  return <div className="h-0" />;
}
```

**Option B: Simplify the stagger animation**

Also reduce the staggered animation timing. Instead of 100ms, 200ms, 250ms, 300ms, 400ms, 500ms, 600ms spread across 7 elements, use a tighter sequence:

- Logo: 0ms (immediate)
- Tagline: 100ms
- Install prompt: 150ms
- Feature cards: 200ms, 250ms, 300ms
- CTA buttons: 350ms

This makes everything feel like a single cohesive reveal rather than elements trickling in one by one.

**Apply both Option A and Option B together.**

### Summary of files to change:
- `src/pages/Welcome.tsx` — remove `<h1>` with `auth.welcome`, adjust tagline spacing, change icon to CircleDollarSign, fix install prompt wrapper, tighten animation delays
- `src/components/InstallPrompt.tsx` — return empty div instead of null when not showing
- `src/i18n/locales/en.json` — update `auth.tagline`
- `src/i18n/locales/pt-BR.json` — update `auth.tagline`
- `src/i18n/locales/it.json` — update `auth.tagline`

Do NOT change: CTAs, Google Sign-In, footer, or color scheme.
