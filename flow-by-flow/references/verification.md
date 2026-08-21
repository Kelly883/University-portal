# verification.md

PLACEHOLDER — referenced by `build.md`, `foundation.md`, and `audit.md` but **not supplied**
in the install package. Replace this stub with the canonical gate document when available.

Expected gates referenced by the other docs:

- **Gate 1 (Foundation structure)** — structural pass for the chosen paradigm (from `foundation.md` Phase 8).
- **Gate 2 (Foundation execution)** — runs `bootstrap` twice (idempotency), then migration replay and
  `auth_smoke` once. `auth_smoke` writes `$FLOW_BY_FLOW_REPORT_DIR/authorization.json` proving
  `unauthenticated_denied`, `wrong_role_denied`, and `cross_object_denied`. Hard-coded reports are not proof.
- **Gate 3 (Build evidence)** — captures `evidence/verification/command-transcript.json` (argv, definition
  files, exit codes, stdout, stderr) and validates `BUILD_VERIFICATION.json` from `templates/foundation-pack.md`.
- **Gate 4** — rebuilds `BUILD_STATE.json` from repository truth (used in `build.md` Migration recovery).
