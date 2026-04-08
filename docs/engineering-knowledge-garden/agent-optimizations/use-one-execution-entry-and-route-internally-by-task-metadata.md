---
title: "Use one execution entry and route internally by task metadata"
type: agent-optimization
status: proven
tags:
  - routing
  - controller
  - execution
  - plans
triggers:
  - the workflow is about to ask the human to choose among internal execution strategies
  - plan metadata already describes direct, sidecar, parallel, or high-assurance execution
  - controller idle time is increasing because routing is being deferred to the human
scope:
  - skills/writing-plans/SKILL.md
  - skills/executing-plans/SKILL.md
  - skills/dispatching-parallel-agents/SKILL.md
  - skills/subagent-driven-development/SKILL.md
evidence:
  - "distilled from archive docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md"
  - "validated by docs/superpowers/evals/2026-04-06-better-sp-routing-pressure-test.md"
last_verified: 2026-04-06
supersedes: []
---

## Use when

- a plan already contains execution metadata and the remaining question is only internal routing
- the controller needs to keep moving without surfacing that routing choice to the human

## Why

- humans care about results, not internal scheduler menus
- one execution entry keeps routing decisions close to write scope, dependencies, and verification rules

## Apply

1. treat `executing-plans` as the single human-facing execution handoff
2. read task metadata and route internally to direct, sidecar, parallel, or high-assurance paths
3. re-route if runtime write scope contradicts the original recommendation

## Avoid

- asking the human to choose between internal execution modes when not blocked
- exposing routing churn that the controller can decide from the plan

## Verification

- the user-facing handoff points to one execution entry
- controller behavior preserves routing by `Execution Recommendation`
- shared write scope still degrades safely to one writer plus readers

## Related entries

- archive: `docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md`
- `docs/engineering-knowledge-garden/agent-optimizations/shared-write-scope-single-writer-readers.md`
- `docs/engineering-knowledge-garden/decisions/keep-research-archives-separate-from-evergreen-garden-entries.md`
