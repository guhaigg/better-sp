# Engineering Knowledge Garden Design

Date: 2026-04-06

## Goal

Add a reusable better-sp component that lets agents **capture, consult, and prune durable engineering knowledge** without stuffing everything into `AGENTS.md`, `CLAUDE.md`, or ad-hoc chat memory.

This should become part of the normal better-sp workflow, not an afterthought.

## Problem

Current agent workflows repeatedly rediscover the same things:

- project-specific constraints
- proven implementation patterns
- common pitfalls
- verification recipes
- refactor lessons
- agent-optimization heuristics

When this knowledge is stored badly, it creates new problems:

- `AGENTS.md` turns into a context landfill
- long “memory” files become hard to search and expensive to load
- raw notes get preserved without distillation
- good patterns are not reused in later tasks

## Design Principles

1. **Progressive disclosure, not context flooding**
2. **Distilled knowledge, not transcript dumps**
3. **Evidence-backed capture, not vibes**
4. **Global read-only + project-local read/write**
5. **Lookup before capture spam**
6. **Asynchronous capture over foreground interruption**
7. **Prune and promote, not endless accumulation**
8. **Schema-validated entries, not fragile freehand YAML**

## Proposed Name

`engineering-knowledge-garden`

Reason:
- broader and clearer than “memory”
- explicitly engineering-focused
- works across projects
- matches the idea of continuous cultivation rather than append-only notes

## What It Stores

The garden stores small, durable entries in a few explicit classes:

1. **decision**  
   Why the project chose one approach and rejected another.

2. **pattern**  
   Reusable implementation or design pattern that fits this project.

3. **pitfall**  
   Repeated failure mode, sharp edge, or false shortcut.

4. **verification-recipe**  
   Reliable way to prove something works or is broken.

5. **reusable-asset**  
   Shared helper, template, adapter, script, or reference entry point worth reusing.

6. **agent-optimization**  
   Proven orchestration guidance: when to split, when not to, what to bound, what to avoid.

## What It Must Not Store

- raw task logs
- full transcripts
- giant postmortems with no future trigger value
- speculative style opinions with no evidence
- everything the project already states cleanly elsewhere

## Storage Model

Project-local write root:

```text
docs/engineering-knowledge-garden/
  INDEX.md
  decisions/
  patterns/
  pitfalls/
  verification-recipes/
  reusable-assets/
  agent-optimizations/
  archive/
```

Optional global read-only root:

```text
$SUPERPOWERS_GLOBAL_GARDEN/
  INDEX.md
  patterns/
  pitfalls/
  reusable-assets/
  agent-optimizations/
```

`AGENTS.md` should contain, at most, a short pointer:

> Project memory lives in `docs/engineering-knowledge-garden/INDEX.md`. Load only entries relevant to the current task.

### Read / Write Policy

- **Project-local garden** → read + write
- **Global garden** → read-only during normal task execution
- New cross-project knowledge should be promoted intentionally, not auto-written into the global root

## Entry Format

Every entry should be a small markdown file with frontmatter:

```yaml
---
title: Consolidate auth parsing in shared core
type: pattern
status: proven
tags: [auth, refactor, shared-core]
triggers:
  - duplicated parsing logic appears in request/session paths
  - new auth rule would otherwise be patched in more than one file
scope:
  - src/auth/request.ts
  - src/auth/session.ts
evidence:
  - verified in task 2026-04-06-auth-refactor
last_verified: 2026-04-06
supersedes: []
---
```

Body sections:

1. **Use when**
2. **Why**
3. **Apply**
4. **Avoid**
5. **Verification**
6. **Related entries**

## Lookup Layer

Lookup cannot rely on “read the index and hope.” Phase 1 needs an actual tool.

### Phase 1 Tooling

Provide a lightweight local search tool:

```text
garden search --tag auth --scope src/auth --type pattern
garden search --text "shared write scope" --type pitfall
garden validate docs/engineering-knowledge-garden/
```

Minimum search filters:

- `type`
- `tag`
- `scope`
- free-text query
- result limit

The search tool should:

- search project-local root first
- optionally merge global read-only results
- return a small ranked result set, not raw file dumps

### Future Layer

If the garden grows large, add lightweight semantic search / embeddings. Do not block phase 1 on this.

## Cost Control

The garden must not turn every tiny edit into another heavy workflow stage.

### Lookup Budget

Do lookup by default only when one of these is true:

- task is multi-step or high-risk
- task touches a subsystem with known pitfalls
- task is a refactor
- task planning would benefit from prior patterns or verification recipes
- the user explicitly asks to consult memory / project intelligence

Skip routine lookup for tiny obvious edits unless the task is in a risky subsystem.

