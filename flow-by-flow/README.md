# flow-by-flow (skill)

Portable "flow by flow" software-development methodology skill, installed locally for this project.
Version **2.0.1** (author: Benjamin Macaulay at Chasebig Limited; MIT; markdown-only).

## Entry point

Start from `SKILL.md`. It is the skill manifest (frontmatter + identity, start-here, flow contract,
orchestration rules, stop conditions, and gates).

## Structure

```
flow-by-flow/
  SKILL.md                 Skill manifest + entry point
  references/
    orchestration.md       Compact core for every task (modes, depth, risk, affected-flow discovery)
    foundation.md          Foundation workflow (new app / missing foundation)
    audit.md               Audit and extension mode (existing app / bug / refactor / audit)
    build.md               Build workflow (per-flow implementation + proof)
    delivery.md            Standard and deeper delivery (Standard/Deep/Full Project Audit)
    review.md              [PLACEHOLDER] independent review checklist — not supplied in package
    verification.md        [PLACEHOLDER] gate definitions (1-5) — not supplied in package
  templates/
    foundation-pack.md     [PLACEHOLDER] shared artifact/contract schemas — not supplied in package
```

## How to use

1. Read `SKILL.md` → it directs you to `references/orchestration.md` for every task.
2. Pick the route by need (new app → `foundation.md`; existing/bug/audit → `audit.md`;
   implement/resume → `build.md`; Standard/Deep audit → also `delivery.md`; review → `review.md`;
   proof gates → `verification.md`).
3. Follow the per-flow loop, failing-first tests, security/accessibility checks, and runtime proof.
4. Report automated / static / runtime proof and unverified claims separately.

## Conflict hierarchy (from orchestration.md)

```
current user instruction > safety and authority > repository constitution > approved decisions
> proven runtime and code > current design assets > stale prose > builder judgment
```

## Risk floors (from orchestration.md)

- R0 local copy / visual work -> Quick
- R1 one-flow state or function change -> Standard
- R2 cross-flow contracts, persistence, integrations, migrations, major UI/UX -> Deep
- R3 auth, payments, permissions, sensitive data, destructive, production, releases -> Deep + independent review

## Installation status

Supplied and installed (full content):
- `SKILL.md` (v2.0.1 manifest)
- `references/orchestration.md` (compact core)
- `references/foundation.md` (Foundation workflow)
- `references/audit.md` (Audit and extension mode)
- `references/build.md` (Build workflow)
- `references/delivery.md` (Standard and deeper delivery)
- `references/review.md` (Review gate) — installed this round
- `references/verification.md` (Verification gates 1-5) — installed this round

All references supplied and installed:
- `templates/foundation-pack.md` — the shared artifact/contract schemas referenced by `foundation.md`,
  `audit.md`, `build.md`, and Gate 1/2/3. Installed with full content. Note: this is a skill-internal
  template reference; per its own instruction it must NOT be copied into the product.

Gate 5 (installation check) status: **PASS**.
- Sibling `flow-prototype` skill (v2.0.1) is now installed at `../flow-prototype/` with its `SKILL.md`
  and `references/flow-ui.md`. Both skills declare version `2.0.1`, each has every reference its
  `SKILL.md` names, and `flow-by-flow` can reach `flow-prototype` for the major UI/UX approval surface.
