# Workflow Eval, Minimal CI, and Garden Loop Implementation Plan

> **For agentic workers:** Route execution per task metadata. Use `superpowers:dispatching-parallel-agents` for tasks marked `parallel`, `superpowers:subagent-driven-development` for tasks marked `high-assurance-serial`, and direct/sidecar execution where indicated. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen better-sp with a lighter-but-real workflow regression layer, minimal GitHub CI + status-check support, and a smoother semi-automatic research -> archive -> guidance -> distill loop.

**Architecture:** Extend the zero-dependency garden CLI with one derived guidance artifact command instead of adding a separate service. Pair that with file-based workflow contract tests plus fresh eval docs so behavior-shaping skill text has both human-readable evidence and CI-visible regression coverage.

**Tech Stack:** Markdown skills/docs, Node.js built-in test runner, zero-dependency CLI script, GitHub Actions

**Execution Notes:**
- Parallel-safe tasks: Task 2, Task 3
- Shared write scopes / serial tasks: Task 1
- Recommended default mode: mixed

---

### Task 1: Extend garden CLI for semi-automatic archive -> guidance -> distill handoff

**Depends on:** none
**Write Scope:**
- Modify: `skills/engineering-knowledge-garden/scripts/garden.cjs`
- Modify: `tests/engineering-knowledge-garden/garden-cli.test.js`
- Modify: `skills/engineering-knowledge-garden/SKILL.md`
- Modify: `skills/project-landscape-analysis/SKILL.md`
- Modify: `docs/engineering-knowledge-garden/INDEX.md`
- Modify: `docs/engineering-knowledge-garden/archive/README.md`
- Create: `docs/engineering-knowledge-garden/guidance/README.md`
- Create: `docs/engineering-knowledge-garden/guidance/2026-04-06-agent-workflow-landscape-guidance.md`

**Potential Conflicts:**
- README wording may also mention the new command, but CLI semantics must be finalized here first.

**Execution Recommendation:** high-assurance-serial
**Review Level:** L1

**Files:**
- Test: `tests/engineering-knowledge-garden/garden-cli.test.js`
- Docs: `docs/engineering-knowledge-garden/INDEX.md`

**Verify:**
- Run: `node --test tests/engineering-knowledge-garden/garden-cli.test.js`
- Expect: `PASS`

- [ ] **Step 1: Add a guidance artifact command**

Implement `extract-guidance --archive <path>` in `skills/engineering-knowledge-garden/scripts/garden.cjs`.
Requirements:
- parse `## Downstream Guidance` from a `landscape-brief`
- extract Borrow / Avoid / Preferred Shape / Unknowns / Confidence
- create a markdown guidance artifact under `docs/engineering-knowledge-garden/guidance/`
- print the created path and keep the archive file path visible in output

- [ ] **Step 2: Make validation aware of the new artifact**

Extend validation logic so guidance artifacts validate cleanly without being misclassified as evergreen entries. Keep archive validation intact.

- [ ] **Step 3: Cover the loop with CLI tests**

Add tests proving:
- `extract-guidance` creates the expected file
- extracted sections are preserved
- existing `distill`, `audit`, and `validate --include-archive` behavior still passes

- [ ] **Step 4: Add a live sample artifact**

Create a real guidance sample derived from `docs/engineering-knowledge-garden/archive/landscapes/2026-04-06-agent-workflow-landscape.md`.

- [ ] **Step 5: Update skill and garden docs**

Document the new semi-automatic handoff in the garden skill, landscape-analysis skill, and local garden docs.

### Task 2: Add stronger workflow regression coverage and eval artifacts

**Depends on:** none
**Write Scope:**
- Create: `tests/workflow-evals/workflow-contracts.test.js`
- Create: `docs/superpowers/evals/2026-04-06-better-sp-workflow-regression-matrix.md`
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: `docs/better-sp-custom-skills-and-system.md`
- Modify: `docs/better-sp-custom-skills-and-system.zh-CN.md`

**Potential Conflicts:**
- README may also change for Task 3 CI notes; keep workflow-regression additions isolated to evaluation sections.

**Execution Recommendation:** parallel
**Review Level:** L1

**Files:**
- Test: `tests/workflow-evals/workflow-contracts.test.js`
- Docs: `docs/superpowers/evals/2026-04-06-better-sp-workflow-regression-matrix.md`

**Verify:**
- Run: `node --test tests/workflow-evals/workflow-contracts.test.js`
- Expect: `PASS`

- [ ] **Step 1: Encode workflow contracts into a lightweight regression test**

Create a file-based test that guards the user-reported orchestration fixes:
- single execution entry instead of human-facing internal mode selection
- no immediate hard-wait language for subagent routing
- shared write scope degrades to one writer + readers
- refactor mode stays distinct from feature mode

- [ ] **Step 2: Add a new eval document**

Write a concise regression matrix that ties together:
- the existing live routing pressure test
- the new contract regression tests
- the garden-loop handoff cases added in Task 1

- [ ] **Step 3: Surface the stronger eval story in docs**

Update README / CN README and custom-system docs so the repo explains both the limits and value of this regression layer.

### Task 3: Add minimal CI and wire it for future required status checks

**Depends on:** Task 1, Task 2
**Write Scope:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`
- Modify: `README.zh-CN.md`

**Potential Conflicts:**
- README sections may overlap with Task 2; merge once wording is final.

**Execution Recommendation:** parallel
**Review Level:** L0

**Files:**
- Docs: `README.md`

**Verify:**
- Run: `node --test tests/engineering-knowledge-garden/garden-cli.test.js tests/workflow-evals/workflow-contracts.test.js`
- Expect: `PASS`
- Run: `node skills/engineering-knowledge-garden/scripts/garden.cjs validate docs/engineering-knowledge-garden --include-archive`
- Expect: `PASS`
- Run: `git diff --check`
- Expect: no output

- [ ] **Step 1: Add minimal GitHub Actions CI**

Create a CI workflow that runs on `push` and `pull_request` and executes:
- Node built-in tests for garden + workflow contracts
- garden validation including archive artifacts
- `git diff --check`

- [ ] **Step 2: Document the status-check expectation**

Update README / CN README to explain that fork maintainers can require this workflow as a branch-protection status check.

- [ ] **Step 3: After merge, enable required checks on the fork main branch**

Do not guess check names before the workflow exists. After push, inspect the workflow/job names and then update branch protection if needed.

## Self-Review

- Workflow regression remains intentionally lightweight; do not overclaim it as a full transcript harness.
- Guidance artifacts must stay separate from evergreen entries.
- CI must remain zero-dependency and fast enough for a fork.
