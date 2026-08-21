# flow-by-flow

Portable "flow by flow" methodology skill for this project. Install target for the
five workflow documents supplied by the user. Use it to drive audit, foundation,
build, and delivery work with proof-first, per-flow verification.

## Structure

```
flow-by-flow/
  daily.md               Daily orchestration (compact core, every coding task)
  references/
    audit.md             Audit and extension mode
    foundation.md        Foundation workflow
    build.md             Build workflow (per-flow implementation + proof)
    delivery.md          Standard and deeper delivery
    verification.md      [PLACEHOLDER] referenced, not supplied in install package
    review.md            [PLACEHOLDER] referenced, not supplied in install package
    orchestration.md     [PLACEHOLDER] referenced, not supplied in install package
  templates/
    foundation-pack.md   [PLACEHOLDER] referenced, not supplied in install package
```

## How to use

- Start any coding task from `daily.md` to choose mode and depth.
- For a new or existing product, follow `foundation.md` then `build.md`.
- For changes to an existing product, follow `audit.md` (reverse-map, prove, fix, re-prove).
- For Standard/Deep/Full audits, follow `delivery.md`.
- Gate references (`verification.md`, `review.md`, `orchestration.md`, `templates/foundation-pack.md`)
  are referenced by the installed docs but were NOT included in the install package. They are
  stubbed below; replace them with the canonical versions when available.

## Conflict hierarchy (from daily.md)

```
current user instruction > safety and authority > repository constitution > approved decisions
> proven runtime and code > current design assets > stale prose > builder judgment
```

## Risk floors (from daily.md)

- R0 local copy / visual work -> Quick
- R1 one-flow state or function change -> Standard
- R2 cross-flow contracts, persistence, integrations, migrations, major UI/UX -> Deep
- R3 auth, payments, permissions, sensitive data, destructive, production, releases -> Deep + independent review