### Capture Budget

Capture should be **batched and asynchronous by default**:

- foreground work should finish first
- summarize durable lessons near branch finish / PR prep / merge boundary
- only do immediate capture when the knowledge is likely to be lost or needed by the next task right away

## Lifecycle

### Capture

Capture only when knowledge is:

- reusable
- specific enough to trigger later
- backed by actual work, validation, or review
- worth the token and maintenance cost

### Lookup

Before planning or implementing, load only entries relevant to:

- current subsystem
- active write scope
- known pitfall class
- chosen execution mode

### Prune

Prune should not rely on heroic human discipline. Prefer a separate gardener workflow.

On a regular basis:

- merge duplicates
- archive stale entries
- promote recurring high-value entries into skills or references

### Gardener Mode

Phase 2 should introduce a scheduled or explicitly-invoked gardener workflow that:

- scans for duplicates or near-duplicates
- flags stale entries
- proposes merges / archival changes
- prepares a reviewable diff or PR instead of silently mutating history

Foreground feature work should not be blocked on pruning.

## Validation

Frontmatter is useful only if it is reliable.

Phase 1 must include schema validation for:

- required keys
- allowed `type`
- allowed `status`
- list-shaped fields (`tags`, `triggers`, `scope`, `evidence`, `supersedes`)
- required body sections

Invalid entries should fail validation and be fixed before they are treated as searchable knowledge.

## Workflow Integration

### 1. Brainstorming

Before asking repetitive design questions, optionally consult existing:

- decisions
- patterns
- pitfalls

Use the garden to reduce redundant questioning, not to skip genuine clarification.
Do not query the garden for every tiny feature idea.

### 2. Refactor Mode

Consult:

- patterns
- pitfalls
- reusable-assets
- verification-recipes

Capture:

- seam choices that proved valuable
- refactor traps that caused repeated rework

### 3. Writing Plans

Lookup happens before task decomposition. Relevant entries can influence:

- write-scope boundaries
- dependency slicing
- verification steps
- review level
- routing choice

The plan may optionally include a short **Knowledge Inputs** section listing consulted entries.
For low-risk trivial work, skip this step.

### 4. Executing Plans

Before starting a task, consult only the narrow subset relevant to that task’s:

- files
- subsystem
- risk type
- execution recommendation

After a task finishes, capture only durable lessons.
Prefer deferring capture until the end of the task batch unless a fresh lesson is immediately needed.

### 5. Requesting Code Review

Use the garden to bound reviews with:

- known pitfalls
- subsystem-specific acceptance checks
- verification recipes

### 6. Finishing Work

Before closing a branch, ask:

- did we learn a durable pattern?
- did we hit a repeatable pitfall?
- did we discover a better verification recipe?

If yes, capture it briefly.

## Skill Shape

The initial skill should support three modes:

1. **lookup**  
   Find relevant entries for the current task.

2. **capture**  
   Distill one new entry from actual work.

3. **prune**  
   Merge, archive, or promote entries.

This should be a workflow skill, not a giant reference dump.

Recommended defaults:

- `lookup` → foreground, bounded, selective
- `capture` → usually deferred / batched
- `prune` → usually background or explicit maintenance mode

## Why This Is Better Than Stuffing `AGENTS.md`

- `AGENTS.md` stays small and cheap
- knowledge is categorized and queryable
- only relevant entries get loaded
- project knowledge and reusable patterns stop competing for the same tiny context budget
- the system becomes easier to maintain over time

## Minimal First Implementation

Phase 1:

1. add `engineering-knowledge-garden` skill
2. create directory structure + `INDEX.md`
3. add local search + validation tooling
4. define entry schema
5. wire the skill into planning / execution / refactor workflows through references, not hard-coded giant prompts
6. support optional global read-only lookup via environment/config

Phase 2:

1. add promotion/pruning conventions
2. add bounded lookup guidance by subsystem / tags / write scope
3. add examples from real tasks
4. add gardener automation / scheduled pruning
5. add semantic retrieval when the garden meaningfully outgrows lexical search

## Open Questions

1. Should `writing-plans` always emit a `Knowledge Inputs` section, or only when entries materially changed the plan?
2. Which entries should be promoted into first-class skills versus staying project-local?
3. What is the right threshold for enabling semantic retrieval over simple lexical search?

## Recommendation

Implement phase 1 now with **project-local read/write plus optional global read-only lookup**.

That gives better-sp:

- a clean answer to AGENTS pollution
- a reusable project intelligence layer
- a place to accumulate durable engineering knowledge
- a natural bridge between spec, plan, execution, review, and refactor workflows
- bounded lookup and validation instead of blind markdown accumulation
