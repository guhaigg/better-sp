# Engineering Knowledge Garden

This is the project-local **read/write** engineering knowledge garden.

Use it for small, durable entries:

- decisions
- patterns
- pitfalls
- verification recipes
- reusable assets
- agent optimizations

## Search

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs search --tag auth --scope src/auth --type pattern
node skills/engineering-knowledge-garden/scripts/garden.cjs search --text "shared write scope" --type pitfall
```

If `$SUPERPOWERS_GLOBAL_GARDEN` is set, search also returns global **read-only** matches.

## Create

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs create --type pattern --title "Consolidate auth parsing in shared core"
```

Then fill the entry with real evidence and validate it.

## Validate

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/
```

## Write Policy

- write new entries here, not to `AGENTS.md`
- keep entries short and triggerable
- prefer batched capture near branch finish
- promote only proven cross-project knowledge to a global garden

## Seed Entries

- `docs/engineering-knowledge-garden/agent-optimizations/shared-write-scope-single-writer-readers.md`
- `docs/engineering-knowledge-garden/patterns/refactor-brief-before-structural-cleanup.md`
- `docs/engineering-knowledge-garden/pitfalls/brainstorming-question-loop-on-clear-specs.md`
