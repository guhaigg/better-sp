---
title: "Keep research archives separate from evergreen garden entries"
type: decision
status: proven
tags:
  - garden
  - research
  - distillation
  - archive
triggers:
  - external comparison produced a long research brief
  - the team wants later retrieval without loading raw notes into the working prompt
  - the lesson has not yet survived real implementation pressure
scope:
  - docs/engineering-knowledge-garden/archive/
  - skills/project-landscape-analysis/SKILL.md
  - skills/engineering-knowledge-garden/SKILL.md
evidence:
  - "distilled from archive docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md"
  - "implemented in better-sp archive-create/search-archive/distill loop on 2026-04-06"
last_verified: 2026-04-06
supersedes: []
---

## Use when

- research output is too detailed to become evergreen memory immediately
- downstream skills only need borrow / avoid guidance, not the full comparison matrix

## Why

- archive briefs preserve retrieval value without polluting the project-memory layer
- evergreen entries should be reserved for conclusions that proved durable after implementation or review

## Apply

1. save the full brief under `docs/engineering-knowledge-garden/archive/`
2. pass only a compressed guidance brief into brainstorming or planning
3. distill specific conclusions later if they survive real work

## Avoid

- promoting every research note straight into `patterns/` or `decisions/`
- loading the entire archive brief into a downstream implementation prompt

## Verification

- the archive file exists and remains searchable via `search-archive`
- only distilled conclusions become evergreen entries
- the archive file links forward through `distilled_into`

## Related entries

- archive: `docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md`
- `docs/engineering-knowledge-garden/agent-optimizations/use-one-execution-entry-and-route-internally-by-task-metadata.md`
