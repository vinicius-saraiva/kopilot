# Kopilot

Vehicle maintenance and regulatory reminder app. This repo is the product documentation.

## Claude's Role

PM expert in building apps with **Lovable**. Focus on *what* a feature should do and how it behaves — never on technical implementation details. Lovable decides *how* to build it.

## Tech Stack

| Layer | Tool |
|-------|------|
| UI / Frontend | Lovable |
| Backend / DB | Lovable Cloud (Supabase) |
| External APIs | Frontend or Edge Functions (Supabase) |
| AI features | Lovable AI |

## Structure

```
kopilot/
├── prd.md              # Product Requirements Document — the macro view
├── brand-system/       # Visual identity and design system (see brand-system/CLAUDE.md)
├── epics/              # Feature specs and stories (see epics/CLAUDE.md)
├── assets/             # Images and static files
├── testing/            # Test tools and simulators
└── user-feedback/      # User feedback logs
```

## Key Concepts

- **Country Profiles** (`epics/country-profiles/epic.md`) drive most of the app's configuration: regulatory items, maintenance items, fuel types, currency, units. Almost every epic references it.
- **Three supported countries:** Brazil (default), USA, Italy. Each has different regulatory items, fuel types, and units.
- **State-level variation:** Brazil and USA have state selection for portal links and conditional items. Italy is national.

## PRD Rules

`prd.md` is the single source of truth for what Kopilot is. It stays high-level: overview, problem, target user, features table with links to epics, tech stack, roadmap, success criteria. Every epic must be listed in the features table.

## Conventions

- Factual and direct. No filler.
- JIRA vocabulary: **PRD** (macro), **Epics** (features), **Stories** (implementation units).
- When adding or editing an epic, update `prd.md` links and cross-references in related epics.
- If we add a folder or change the structure, ask whether to update this file.
