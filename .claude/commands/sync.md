Sync the kopilot-autos codebase with this product specification repo.

## Steps

1. **Pull latest code** from `/Users/viniciusandrade/Documents/Projects/kopilot-autos` (run `git pull`).

2. **Analyze what changed** since the last sync by reading the git log. Filter out noise commits ("Changes", "Save plan in Lovable", "Updated plan file"). Group meaningful commits by date and feature area.

3. **Read the current state** of this repo: `prd.md`, `changelog.md`, all epic files under `epics/`, and `CLAUDE.md`.

4. **Compare code vs docs** — identify:
   - New features built but not documented
   - Features documented as "Planned" that are now built
   - Status mismatches (epic says Planned but feature is live)
   - Missing changelog entries

5. **Update changelog.md** — prepend new entries at the top, organized by date. Only add entries for changes not already in the changelog. Use the same format: date header, feature area subheader, bullet points.

6. **Update epic statuses** — if a feature moved from Planned to built, update its `**Status:**` field to `Live`.

7. **Update epic content** — if significant new capabilities were added to an existing feature, add them to the epic's features list or add a "What's Built" section.

8. **Update prd.md** — if new features were added, update the features table. If features moved from Planned to Live, move them. Update the roadmap if needed. Update the "Last Updated" date.

9. **Update CLAUDE.md** — only if the project structure changed (new folders, renamed files).

10. **Show a summary** of all changes made to the user.

## Rules

- Do NOT create new epic folders unless an entirely new feature category was built.
- Do NOT change epic content that describes planned/future behavior — only update status and add "What's Built" sections.
- Do NOT touch brand-system/, testing/, user-feedback/, or landing-page/ content.
- Keep the same tone and conventions already used in the docs: factual, direct, no filler.
- If nothing meaningful changed since last sync, say so and stop.
