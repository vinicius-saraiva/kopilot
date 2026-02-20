# Kopilot Brand System
## AI-Readable Design Reference for Building Consistent Experiences

---

## Brand Overview

**Name:** Kopilot
**Tagline:** Own Your Drive.
**Category:** Vehicle maintenance tracking app
**Personality:** Athletic, motivating, direct — like a fitness coach for your car

### Brand Positioning
Kopilot is a car maintenance app for people who aren't "car people." It transforms forgotten maintenance into trackable progress with streaks, health scores, and clear reminders. Think Strava, but for your vehicle.

### Target User
- Not automotive enthusiasts
- Forget maintenance schedules
- Respond well to gamification and progress tracking
- Want clarity, not complexity

### Brand Values
1. **Proactive** — We remind before things break
2. **Clear** — No jargon, no mystery codes
3. **Motivating** — Maintenance as progress, not punishment
4. **Complete** — Full history, always accessible

---

## Design Tokens

### Colors

```css
:root {
  /* Primary */
  --color-blaze: #FF5F1F;           /* Primary accent, CTAs, progress */
  --color-blaze-dark: #E04A0F;      /* Hover/pressed states */
  --color-blaze-light: #FF8A50;     /* Highlights, gradients */
  
  /* Neutrals */
  --color-asphalt: #1A1A1A;         /* Primary dark background, text on light */
  --color-asphalt-light: #2A2A2A;   /* Elevated dark surfaces */
  --color-concrete: #3D3D3D;        /* Secondary text, borders on dark */
  --color-gravel: #6B6B6B;          /* Muted text, placeholders */
  --color-dust: #999999;            /* Disabled states, hints */
  --color-offwhite: #F7F7F7;        /* Card backgrounds, sections */
  --color-clean: #FFFFFF;           /* Primary light background */
  
  /* Semantic */
  --color-success: #00C853;         /* Success, healthy, on track */
  --color-warning: #FFB300;         /* Caution, approaching due */
  --color-error: #FF3B30;           /* Critical, overdue, errors */
}
```

#### Color Usage Rules
- **Blaze (#FF5F1F):** Primary actions, progress indicators, accent elements. Never use for error states.
- **Asphalt (#1A1A1A):** Primary dark background and text color on light backgrounds.
- **Semantic colors:** Use exclusively for status communication, never decoratively.

---

### Typography

**Font Family:** Outfit (Google Fonts)
```css
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Type Scale

| Token | Size | Weight | Line Height | Transform | Usage |
|-------|------|--------|-------------|-----------|-------|
| display-1 | 64px | 900 | 1.0 | uppercase | Hero headlines |
| display-2 | 48px | 900 | 1.0 | uppercase | Section titles |
| heading-1 | 32px | 800 | 1.1 | uppercase | Page titles |
| heading-2 | 24px | 700 | 1.2 | uppercase | Card titles, section headers |
| heading-3 | 18px | 700 | 1.3 | none | Subsection headers |
| body | 16px | 400 | 1.6 | none | Primary body text |
| body-small | 14px | 400 | 1.5 | none | Secondary text, descriptions |
| label | 11px | 700 | 1.2 | uppercase | Labels, categories, metadata |

#### Typography Rules
1. **Headlines are UPPERCASE** — Display and heading levels use uppercase
2. **Body text is sentence case** — Never uppercase body copy
3. **Labels are uppercase with letter-spacing** — Add 0.1em tracking
4. **One font family only** — Never introduce secondary typefaces
5. **Weight creates hierarchy** — 900 for impact, 700 for emphasis, 400 for reading

---

### Spacing

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
}
```

---

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;      /* Buttons, badges */
  --radius-md: 8px;      /* Cards, inputs */
  --radius-lg: 12px;     /* Larger cards */
  --radius-xl: 16px;     /* Modals */
  --radius-full: 9999px; /* Pills, avatars */
}
```

**Design Note:** Kopilot uses **minimal border radius**. Prefer sharp corners (0-8px) over rounded ones. This creates an athletic, decisive feel.

---

### Shadows

```css
:root {
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.25);
}
```

---

## Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--color-blaze);
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-sm);
}

.btn-primary:hover {
  background: var(--color-blaze-dark);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--color-asphalt);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 24px;
  border: 2px solid var(--color-asphalt);
  border-radius: var(--radius-sm);
}

.btn-secondary:hover {
  background: var(--color-asphalt);
  color: white;
}
```

---

## Logo Usage

### Primary Logo
The Kopilot wordmark consists of:
1. Bold condensed uppercase letterforms
2. A signature **orange accent bar** beneath the "K"
3. The bar is ~30% the width of the full wordmark

### App Icon
The standalone "K" mark with accent bar beneath. Use on dark backgrounds primarily.

### Logo Don'ts
- Never stretch or distort
- Never remove the accent bar
- Never place on busy backgrounds without sufficient contrast

---

## Logo & Icon Build Specifications

