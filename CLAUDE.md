# Kopilot

Vehicle maintenance and regulatory reminder app. This repo is the product documentation.

## Structure

```
kopilot/
├── prd.md              # Product Requirements Document — the macro view
├── brand-system.md     # Visual identity and design system
├── epics/              # Feature specs and stories (see epics/CLAUDE.md)
├── assets/             # Images and static files
└── tutorials/          # Dev tutorials and prototypes
```

## Key Concepts

- **Country Profiles** (`epics/country-profiles/epic.md`) drive most of the app's configuration: regulatory items, maintenance items, fuel types, currency, units. Almost every epic references it.
- **Three supported countries:** Brazil (default), USA, Italy. Each has different regulatory items, fuel types, and units.
- **State-level variation:** Brazil and USA have state selection for portal links and conditional items. Italy is national.

## PRD Rules

`prd.md` is the single source of truth for what Kopilot is. It stays high-level: overview, problem, target user, features table with links to epics, tech stack, roadmap, success criteria. Every epic must be listed in the features table.
