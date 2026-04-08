---
name: engineering-knowledge-garden
description: Use when durable project knowledge should be looked up, archived from research, distilled after real work, or pruned without bloating AGENTS.md, chat history, or ad-hoc memory files
---

# Engineering Knowledge Garden

Keep durable engineering knowledge in a searchable garden instead of dumping everything into `AGENTS.md`.

**Core principle:** bounded lookup, archived research, distilled evergreen entries.

## What This Skill Is For

Use it to manage small, reusable entries such as:
- **decision** — why the project chose one path
- **pattern** — a reusable implementation shape
- **pitfall** — a repeatable failure mode or false shortcut
- **verification-recipe** — a reliable way to prove behavior
- **reusable-asset** — helper, adapter, script, or template worth reusing
- **agent-optimization** — proven orchestration guidance

Do **not** use it for:
- raw task logs
- full transcripts
- giant postmortems
- speculative opinions with no evidence

## Storage Model

- **Project-local read/write root:** `docs/engineering-knowledge-garden/`
- **Structured archive:** `docs/engineering-knowledge-garden/archive/landscapes/`
- **Structured guidance handoff:** `docs/engineering-knowledge-garden/guidance/`
- **Optional global read-only root:** `$SUPERPOWERS_GLOBAL_GARDEN`

Normal task work writes only to the project-local garden. Global knowledge should be promoted intentionally.

## The Loop

1. **Lookup** only the narrow entries relevant to planning, execution, refactor, or review
2. **Archive** full external research or comparison notes without polluting downstream prompts
3. **Extract guidance** into a short downstream handoff
4. **Distill** only proven lessons from those archives into evergreen entries
5. **Capture** new durable lessons from implementation work
6. **Validate / audit / prune** on a maintenance cadence

## Modes

### 1. Lookup

Use before planning or executing **non-trivial** work:
- multi-step tasks
- refactors
- risky subsystems
- tasks with known pitfalls
- when the human asks for project memory / project intelligence

Do **not** force lookup for tiny obvious edits.

Run:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs search --tag auth --scope src/auth --type pattern
node skills/engineering-knowledge-garden/scripts/garden.cjs search --text "shared write scope" --type pitfall --limit 5
```

The tool searches the local garden first, then merges optional global read-only results.

### 2. Archive research first

When external comparison produces a full brief, save it as an archive artifact instead of pretending it is already evergreen knowledge.

Run:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs archive-create --kind landscape-brief --title "Multi-agent routing landscape"
node skills/engineering-knowledge-garden/scripts/garden.cjs search-archive --kind landscape-brief --text "routing"
```

Archive briefs are for:
- human review
- later retrieval
- future distillation

They are **not** automatically loaded into downstream prompts.

### 3. Extract downstream guidance

When the archive brief is ready, turn only the `## Downstream Guidance` section into a small handoff artifact:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs extract-guidance \
  --archive docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-routing-landscape.md
```

This creates a `guidance-brief` under `docs/engineering-knowledge-garden/guidance/` and prints any unchecked distill candidates so the research -> guidance -> distill loop stays visible.

### 4. Distill archive into evergreen knowledge

Only distill when a lesson proved durable enough to reuse:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs distill \
  --archive docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-routing-landscape.md \
  --type pattern \
  --title "Degrade shared write scope to one writer plus readers"
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/ --include-archive
```

`distill` creates a draft evergreen entry and records the linkage back to the archive brief.

### 5. Capture from real work

Capture only durable lessons from implementation. Prefer batching near branch finish, PR prep, or task-batch completion.

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs create --type pattern --title "Consolidate auth parsing in shared core"
# edit the created file with real evidence and guidance
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/
```

Use the template at:
- `skills/engineering-knowledge-garden/references/entry-template.md`

### 6. Validate and prune

Prune duplicates, stale entries, or archive backlog **outside** the hot path of feature work when possible.

Run:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/ --include-archive
node skills/engineering-knowledge-garden/scripts/garden.cjs audit --days 180 --threshold 0.5 --archive-days 30
```

Do not stop a normal task just to garden unless:
- the garden is actively misleading the current task
- the archive backlog is hiding reusable knowledge you need right now
- the human explicitly asked for cleanup

## Validation

Every evergreen entry must validate before it counts as trusted knowledge. Archive briefs should also validate when they are part of a research->distill workflow.

Validation checks:
- required frontmatter keys
- allowed `type` / `kind`
- allowed `status`
- list fields
- required body sections

Broken YAML or malformed entries are not “good enough.” Fix them.

## Workflow Integration

### Brainstorming
- optionally lookup prior decisions / patterns / pitfalls
- use results to reduce redundant questions, not to skip real clarification
Do not query the garden for every tiny feature idea.

### Project Landscape Analysis
- archive the full landscape brief under `docs/engineering-knowledge-garden/archive/landscapes/`
- extract and pass only the compressed guidance brief downstream
- distill only the lessons that proved durable after real implementation or review

### Refactor Mode
- lookup patterns, pitfalls, reusable assets, verification recipes
- capture seam or migration lessons after the refactor stabilizes

### Writing Plans
- lookup relevant entries before decomposing high-risk or multi-step work
- if results materially shaped the plan, record them in `Knowledge Inputs`

### Executing Plans
- only consult entries relevant to the active task’s files, subsystem, or risk
- do not repeatedly re-query the same thing during one task unless conditions changed

### Requesting Code Review
- use known pitfalls or verification recipes to bound review scope

### Finishing Work
- batch-capture durable lessons before closing the branch, if any were produced
- if research archives generated real reusable lessons, distill them before the context goes cold

## Red Flags

**Never:**
- stuff the garden with raw logs
- capture a “lesson” with no evidence
- promote every archive note straight into evergreen memory
- load the entire garden into context
- let malformed frontmatter silently accumulate
- block simple tasks on heavy garden rituals

**Always:**
- keep lookup bounded
- archive full research before reuse
- keep distilled entries small and triggerable
- validate entries
- prefer project-local writes
