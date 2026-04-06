---
title: "Agent workflow orchestration and memory landscape"
kind: landscape-brief
status: distilled
tags:
  - orchestration
  - memory
  - subagents
  - routing
sources:
  - https://github.com/obra/superpowers
  - https://github.com/xhyqaq/superpowers-plus
  - docs/superpowers/evals/2026-04-06-better-sp-routing-pressure-test.md
distilled_into:
  - docs/engineering-knowledge-garden/decisions/keep-research-archives-separate-from-evergreen-garden-entries.md
  - docs/engineering-knowledge-garden/agent-optimizations/use-one-execution-entry-and-route-internally-by-task-metadata.md
created_at: 2026-04-06
last_reviewed: 2026-04-06
---

# Landscape Brief

## Goal

- Compare how adjacent agent-workflow projects handle orchestration handoff, human-facing execution choices, and project memory so better-sp can borrow the good parts without importing their context bloat.

## Bypass Check

- External research was still warranted because this was not a simple “known best practice” question. We were deciding how to reshape the controller flow, memory boundary, and archive strategy for a fork that explicitly changes upstream workflow behavior.

## Search Strategy

- Query style: compare upstream superpowers, superpowers-plus, and observed harness patterns around memory / execution entry
- Sources prioritized:
  - project readmes and skill structure
  - workflow-oriented summaries already captured in this repo
  - only bounded repo inspection where the README level was not enough
- Why these sources:
  - they reveal workflow shape faster than deep source spelunking
  - they keep the comparison grounded in visible behavior rather than imagined internals

## Candidate Comparison

### Candidate 1: `obra/superpowers`
- Problem solved:
  - reusable workflow skills across multiple coding-agent harnesses
- Workflow / architecture shape:
  - rich skill library, strong process discipline, multi-harness packaging
- Evidence:
  - repository structure and top-level docs
- Strengths:
  - strong skill philosophy
  - clear workflow stages
  - proven cross-harness packaging
- Tradeoffs:
  - original workflow can still feel mode-heavy when the human only wants work to proceed
- Borrow:
  - skill discipline, explicit artifacts, review culture
- Avoid:
  - pushing too many internal orchestration choices onto the human

### Candidate 2: `xhyqaq/superpowers-plus`
- Problem solved:
  - smoother ergonomic layer for day-to-day execution
- Workflow / architecture shape:
  - lighter handoff and stronger “just execute” feeling
- Evidence:
  - repository positioning and workflow framing
- Strengths:
  - lower friction
  - cleaner operator experience
- Tradeoffs:
  - less explicit separation between archive-worthy research and evergreen project knowledge
- Borrow:
  - single-entry execution ergonomics
- Avoid:
  - letting convenience collapse artifact boundaries

### Candidate 3: better-sp local pressure-test observations
- Problem solved:
  - verify whether proposed routing changes actually reduce hard waiting and bad parallel decomposition
- Workflow / architecture shape:
  - one controller, internal routing, single-writer degradation when write scope converges
- Evidence:
  - `docs/superpowers/evals/2026-04-06-better-sp-routing-pressure-test.md`
- Strengths:
  - directly tests the user-reported failure modes
  - gives local evidence for controller behavior
- Tradeoffs:
  - still a local eval, not broad upstream proof
- Borrow:
  - use live pressure cases as regression fixtures
- Avoid:
  - claiming workflow wins without local evidence

## Downstream Guidance

### Borrow

- one execution entry for humans, internal routing for agents
- strong artifact boundaries: spec, plan, archive brief, distilled entry
- bounded lookup instead of loading giant memory blobs

### Avoid

- handing the human a menu of internal execution strategies
- treating raw research notes as evergreen project memory
- equating “parallel requested” with “multiple writers are always safe”

### Preferred Shape

- archive the full research brief
- pass only a compressed guidance brief downstream
- after implementation pressure, distill only the durable conclusions into evergreen garden entries

### Unknowns

- how much of this shape is generic enough to upstream later
- whether broader harness evals will show the same gains outside our current scenarios

### Confidence

- Medium-High

## Distill Candidates

- [x] Decision: keep full research archives separate from evergreen garden entries
- [ ] Pattern: compress research into a guidance brief before planning
- [ ] Pitfall: do not treat archive notes as project memory by default
- [x] Agent optimization: use one execution entry and route internally by task metadata
