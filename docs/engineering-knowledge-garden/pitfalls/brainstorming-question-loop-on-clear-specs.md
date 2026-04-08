---
title: Do not force a brainstorming question loop when the spec is already clear
type: pitfall
status: proven
tags: [brainstorming, spec, workflow]
triggers:
  - the user already provided purpose, constraints, and success criteria
  - more questions would not materially change scope or architecture
scope:
  - skills/brainstorming/SKILL.md
  - skills/using-superpowers/SKILL.md
evidence:
  - user feedback during better-sp workflow review on 2026-04-06
last_verified: 2026-04-06
supersedes: []
---

## Use when

- deciding whether to keep asking questions during spec work

## Why

- dead questioning wastes tokens and creates perceived workflow drag
- once ambiguity is low, a draft spec is more useful than another clarification round

## Apply

1. check whether the missing answer would materially affect architecture, scope, verification, or UX
2. if not, move to a draft spec
3. ask follow-up questions only on real decision points

## Avoid

- treating “more questions” as proof of rigor
- restarting broad clarification after the spec is already sharp

## Verification

- the resulting spec contains fewer low-value clarification turns
- the workflow still asks targeted questions when ambiguity is real

## Related entries

- `docs/engineering-knowledge-garden/patterns/refactor-brief-before-structural-cleanup.md`

