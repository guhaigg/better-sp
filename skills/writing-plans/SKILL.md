---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write implementation plans that are executable by an agent with minimal guesswork. This skill produces an **orchestration artifact**, not a review artifact. A good plan does two things:
1. explains **what** to build and verify
2. makes the execution routing obvious: direct, sidecar, parallel, or high-assurance serial

Assume the implementer is skilled but lacks context, pattern judgment, and write-scope awareness. Spell out boundaries.

**Artifact boundary:** the spec is for human review; the plan is for agent execution and routing.
If the source document came from `superpowers:refactor-mode`, preserve the behavior freeze, seam map, migration order, and temporary-scaffolding removal steps in the plan.
If relevant project knowledge exists, do one bounded lookup via `superpowers:engineering-knowledge-garden` and record only the entries that materially affected decomposition.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** This should be run in a dedicated worktree and may be sourced from an approved spec, a refactor brief, or clear user requirements.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- (User preferences for plan location override this default)

## Scope Check

If the spec covers multiple independent subsystems, it should have been split during brainstorming. If it wasn't:
- propose separate plans per subsystem, or
- at minimum separate tasks by independent write scope and dependency chain

Each plan should produce working, testable software on its own.

## File Structure and Routing

Before defining tasks, map:
- which files will be created or modified
- what each file is responsible for
- which files change together
- which tasks can run in parallel safely
- which tasks share write scope and must stay single-writer

Lock decomposition here. This is where execution routing quality comes from.

### Routing Rules

Every task must include enough metadata for later routing:
- **Depends on** — predecessor tasks or `none`
- **Write Scope** — exact files / modules this task may edit
- **Potential Conflicts** — overlapping files, shared contracts, migration risks
- **Verify** — exact commands / checks
- **Execution Recommendation** — `direct` | `sidecar` | `parallel` | `high-assurance-serial`
- **Review Level** — `L0` | `L1` | `L2`

Use them consistently:
- `parallel`: task can be given its own writer in parallel with other tasks
- `high-assurance-serial`: shared write scope, high-risk path, or strong dependency chain
- `sidecar`: read-only investigation / verification / review work that can run alongside a writer
- `direct`: simple local execution, delegation overhead not worth it

## Bite-Sized Task Granularity

Each task should be independently understandable, but the steps inside it should still be small.

**Each step is one action (2-5 minutes):**
- "Write the failing test"
- "Run it to verify it fails"
- "Implement the minimum code"
- "Run targeted verification"
- "Prepare handoff / commit if requested"

Do not explode one task into dozens of tiny tasks if they share one write scope. Instead:
- keep one task
- keep steps small
- use routing metadata to show how it should execute

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** Execute this plan via `superpowers:executing-plans`. That skill must route each task using the metadata below, invoking parallel or high-assurance execution strategies when required. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Execution Notes:**
- Parallel-safe tasks: [Task numbers or `none`]
- Shared write scopes / serial tasks: [Task numbers or `none`]
- Recommended default mode: [parallel | high-assurance-serial | mixed | direct]
- Knowledge Inputs: [relevant garden entries or `none`]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Depends on:** [Task numbers or `none`]
**Write Scope:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py`
- Exclude: `exact/path/to/leave-alone.py`

**Potential Conflicts:**
- [shared file / contract / migration note or `none`]

**Execution Recommendation:** [direct | sidecar | parallel | high-assurance-serial]
**Review Level:** [L0 | L1 | L2]

**Files:**
- Test: `tests/exact/path/to/test.py`
- Docs: `docs/exact/path.md` (if needed)

**Verify:**
- Run: `pytest tests/path/test.py::test_name -v`
- Expect: `PASS`

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_specific_behavior -v`
Expected: FAIL with `[exact failure or closest known failure]`

- [ ] **Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run targeted verification**

Run: `pytest tests/path/test.py::test_specific_behavior -v`
Expected: PASS

- [ ] **Step 5: Prepare handoff**

- Summarize files changed
- Note scope issues or follow-up risks
- Commit only if execution mode requests it
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures**:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — tasks may be executed out of order)
- Steps that describe what to do without showing how
- Missing routing metadata
- `Execution Recommendation: parallel` without a bounded write scope
- `Potential Conflicts: none` when tasks clearly touch the same file family

## Execution Recommendation Guidance

Choose execution mode deliberately.

### direct
Use when:
- task is tiny
- one writer is enough
- delegation overhead exceeds benefit

### sidecar
Use when:
- the task is read-only
- it helps an active writer
- examples: trace call sites, run unaffected tests, bounded review, summarize logs

### parallel
Use when:
- the task owns a distinct write scope
- it has weak or no dependencies
- it can be merged without touching another task's files

### high-assurance-serial
Use when:
- write scope overlaps with another active task
- task modifies auth/payments/persistence/concurrency/core glue
- later tasks depend on exact output of this one

## Review Level Guidance

### L0
- self-review + local verification only
- for low-risk, obvious tasks

### L1
- one focused external review
- for normal feature / bugfix tasks

### L2
- spec review + quality review
- for high-risk or ambiguous tasks

## Remember
- Exact file paths always
- Bounded write scopes always
- Complete code in every code-changing step
- Exact commands with expected output
- DRY, YAGNI, TDD
- Use routing metadata to prevent idle waiting later

## Self-Review

After writing the complete plan, check it yourself.

**1. Spec coverage:** Can every requirement be mapped to a task?

**2. Placeholder scan:** Remove vagueness and incomplete routing metadata.

**3. Type consistency:** Ensure names, types, and APIs stay consistent across tasks.

**4. Routing sanity:** For every task marked `parallel`, is the write scope truly isolated? For every task marked `high-assurance-serial`, is the conflict or risk explicit?

**5. Wait-risk scan:** If execution started now, would the controller know:
- which tasks can run together
- which tasks must serialize
- which sidecars can run while a writer is busy

If not, improve the metadata.

## Execution Handoff

After saving the plan, hand off to the single execution entry:

**"Plan complete and saved to `docs/superpowers/plans/<filename>.md`. Recommended routing: [mode].**

**Next step:** use `superpowers:executing-plans` to execute this plan. It should route each task by `Execution Recommendation`, preserve `Write Scope`, and apply the specified `Review Level`.

If you want to review the plan before execution, stop here and ask your human partner. Otherwise proceed to `superpowers:executing-plans`."
