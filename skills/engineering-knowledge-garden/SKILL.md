---
name: engineering-knowledge-garden
description: Use when durable project knowledge should be looked up, captured after real work, or pruned without bloating AGENTS.md, chat history, or ad-hoc memory files
---

# Engineering Knowledge Garden

Keep durable engineering knowledge in a searchable garden instead of dumping everything into `AGENTS.md`.

**Core principle:** selective lookup, batched capture, validated entries.

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
- **Optional global read-only root:** `$SUPERPOWERS_GLOBAL_GARDEN`

Normal task work writes only to the project-local garden. Global knowledge should be promoted intentionally.

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

### 2. Capture

Capture only durable lessons from real work. Prefer batching near branch finish, PR prep, or task-batch completion.

Default flow:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs create --type pattern --title "Consolidate auth parsing in shared core"
# edit the created file with real evidence and guidance
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/
```

Use the template at:
- `skills/engineering-knowledge-garden/references/entry-template.md`

### 3. Prune

Prune duplicates, stale entries, or promotion candidates **outside** the hot path of feature work when possible.

Do not stop a normal task just to garden unless:
- the garden is actively misleading the current task
- the human explicitly asked for cleanup

## Validation

Every entry must validate before it counts as trusted knowledge.

Run:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/
```

Validation checks:
- required frontmatter keys
- allowed `type`
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
- archive the full landscape brief under `docs/engineering-knowledge-garden/archive/`
- only promote distilled lessons later if they proved durable

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

## Red Flags

**Never:**
- stuff the garden with raw logs
- capture a “lesson” with no evidence
- load the entire garden into context
- let malformed frontmatter silently accumulate
- block simple tasks on heavy garden rituals

**Always:**
- keep lookup bounded
- keep capture distilled
- validate entries
- prefer project-local writes
