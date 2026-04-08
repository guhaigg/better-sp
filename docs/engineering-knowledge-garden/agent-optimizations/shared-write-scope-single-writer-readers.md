---
title: Shared write scope should degrade to one writer plus read-only readers
type: agent-optimization
status: proven
tags: [routing, subagents, parallelism, write-scope]
triggers:
  - a task was planned as parallel but real writes converge on the same file family
  - multiple useful sidecars can still run read-only
scope:
  - skills/dispatching-parallel-agents/SKILL.md
  - skills/subagent-driven-development/SKILL.md
  - skills/executing-plans/SKILL.md
evidence:
  - validated by better-sp routing pressure test on 2026-04-06
last_verified: 2026-04-06
supersedes: []
---

## Use when

- parallel planning meets shared write reality
- the controller is at risk of collapsing into idle waiting

## Why

- shared write scope forbids multiple writers
- it does not forbid useful read-only parallelism

## Apply

1. confirm the real write scope
2. keep one writer for the shared files
3. dispatch explorers, verifiers, or bounded reviewers as read-only sidecars
4. avoid calling `wait` until non-blocking controller work is exhausted

## Avoid

- keeping multiple writers on the same file family
- turning shared-write discovery into total parallel shutdown

## Verification

- final routing is one writer plus readers
- the controller does not immediately wait after first dispatch

## Related entries

- `docs/engineering-knowledge-garden/pitfalls/brainstorming-question-loop-on-clear-specs.md`

