# better-sp Workflow Regression Matrix

Date: 2026-04-06

## Goal

Strengthen workflow evaluation without pretending we now have a full multi-harness transcript lab in CI.

This layer combines:
- one existing **live pressure test**
- one new **workflow contract regression test**
- expanded **garden loop CLI tests** for research -> archive -> guidance -> distill handoff

## Coverage Layers

### Layer 1 — Live routing pressure test

Source:
- `docs/superpowers/evals/2026-04-06-better-sp-routing-pressure-test.md`

What it covers:
- controller should not hard-wait after first dispatch
- human should not choose among internal execution modes
- shared write scope should degrade to **1 writer + readers**
- refactor work should route through a dedicated structural workflow

### Layer 2 — File-based workflow contract regression

Source:
- `tests/workflow-evals/workflow-contracts.test.js`

What it guards:
- `writing-plans` still hands off to one execution entry
- `executing-plans` still owns internal routing
- `dispatching-parallel-agents` and `subagent-driven-development` still preserve **single writer + sidecars** and explicitly forbid immediate waiting
- `refactor-mode` still stays distinct from feature mode and still requires a refactor brief

This is not a behavioral simulator. It is a **regression lock on behavior-shaping text** so accidental skill edits do not silently remove the orchestration rules we just added.

### Layer 3 — Garden loop CLI regression

Source:
- `tests/engineering-knowledge-garden/garden-cli.test.js`

What it covers:
- `archive-create` scaffolds a valid landscape brief
- `extract-guidance` turns `## Downstream Guidance` into a reusable guidance artifact
- `distill` still records archive linkage
- `audit` still catches stale archive backlog
- `validate --include-archive` now accepts archive + guidance artifacts together

## Scenario Matrix

| Failure mode / risk | Live pressure test | Contract / CLI regression |
|---|---|---|
| spawn one agent then hard-wait | `2026-04-06-better-sp-routing-pressure-test.md` Scenario A | `workflow-contracts.test.js` requires no-immediate-wait language in routing skills |
| ask human to choose internal execution mode | `2026-04-06-better-sp-routing-pressure-test.md` Scenario B | `workflow-contracts.test.js` locks one-entry handoff + internal routing wording |
| shared write scope loses all parallelism | `2026-04-06-better-sp-routing-pressure-test.md` Scenario A | `workflow-contracts.test.js` locks **single writer + read-only sidecars** wording |
| refactor degrades into more feature patching | `2026-04-06-better-sp-routing-pressure-test.md` Scenario C | `workflow-contracts.test.js` locks `refactor-mode` brief + separation |
| research archive gets stuffed downstream | archive sample + docs review | `garden-cli.test.js` validates extracted guidance artifact instead of full archive handoff |
| archive / guidance / distill loop becomes manual friction again | archive sample + guidance sample | `garden-cli.test.js` locks `extract-guidance` and archive linkage |

## Current Verdict

**PASS (fork-level regression layer)**

The repo now has a more credible fork-maintainer story:
- live evidence for the user-reported orchestration pain points
- cheap CI-visible regression coverage for the workflow contracts
- a semi-automatic archive -> guidance -> distill loop with tested artifacts

## Limits

- This is still **not** a full transcript harness for every supported editor / CLI.
- Contract tests verify the presence of required workflow rules, not real agent obedience under all models.
- Live pressure tests are still the stronger evidence when behavior-shaping skill text changes materially.

## Next useful upgrade

If this fork keeps evolving, the next step is a reusable transcript harness that replays 2-3 canonical workflow prompts and scores the actual controller decisions instead of only checking text contracts.
