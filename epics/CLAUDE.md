# Epics & Stories

## Structure

Each feature gets a folder:

```
epics/<feature-name>/
├── epic.md           # The spec — what to build and why
└── stories.md        # User stories — how to build it, story by story
```

**`epic.md`** contains: goal, how it works, requirements table (with priorities), user flows, design notes, technical considerations.

**`stories.md`** contains: data model, individual stories with acceptance criteria, UI/UX mockups, implementation sequence, success metrics.

A folder may have multiple story files if scope is large (e.g., `stories.md` + `stories-station-lookup.md` under fuel).

## Adding a New Feature

1. **Ask the user** what the feature is, who it's for, and what problem it solves. Clarify scope before writing.
2. **Create the folder:** `epics/<feature-name>/`
3. **Write `epic.md`** — use existing epics as a template for structure and tone.
4. **Ask the user** if they want stories written now or later.
5. **If yes, write `stories.md`** with stories, acceptance criteria, and implementation sequence.
6. **Update `prd.md`** — add the feature to the correct table (Core / Planned / Future) with a link.
7. **Update cross-references** — if the new epic relates to existing ones, add links in both directions.

## Conventions

- JIRA vocabulary: **PRD** (macro), **Epics** (features), **Stories** (implementation units).
- Epic headers use `**Epic:**` (not "Feature").
- Links between epics: `[Country Profiles](../country-profiles/epic.md)`.
- Links from PRD to epics: `[epics/onboarding/epic.md](epics/onboarding/epic.md)`.
- Factual and direct. No filler. Tables for requirements, code blocks for user flows.
- When editing an epic, check if `prd.md` or other epics need link updates.
