# better-sp Routing Pressure Test

Date: 2026-04-06

## Goal

Pressure-test the current better-sp changes against the user-reported failure modes:

1. controller hard-waits after dispatch
2. plan handoff still asks the human to choose internal execution mode
3. shared write scope collapses parallelism into idle waiting instead of **1 writer + readers**

## Method

This eval used **live Codex subagents** against the current skill docs in this worktree:

- `skills/writing-plans/SKILL.md`
- `skills/executing-plans/SKILL.md`
- `skills/dispatching-parallel-agents/SKILL.md`
- `skills/subagent-driven-development/SKILL.md`
- `skills/refactor-mode/SKILL.md`

Three read-only scenario evaluators were spawned and asked to reason from the skill text only. This is an orchestration pressure test, not a code-generation benchmark.

## Scenario A — Shared write scope discovered after a `parallel` recommendation

### Input

Planned task was initially marked `Execution Recommendation: parallel`, but runtime inspection showed all real writes converge on:

- `src/checkout/summary.ts`
- `src/checkout/summary.test.ts`

Available read-only sidecars:

1. trace all `buildSummary` call sites
2. run unaffected tax-calculation tests
3. bounded diff review against an acceptance checklist

### Expected

- controller re-routes away from multi-writer parallelism
- no human-facing internal mode choice
- no immediate `wait` after first dispatch
- final shape becomes **1 writer + readers**

### Observed

**PASS**

- routing degrades from `parallel` to **single writer + read-only sidecars**
- mobile / desktop are not split into separate writers
- controller sequence stays busy:
  1. read task metadata
  2. confirm real write scope
  3. re-route to single-writer path
  4. dispatch explorer
  5. dispatch verifier
  6. dispatch writer
- bounded review is launched after diff exists
- no immediate `wait`

### Verdict

Shared write scope now degrades to:

- **Writer × 1**
  - `src/checkout/summary.ts`
  - `src/checkout/summary.test.ts`
- **Readers × 3**
  - explorer
  - verifier
  - reviewer

## Scenario B — Mixed plan handoff after planning

### Input

Plan header:

- Parallel-safe tasks: Task 2, Task 5
- Shared write scopes / serial tasks: Task 3
- Recommended default mode: `mixed`

### Expected

- `writing-plans` hands off to one execution entry
- no “Routed Subagents / Inline Execution / Subagent-Driven” menu
- `executing-plans` internally routes by task metadata

### Observed

**PASS**

- `writing-plans` now hands off to `superpowers:executing-plans`
- human-facing choice is reduced to: review the plan or proceed
- `executing-plans` maps:
  - `direct` → local execution
  - `sidecar` → read-only helper work
  - `parallel` → parallel-safe routing
  - `high-assurance-serial` → single-writer routing

### Verdict

The internal routing choice is no longer pushed onto the human. This removes one major source of controller idle time and decision churn.

## Scenario C — Refactor pressure instead of more feature patching

### Input

Existing auth code still works, but `src/auth/request.ts` and `src/auth/session.ts` both contain duplicated parsing logic. The user wants:

- behavior freeze
- structural consolidation
- improved reuse

### Expected

- a dedicated refactor workflow instead of treating the work as another feature patch
- routing eventually converges on single-writer execution if shared auth core becomes the real write scope

### Observed

**PASS**

- the correct entry point is `refactor-mode`
- output artifact is a **Refactor Brief**
- critical fields preserved:
  - `Frozen Behavior`
  - `Target Shape`
  - `Seam Map`
  - `Write Scope`
  - `Migration Order`
  - `Temporary Scaffolding`
  - `Verification`
- handoff sequence is:
  - `refactor-mode` → `writing-plans` → `executing-plans`
- if writes converge on shared auth core, routing becomes `high-assurance-serial` with read-only sidecars

### Verdict

The workflow now distinguishes:

- **feature work**
- **spec work**
- **refactor work**

This directly addresses the “TDD patch pile keeps growing” failure mode.

## Summary

| Failure mode | Result |
|---|---|
| spawn one agent then hard-wait | **PASS** — controller is instructed to finish non-blocking work first |
| ask human to choose internal execution mode | **PASS** — single execution entry via `executing-plans` |
| shared write scope kills parallelism | **PASS** — degrade to **1 writer + readers** |
| refactor gets treated as feature patching | **PASS** — `refactor-mode` creates a separate structural workflow |

## Limits

- This eval validates **workflow behavior implied by the skill text** through live agent reasoning.
- It does **not** replace full harness-based end-to-end transcript testing on every supported platform.
- Follow-up work should preserve these scenarios as regression fixtures when broader eval tooling is added.