### Full Wordmark SVG (White on Dark)
```svg
<svg viewBox="0 0 260 55" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- K -->
  <path d="M0 5V50H16V32L38 50H58L28 27L56 5H38L16 24V5H0Z" fill="currentColor"/>
  <!-- o -->
  <path d="M64 20C54 20 48 27 48 35C48 43 54 50 64 50C74 50 80 43 80 35C80 27 74 20 64 20ZM64 40C60 40 58 38 58 35C58 32 60 30 64 30C68 30 70 32 70 35C70 38 68 40 64 40Z" fill="currentColor"/>
  <!-- p -->
  <path d="M88 20V58H102V46C105 48 109 50 114 50C125 50 132 43 132 35C132 27 125 20 114 20C109 20 105 22 102 24V20H88ZM110 40C106 40 102 37 102 35C102 33 106 30 110 30C114 30 118 33 118 35C118 37 114 40 110 40Z" fill="currentColor"/>
  <!-- i -->
  <path d="M142 8C137 8 134 11 134 15C134 19 137 22 142 22C147 22 150 19 150 15C150 11 147 8 142 8ZM136 20V50H148V20H136Z" fill="currentColor"/>
  <!-- l -->
  <path d="M158 5V50H172V5H158Z" fill="currentColor"/>
  <!-- o -->
  <path d="M190 20C180 20 174 27 174 35C174 43 180 50 190 50C200 50 206 43 206 35C206 27 200 20 190 20ZM190 40C186 40 184 38 184 35C184 32 186 30 190 30C194 30 196 32 196 35C196 38 194 40 190 40Z" fill="currentColor"/>
  <!-- t -->
  <path d="M220 12V22H212V34H220V42C220 49 226 52 236 52H246V42H238C234 42 232 40 232 36V34H246V22H232V12H220Z" fill="currentColor"/>
  <!-- Accent bar under K -->
  <rect x="0" y="52" width="60" height="3" fill="#FF5F1F"/>
</svg>
```

### App Icon SVG (K Mark Only)
```svg
<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- K letterform -->
  <path d="M10 6V34H16V24L26 34H34L20 20L34 6H26L16 18V6H10Z" fill="currentColor"/>
  <!-- Accent bar -->
  <rect x="10" y="36" width="12" height="2" fill="#FF5F1F"/>
</svg>
```

### Logo Color Variants

| Context | Letterforms | Accent Bar |
|---------|-------------|------------|
| On dark backgrounds | `#FFFFFF` | `#FF5F1F` |
| On light backgrounds | `#1A1A1A` | `#FF5F1F` |
| On Blaze background | `#FFFFFF` | `#FFFFFF` |

### Implementation Notes
- Use `currentColor` for letterforms to inherit text color from parent
- Accent bar is always Blaze (#FF5F1F) except on Blaze backgrounds
- Maintain aspect ratio — never stretch
- Minimum size: 80px width for full wordmark, 24px for icon
- The accent bar width is approximately 30% of the K letterform width

---

## Voice & Tone

### Principles
1. **Direct** — State facts clearly. No hedging.
2. **Motivating** — Frame as progress, celebrate wins.
3. **Clear** — Plain language, no jargon.

### Writing Examples

#### Do This
- "Oil change in 800 km. You're on a 3-month streak!"
- "Tire pressure low: 24 PSI. Target: 32. Here's how to fix it."
- "No maintenance due. Your car's in great shape."
- "Oil changed. 4-month streak! 🔥"

#### Not This
- "Your vehicle may be approaching the recommended oil change interval."
- "Tire pressure monitoring system has detected a deviation from optimal parameters."
- "There are currently no pending maintenance items to display."
- "Your maintenance record has been successfully updated."

### Tone by Context
| Context | Tone | Example |
|---------|------|---------|
| Dashboard | Confident, clear | "Your Honda Civic is 92% healthy" |
| Reminder | Direct, helpful | "Oil change due in 3 days" |
| Success | Celebratory, brief | "Done! Streak: 4 months 🔥" |
| Warning | Calm, actionable | "Tire pressure low. Here's what to do." |
| Error | Honest, helpful | "Couldn't connect. Try again." |

### Words We Use vs Avoid
| Use | Avoid |
|-----|-------|
| Track | Monitor |
| Fix | Rectify |
| Check | Inspect |
| Due | Scheduled |
| Done | Completed |
| Streak | Consecutive completions |

---

## Layout Principles

### Visual Hierarchy
1. **Bold headlines grab attention** — Large, uppercase, heavy weight
2. **Status colors signal importance** — Orange for upcoming, red for urgent
3. **Generous whitespace** — Don't crowd elements

### Mobile-First
- Design for 375px width first
- Touch targets minimum 44x44px
- Thumb-friendly primary actions at bottom

### Dark Mode
- Primary app experience is dark header + light content
- Full dark mode uses Asphalt (#1A1A1A) backgrounds
- Maintain Blaze accent visibility in both modes

---

## Animation Guidelines

### Principles
- **Quick and decisive** — Animations should feel snappy, not floaty
- **Purpose-driven** — Only animate to communicate state change

### Timing
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Quick Reference

### Essential Colors
```
Blaze: #FF5F1F
Asphalt: #1A1A1A
Success: #00C853
Warning: #FFB300
Error: #FF3B30
Offwhite: #F7F7F7
```

### Essential Typography
```
Font: Outfit
Headlines: 900 weight, uppercase
Body: 400 weight, sentence case
Labels: 700 weight, uppercase, 0.1em tracking
```

### Brand Personality in 3 Words
**Bold. Direct. Motivating.**

---

*Kopilot Brand System v1.0 — January 2025*
