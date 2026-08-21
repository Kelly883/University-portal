# foundation-pack.md (template)

PLACEHOLDER — referenced by `foundation.md`, `audit.md`, and `build.md` as the shared schema source for
`00_*` discovery documents, `flows/Flow_XX_*.md`, contracts, `verification/commands.json`, and
`BUILD_VERIFICATION.json`, but **not supplied** in the install package. Replace this stub with the
canonical template when available.

Until then, the other docs in this skill define the expected artifact names inline:

- `00_Source_Inventory.md` — authority + provenance classification (AUTHORITATIVE / DIRECTIONAL /
  BEHAVIOR_ONLY / CONTENT_ONLY / SUPERSEDED)
- `00_Surface_Coverage.md` — exact-once primary flow ownership per surface
- `00_Flow_Map.md` — flows grouped by actor goal
- `00_Flow_Contracts.md` — data/events actually passed
- `flows/Flow_XX_<name>.md` + `Sub_Interactions/Flow_XX_sub_interactions.md`
- `verification/commands.json` — `{ bootstrap, migration_replay, auth_smoke }` project-owned commands
- `BUILD_VERIFICATION.json` — build-evidence manifest (definition_file, argv, exit codes, evidence)
- `templates/foundation-pack.md` — this file
