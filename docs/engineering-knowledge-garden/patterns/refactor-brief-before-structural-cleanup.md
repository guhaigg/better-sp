---
title: Write a refactor brief before structural cleanup
type: pattern
status: proven
tags: [refactor, planning, structure]
triggers:
  - behavior is mostly frozen but patch layers keep growing
  - the team wants consolidation or reuse rather than new behavior
scope:
  - skills/refactor-mode/SKILL.md
  - skills/writing-plans/SKILL.md
evidence:
  - verified in better-sp refactor-mode rollout on 2026-04-06
last_verified: 2026-04-06
supersedes: []
---

## Use when

- code still works, but duplication or patch accumulation is increasing future change cost
- the right next move is structural cleanup, not more feature conditions

## Why

- it separates behavior freeze from structure change
- it gives planning and execution a stable artifact instead of vague “clean this up” intent

## Apply

1. define the frozen behavior
2. define the target shape and seam map
3. name the migration order and temporary scaffolding
4. hand the brief to planning, not directly to coding

## Avoid

- treating refactor work as another feature patch
- starting shared-write cleanup without an explicit migration order

## Verification

- characterization tests exist or are strengthened first
- the resulting plan preserves frozen behavior, seam map, and migration order

## Related entries

- `docs/engineering-knowledge-garden/agent-optimizations/shared-write-scope-single-writer-readers.md`

