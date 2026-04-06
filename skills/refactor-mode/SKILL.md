---
name: refactor-mode
description: Use when working code has accumulated patch layers, duplication, or tangled responsibilities and you need to improve reuse or structure without expanding behavior
---

# Refactor Mode

Refactoring is not “feature work but cleaner.” It is a separate mode for turning a patch pile into a stable, reusable shape **without casually changing behavior**.

**Core principle:** freeze behavior first, then change structure on purpose.

## When to Use

Use when:
- TDD or iterative feature work has left duplicated logic, patch-on-patch branches, or “just one more condition” growth
- A file or module still works, but reuse is poor and future work will keep getting harder
- You need to extract seams, consolidate call paths, or normalize interfaces before adding more behavior
- A human explicitly asks for cleanup, consolidation, deduplication, extraction, or architectural tightening

Don't use when:
- The real need is a new feature spec — use `superpowers:brainstorming`
- Current behavior is still changing rapidly and you do not yet know what must stay stable
- The change is tiny enough for normal TDD plus a quick cleanup

## What Refactor Mode Produces

Before writing implementation code, produce a short **refactor brief**:

```markdown
# Refactor Brief

**Goal:** what structural problem is being fixed
**Frozen Behavior:** what must not change
**Target Shape:** new abstraction / ownership boundary / module layout
**Seam Map:** where to cut, extract, adapt, or redirect callers
**Write Scope:** exact files likely to change
**Migration Order:** safe sequence of structural moves
**Temporary Scaffolding:** adapters, shims, compatibility paths, and explicit removal trigger
**Verification:** characterization tests, targeted tests, smoke checks
**Out of Scope:** behavior, APIs, or cleanup not being touched
```

This is not a speculative architecture essay. Keep it concrete enough that `superpowers:writing-plans` can turn it into an orchestration plan.

## The Workflow

### 1. Freeze Behavior

Before structural edits:
- do one bounded lookup in `superpowers:engineering-knowledge-garden` for relevant patterns, pitfalls, reusable assets, or verification recipes
- identify the behavior that must survive
- write or strengthen characterization tests around current behavior
- name any acceptable intentional behavior changes explicitly

If you cannot say what must stay the same, you are not refactoring yet.

### 2. Pick the Target Shape

Choose the smallest structural improvement that solves the pressure:
- extract shared logic into one owned module
- collapse duplicated branches behind one function
- separate orchestration from business logic
- move file responsibilities toward single-purpose boundaries

Do **not** keep stacking temporary conditionals if the real answer is consolidation.

### 3. Slice the Refactor

Prefer small, behavior-preserving slices:
1. add or tighten characterization tests
2. create seam or adapter
3. move one responsibility
4. migrate one caller group
5. remove dead branch / shim / duplicate path

Each slice should still be executable through `superpowers:writing-plans` and `superpowers:executing-plans`.

## Routing Guidance

- Shared core module or overlapping write scope → prefer `high-assurance-serial`
- One structural writer plus bounded analysis / verification / review work → keep **single writer + read-only sidecars**
- Clearly disjoint migrations (for example docs, rename-only leaf modules, isolated tests) → safe to route in parallel

Refactor mode should reduce waiting, not create controller idleness.

## Refactor-Specific Rules

**Always:**
- separate structural cleanup from opportunistic feature creep
- schedule removal of any temporary adapter or compatibility path
- end with fewer branches, fewer ownership ambiguities, and fewer places to change next time
- batch-capture durable seam or migration lessons after the refactor stabilizes

**Never:**
- justify more patching because “tests are green”
- introduce a temporary wrapper without naming when it gets removed
- mix broad behavior changes into a structure-only task without updating the brief and plan
- split shared-write refactors across multiple writers

## Integration

- **superpowers:brainstorming** - use first when the desired end-state is still unclear
- **superpowers:writing-plans** - turn the refactor brief into a routed implementation plan
- **superpowers:executing-plans** - execute the plan through one controller
- **superpowers:subagent-driven-development** - use for shared-write or high-risk refactor slices
- **superpowers:test-driven-development** - characterization tests first, then structural change
- **superpowers:engineering-knowledge-garden** - lookup relevant refactor knowledge and capture durable lessons later
