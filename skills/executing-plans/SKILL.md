---
name: executing-plans
description: Use when you have a written implementation plan and need a single execution entry that routes tasks into direct, sidecar, parallel, or high-assurance execution
---

# Executing Plans

## Overview

Load a written plan, review it critically, then execute it through one controller. This skill is the default execution entry point: it decides when to work directly, when to dispatch sidecars, when to run parallel writers, and when to use high-assurance serial execution.

Execution routing is not permission to reinterpret the approved goal. If the plan or upstream brief locked the deliverable shape, user, entry surface, or success criteria, preserve them.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

**Note:** Subagents are tools of this workflow, not a separate user-facing mode. When subagents are available, use them where the task metadata says they help.

## The Process

### Step 1: Load and Review Plan
1. Read the plan file
2. Review the plan critically
3. Extract for each task:
   - Depends on
   - Write Scope
   - Potential Conflicts
   - Verify
   - Execution Recommendation
   - Review Level
4. Also extract any locked delivery boundary:
   - deliverable shape
   - primary user
   - entry surface
   - success criteria
   - non-equivalent downgrade warnings
5. If plan metadata is missing or contradictory, stop and fix the plan before implementing
6. Create TodoWrite and proceed

### Step 2: Execute Tasks

For each task:
1. Respect `Depends on`
2. Respect `Write Scope`
3. Follow the steps exactly
4. Route by `Execution Recommendation`
   - `direct` → execute locally
   - `sidecar` → dispatch read-only helper work or do the equivalent locally
   - `parallel` → use `superpowers:dispatching-parallel-agents` or equivalent safe parallel routing
   - `high-assurance-serial` → use `superpowers:subagent-driven-development` or equivalent single-writer routing
5. Preserve the locked delivery boundary; do not silently shrink feature/page/entry work into a smaller internal tool or CLI
6. If the plan or active task includes relevant `Knowledge Inputs`, consult only that narrow subset through `superpowers:engineering-knowledge-garden`
7. Run the specified verification
8. Apply the requested `Review Level`
   - `L0`: self-review + local verification
   - `L1`: one bounded external review if subagents are available, otherwise stricter self-review
   - `L2`: bounded spec review then bounded quality review if subagents are available; otherwise pause and tell the human this path reduced assurance
9. Mark the task completed

### Step 3: Stay Honest About Routing

If you discover during execution that:
- two future tasks are actually parallel-safe
- a task marked `parallel` shares write scope after all
- a sidecar would materially reduce risk or waiting
- the current path is drifting away from the locked delivery boundary

then stop and update the execution approach instead of forcing the original assumption.

### Step 4: Complete Development

After all tasks complete and required verification passes:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch
- Follow that skill to verify tests, present options, and execute the chosen finish path

## When to Stop and Ask for Help

**STOP executing immediately when:**
- A blocker appears
- Plan metadata is missing or misleading
- Verification fails repeatedly
- The real write scope is larger than planned
- The task should be re-routed to a different execution mode for safety or efficiency
- The implementation path no longer satisfies the locked deliverable shape or success criteria

Ask for clarification rather than guessing.

## Remember
- Review plan metadata first
- Follow task steps exactly
- Do not skip verification
- Respect write-scope boundaries
- Respect locked delivery boundaries
- Optimize for minimal sufficient delivery, not smallest diff
- This skill owns execution routing; don't ask the human to choose between internal strategies unless blocked
- Never start implementation on main/master branch without explicit user consent

## Integration

**Required workflow skills:**
- **superpowers:using-git-worktrees** - REQUIRED: set up isolated workspace before starting
- **superpowers:writing-plans** - creates the plan this skill executes
- **superpowers:finishing-a-development-branch** - completes the work after implementation

**Related skills:**
- **superpowers:dispatching-parallel-agents** - internal routing strategy for tasks marked `parallel`
- **superpowers:subagent-driven-development** - internal routing strategy for tasks marked `high-assurance-serial`
- **superpowers:refactor-mode** - prepare behavior-freeze and seam-migration inputs before planning structural cleanup
- **superpowers:engineering-knowledge-garden** - bounded lookup or batched capture of durable project knowledge
