# Kopilot

Kopilot is a mobile app that helps people maintain their cars. This repo contains the product documentation, brand system, and supporting materials.

Live brand system: [brand.kopilot.autos](https://brand.kopilot.autos)

## Repo structure

```
prd.md                  Product Requirements Document
epics/                  Feature epics, each with user stories
  dashboard/
  fuel/
  history/
  onboarding/
  landing-page/
  rides/
  settings/
  ...
brand-system/           Brand guidelines website (deployed to GitHub Pages)
  index.html
  assets/               Logo and icon files (SVG + PNG)
tutorials/              Technical tutorials and simulators
user-feedback/          Raw user feedback notes
```

## Brand system

The `brand-system/` folder is automatically deployed to [brand.kopilot.autos](https://brand.kopilot.autos) via GitHub Actions on every push to `main`.

## Epics

Each folder under `epics/` represents a product epic. Inside you'll find:

- `epic.md` — scope, goals, and acceptance criteria
- `stories.md` — broken-down user stories (where applicable)

## Claude conversations

These are the original conversations used to create the documents in this repo:

- [Kopilot Brand System](https://claude.ai/share/a7ea7110-83b5-455c-9e77-290417d17ca0) — naming, brand identity, visual system, context prompt
- [Kopilot - PRD, Stories, Landing Page](https://claude.ai/share/08409424-2008-4372-b670-f1982f136bd0) — product requirements, user stories, landing page plan

## Questions

If something is unclear or you spot an issue, open an issue on this repo.
