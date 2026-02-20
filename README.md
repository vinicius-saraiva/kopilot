# Kopilot

Kopilot is a mobile app that helps people maintain their cars. This repo contains the product documentation, brand system, and supporting materials used throughout the Product Heroes course.

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

## Questions

If something is unclear or you spot an issue, open an issue on this repo.
