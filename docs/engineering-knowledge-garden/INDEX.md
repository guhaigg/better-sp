# Engineering Knowledge Garden

This is the project-local **read/write** engineering knowledge garden.

Use it for:
- evergreen engineering entries you want the agent to **lookup later**
- archived research briefs you want to **retrieve and distill later**

## Artifact Boundary

| Artifact | Purpose | Downstream? |
|---|---|---|
| Archive brief | Full external research / comparison notes | No — only by file path |
| Guidance brief | Compressed borrow / avoid handoff | Yes |
| Garden entry | Small durable reusable knowledge | Yes, bounded lookup only |

## The Loop

1. **Research** with `project-landscape-analysis`
2. **Archive** the full brief under `archive/landscapes/`
3. **Extract guidance** into `guidance/`
4. **Hand off** only the short guidance brief into brainstorming / planning
5. **Do the real work**
6. **Distill** only proven reusable lessons into evergreen entries
7. **Validate / audit / prune** with `gardener-mode`

## Lookup evergreen entries

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs search --tag auth --scope src/auth --type pattern
node skills/engineering-knowledge-garden/scripts/garden.cjs search --text "shared write scope" --type pitfall
```

If `$SUPERPOWERS_GLOBAL_GARDEN` is set, search also returns global **read-only** matches.

## Archive research briefs

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs archive-create --kind landscape-brief --title "Multi-agent routing landscape"
node skills/engineering-knowledge-garden/scripts/garden.cjs search-archive --kind landscape-brief --text "routing"
node skills/engineering-knowledge-garden/scripts/garden.cjs extract-guidance --archive docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-routing.md
```

Archive briefs are for retrieval, review, and later distillation — not for prompt stuffing.

## Guidance handoff artifacts

`extract-guidance` creates a small `guidance-brief` under `guidance/` from the archive's `## Downstream Guidance` section.

Use the guidance file for planning / brainstorming handoff, not the full archive brief.

## Distill archive into evergreen entries

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs distill \
  --archive docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-routing.md \
  --type pattern \
  --title "Degrade shared write scope to one writer plus readers"
```

This creates a draft evergreen entry and records the linkage back to the archive brief.

## Capture from implementation

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs create --type pattern --title "Consolidate auth parsing in shared core"
```

Then fill the entry with real evidence and validate it.

## Validate and audit

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/ --include-archive
node skills/engineering-knowledge-garden/scripts/garden.cjs audit --days 180 --threshold 0.5 --archive-days 30
```

## Write Policy

- write new durable knowledge here, not to `AGENTS.md`
- keep evergreen entries short and triggerable
- archive full research before deciding what deserves promotion
- prefer batched capture near branch finish
- promote only proven cross-project knowledge to a global garden

## Seed Entries

- `docs/engineering-knowledge-garden/agent-optimizations/shared-write-scope-single-writer-readers.md`
- `docs/engineering-knowledge-garden/agent-optimizations/use-one-execution-entry-and-route-internally-by-task-metadata.md`
- `docs/engineering-knowledge-garden/decisions/keep-research-archives-separate-from-evergreen-garden-entries.md`
- `docs/engineering-knowledge-garden/patterns/refactor-brief-before-structural-cleanup.md`
- `docs/engineering-knowledge-garden/pitfalls/brainstorming-question-loop-on-clear-specs.md`

## Live archive sample

- `docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md`
- `docs/engineering-knowledge-garden/guidance/2026-04-06-agent-workflow-landscape-guidance.md`
