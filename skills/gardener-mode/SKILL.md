---
name: gardener-mode
description: Use when the engineering knowledge garden needs validation, duplicate detection, stale-entry review, archive-backlog review, or scheduled maintenance without blocking normal feature work
---

# Gardener Mode

Maintain the engineering knowledge garden as a **separate maintenance workflow**, not as background clutter inside normal coding tasks.

**Core principle:** prune, distill, and promote on a maintenance cadence, not in the middle of every feature.

## When to Use

Use when:
- the knowledge garden has grown enough to need cleanup
- you want to prepare a weekly or nightly maintenance pass
- duplicate entries, stale entries, or promotion candidates are accumulating
- archive briefs are piling up with no distillation
- you want a reviewable gardening diff instead of silent mutation

Don't use when:
- you are in the hot path of a tiny feature or bugfix
- there is no evidence the garden is drifting yet

## The Workflow

### 1. Validate first

Run:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden/ --include-archive
```

If validation fails, fix structure before pruning content.

### 2. Audit

Run:

```bash
node skills/engineering-knowledge-garden/scripts/garden.cjs audit --days 180 --threshold 0.5 --archive-days 30
```

This surfaces:
- stale evergreen entries
- duplicate candidates
- archive briefs that still have no distilled lessons

### 3. Distill or prune with reviewable diffs

Good gardening changes:
- merge near-duplicate entries
- archive stale or superseded entries
- distill high-value archive briefs into 1-3 triggerable evergreen entries
- tighten weak titles, triggers, or verification sections
- promote recurring cross-project knowledge into a reusable skill or reference

Never do blind bulk rewrites.

### 4. Keep gardening out of the hot path

If running on a schedule or before a release:
- produce a reviewable diff
- or open a PR
- or hand the changes to a human for approval

The gardener should reduce entropy, not create invisible churn.

## Integration

- **superpowers:engineering-knowledge-garden** - source of entries, archives, and tooling
- **superpowers:project-landscape-analysis** - upstream producer of archive briefs
- **superpowers:finishing-a-development-branch** - batch-capture durable lessons before maintenance consolidates them
