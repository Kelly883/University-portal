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

- Supplied and installed: `SKILL.md`, `orchestration.md`, `foundation.md`, `audit.md`, `build.md`, `delivery.md`.
- Referenced but NOT supplied (stubbed): `review.md`, `verification.md`, `templates/foundation-pack.md`.
  Replace stubs with canonical versions when available. Until then, Gate 5 (installation check) is `UNVERIFIED`
  because the bundle is incomplete.
