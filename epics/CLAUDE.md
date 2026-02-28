# Epics & Stories

## Structure

Each feature gets a folder:

```
epics/<feature-name>/
├── epic.md           # The spec — what to build and why
└── stories.md        # Stories = Lovable prompts, one per iteration
```

**`epic.md`** contains: goal, how it works, requirements table (with priorities), user flows, design notes, technical considerations.

**`stories.md`** contains: stories grouped by Lovable prompt, with implementation sequence. Each story is an atomic prompt that Lovable can execute.

A folder may have multiple story files if scope is large (e.g., `stories.md` + `stories-advanced.md` under fuel).

## How to Write Stories

Stories become Lovable prompts. They must be **lean** — Lovable is good at deciding layout, design, and data model on its own.

**For each story, write:**
- What the screen does and what information it collects
- Behavior: navigation, validations, states (empty, error, success)
- Exact copy where needed (labels, placeholders, messages)
- Dependencies on other epics

**Do NOT write:**
- Layout, positions, spacing, alignment — Lovable does this better on its own
- Data model or SQL — Lovable creates tables on its own
- Component styling (padding, border-radius, specific colors) — the brand system is attached as context
- CSS, dimensions, detailed mockups

**Structure of the Lovable prompt derived from the story:**
1. Brief context (1-2 lines): what the app is, what we're building
2. For each screen: what it does, what data it collects, behavior
3. Notes only if there's something Lovable can't infer from context

> The brand system (`brand-system/brand-system.md`) and the PRD (`prd.md`) are attached as project context in Lovable, not copied into the prompt.

## Adding a New Feature

1. **Ask the user** what the feature is, who it's for, and what problem it solves. Clarify scope before writing.
2. **Create the folder:** `epics/<feature-name>/`
3. **Write `epic.md`** — use existing epics as a template for structure and tone.
4. **Ask the user** if they want stories written now or later.
5. **If yes, write `stories.md`** with stories, acceptance criteria, and implementation sequence.
6. **Update `prd.md`** — add the feature to the correct table (Core / Planned / Future) with a link.
7. **Update cross-references** — if the new epic relates to existing ones, add links in both directions.

## Conventions

- JIRA vocabulary: **PRD** (macro), **Epics** (features), **Stories** (implementation units = Lovable prompts).
- Epic headers use `**Epic:**` (not "Feature").
- Links between epics: `[Country Profiles](../country-profiles/epic.md)`.
- Links from PRD to epics: `[epics/onboarding/epic.md](epics/onboarding/epic.md)`.
- Factual and direct. No filler. Tables for requirements, code blocks for user flows.
- When editing an epic, check if `prd.md` or other epics need link updates.
