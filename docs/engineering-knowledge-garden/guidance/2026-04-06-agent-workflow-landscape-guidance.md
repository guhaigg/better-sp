---
title: "Agent workflow orchestration and memory landscape guidance"
kind: guidance-brief
source_archive: docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md
tags:
  - orchestration
  - memory
  - subagents
  - routing
created_at: 2026-04-06
last_reviewed: 2026-04-06
---

# Guidance Brief

**Research File:** `docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md`

## Borrow

- one execution entry for humans, internal routing for agents
- strong artifact boundaries: spec, plan, archive brief, distilled entry
- bounded lookup instead of loading giant memory blobs

## Avoid

- handing the human a menu of internal execution strategies
- treating raw research notes as evergreen project memory
- equating “parallel requested” with “multiple writers are always safe”

## Preferred Shape

- archive the full research brief
- pass only a compressed guidance brief downstream
- after implementation pressure, distill only the durable conclusions into evergreen garden entries

## Unknowns

- how much of this shape is generic enough to upstream later
- whether broader harness evals will show the same gains outside our current scenarios

## Confidence

- Medium-High
