# Archive

The archive stores **full research artifacts** that are worth keeping but are **not yet evergreen garden knowledge**.

Use the archive for:
- landscape analysis briefs
- bounded research notes that may later yield reusable patterns or pitfalls

Do **not** use the archive for:
- raw chat transcripts
- giant dump files with no future trigger value
- prompt stuffing for downstream implementation

## Current layout

```text
archive/
  landscapes/
```

## Archive -> Distill rule

Archive first when:
- the brief is long
- the work is exploratory
- you are still unsure what is durable

Distill later when:
- the lesson survived real implementation or review
- you can express it as a small triggerable entry
- it is worth future lookup

## Common commands

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs archive-create --kind landscape-brief --title "Multi-agent routing landscape"
node skills/engineering-knowledge-garden/scripts/garden.cjs search-archive --kind landscape-brief --text "routing"
node skills/engineering-knowledge-garden/scripts/garden.cjs distill --archive docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-routing.md --type pattern --title "One writer plus readers"
```

## Live sample

- `docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md`
