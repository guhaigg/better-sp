# better-sp (fork of Superpowers)

`better-sp` is an experimental fork layer on top of [obra/superpowers](https://github.com/obra/superpowers), focused on fixing orchestration pain points we hit in real agent workflows:

- hard waiting after dispatch
- making the human choose internal execution modes
- shared write scope collapsing into idle single-thread work
- treating refactors like endless feature patching
- polluting `AGENTS.md` with project memory

This repository currently tracks those changes in a fork/worktree form rather than claiming upstream acceptance.

## Fork / Inspiration Notice

**Fork source**
- Upstream base: [obra/superpowers](https://github.com/obra/superpowers)

**Design references / inspirations**
- [xhyqaq/superpowers-plus](https://github.com/xhyqaq/superpowers-plus) — unified execution entry and lighter orchestration ergonomics
- Anthropic Claude Code memory / subagent patterns — for memory scoping and bounded context ideas
- Google Gemini CLI context / custom memory patterns — for progressive disclosure and project-vs-global context separation

**What this fork is trying to add**
- single execution entry via `executing-plans`
- no user-facing “pick an internal execution mode” handoff
- `shared write scope -> 1 writer + readers`
- `spec != plan`
- `project-landscape-analysis`
- `refactor-mode`
- `engineering-knowledge-garden`
- `gardener-mode`

## Fork Architecture At A Glance

```mermaid
flowchart TD
    A["User request"] --> R{"Need external comparison?"}
    R -- "Yes" --> S["project-landscape-analysis<br/>full brief + compressed guidance"]
    R -- "No" --> B{"Behavior unclear?"}
    S --> B
    B -- "Yes" --> C["brainstorming<br/>write reviewed spec"]
    B -- "No, structure cleanup" --> D["refactor-mode<br/>write refactor brief"]
    B -- "No, clear enough" --> E["writing-plans"]
    C --> E
    D --> E
    E --> F["executing-plans<br/>single execution entry"]
    F --> G["direct"]
    F --> H["sidecar"]
    F --> I["parallel writers"]
    F --> J["high-assurance serial<br/>single writer + readers"]
    J --> K["requesting-code-review"]
    I --> K
    H --> K
    G --> K
    K --> L["finishing-a-development-branch"]
```

## Knowledge Garden Flow

```mermaid
flowchart LR
    A["External comparison"] --> B["project-landscape-analysis"]
    B --> C["full landscape brief"]
    B --> D["compressed guidance brief"]
    C --> E["engineering-knowledge-garden/archive"]
    D --> F["brainstorming / writing-plans"]
    G["Real work happens"] --> H["Batch capture durable lessons"]
    H --> I["engineering-knowledge-garden<br/>project-local read/write"]
    I --> J["bounded lookup during planning / execution / review"]
    I --> K["gardener-mode<br/>validate + audit + prune proposals"]
    L["optional global read-only garden"] --> J
```

## How it works

It starts from the moment you fire up your coding agent. As soon as it sees that you're building something, it *doesn't* just jump into trying to write code. Instead, it steps back and asks you what you're really trying to do.

Once it's teased a spec out of the conversation, it shows it to you in chunks short enough to actually read and digest. That spec is the review artifact.

After you've signed off on the spec, your agent puts together an implementation plan that's clear enough for an enthusiastic junior engineer with poor taste, no judgement, no project context, and an aversion to testing to follow. That plan is the orchestration artifact. It emphasizes true red/green TDD, YAGNI (You Aren't Gonna Need It), and DRY.

Next up, once you say "go", it launches an *executing-plans* process that routes each task to the right execution mode: direct work, read-only sidecars, parallel subagents, or high-assurance single-writer execution. That keeps the controller focused on orchestration instead of making you pick an execution style up front.

There's a bunch more to it, but that's the core of the system. And because the skills trigger automatically, you don't need to do anything special. Your coding agent just has Superpowers.


## Sponsorship

If Superpowers has helped you do stuff that makes money and you are so inclined, I'd greatly appreciate it if you'd consider [sponsoring my opensource work](https://github.com/sponsors/obra).

Thanks!

- Jesse


## Installation

**Note:** Installation differs by platform. Claude Code or Cursor have built-in plugin marketplaces. Codex and OpenCode require manual setup.

### Claude Code Official Marketplace

Superpowers is available via the [official Claude plugin marketplace](https://claude.com/plugins/superpowers)

Install the plugin from Claude marketplace:

```bash
/plugin install superpowers@claude-plugins-official
```

### Claude Code (via Plugin Marketplace)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add obra/superpowers-marketplace
```

Then install the plugin from this marketplace:

```bash
/plugin install superpowers@superpowers-marketplace
```

### Cursor (via Plugin Marketplace)

In Cursor Agent chat, install from marketplace:

```text
/add-plugin superpowers
```

or search for "superpowers" in the plugin marketplace.

### Codex

Tell Codex:

```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md
```

**Detailed docs:** [docs/README.codex.md](docs/README.codex.md)

### OpenCode

Tell OpenCode:

```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

**Detailed docs:** [docs/README.opencode.md](docs/README.opencode.md)

### GitHub Copilot CLI

```bash
copilot plugin marketplace add obra/superpowers-marketplace
copilot plugin install superpowers@superpowers-marketplace
```

### Gemini CLI

```bash
gemini extensions install https://github.com/obra/superpowers
```

To update:

```bash
gemini extensions update superpowers
```

### Verify Installation

Start a new session in your chosen platform and ask for something that should trigger a skill (for example, "help me plan this feature" or "let's debug this issue"). The agent should automatically invoke the relevant superpowers skill.

## What This Fork Changes

### Workflow changes

1. **project-landscape-analysis** - Activates when a greenfield project, new subsystem, or expensive architecture choice should first be compared against external references. It performs a bypass check, prefers secondary sources, and passes only a compressed guidance card downstream.

2. **brainstorming** - Activates when behavior or feature shape is still unclear. It no longer tries to own every possible non-trivial task, and it should not force dead clarification loops once the spec is already sharp.

3. **refactor-mode** - Activates when behavior is mostly frozen but the code has become patchy, duplicated, or hard to reuse. Produces a refactor brief before structural cleanup.

4. **using-git-worktrees** - Activates after design or refactor approval. Creates isolated workspace on new branch, runs project setup, verifies clean test baseline.

5. **writing-plans** - Activates with approved spec or refactor brief. Produces the orchestration plan: bite-sized tasks with exact file paths, verification steps, write scope, conflict notes, routing recommendation, and review level.

6. **executing-plans** - Activates with plan. Acts as the single execution entry point and routes each task into direct execution, sidecar help, parallel dispatch, or high-assurance serial execution.

7. **test-driven-development** - Activates during implementation. Enforces RED-GREEN-REFACTOR: write failing test, watch it fail, write minimal code, watch it pass, commit. Deletes code written before tests.

8. **requesting-code-review** - Activates between tasks. Reviews against plan, reports issues by severity. Critical issues block progress.

9. **finishing-a-development-branch** - Activates when tasks complete. Verifies tests, presents options (merge/PR/keep/discard), cleans up worktree.

10. **engineering-knowledge-garden** - Activates when durable project knowledge should be looked up, captured, or pruned without polluting `AGENTS.md` or loading a giant memory blob.

11. **gardener-mode** - Activates as a separate maintenance workflow to validate, audit, and prune the knowledge garden without blocking everyday implementation.

**The agent checks for relevant skills before any task.** Mandatory workflows, not suggestions.

## Pressure-Tested Behaviors

This fork was explicitly pressure-tested against the orchestration failures that motivated it:

- no immediate spawn-then-wait controller behavior
- no human-facing choice among internal execution strategies
- shared write scope degrades to **1 writer + readers**
- refactor work gets its own workflow instead of becoming another feature patch pile

See:
- `docs/superpowers/evals/2026-04-06-better-sp-routing-pressure-test.md`
- `docs/superpowers/specs/2026-04-06-engineering-knowledge-garden-design.md`

## What's Inside

### Skills Library

**Testing**
- **test-driven-development** - RED-GREEN-REFACTOR cycle (includes testing anti-patterns reference)

**Debugging**
- **systematic-debugging** - 4-phase root cause process (includes root-cause-tracing, defense-in-depth, condition-based-waiting techniques)
- **verification-before-completion** - Ensure it's actually fixed

**Collaboration**
- **brainstorming** - Socratic design refinement
- **writing-plans** - Detailed implementation plans
- **executing-plans** - Single execution entry point with task routing
- **requesting-code-review** - Pre-review checklist
- **receiving-code-review** - Responding to feedback
- **using-git-worktrees** - Parallel development branches
- **finishing-a-development-branch** - Merge/PR decision workflow
- **subagent-driven-development** - High-assurance single-writer strategy for shared-write or high-risk tasks
- **dispatching-parallel-agents** - Parallel writer/reader strategy for disjoint work or single-writer + sidecars
- **refactor-mode** - Behavior-freeze and seam-migration workflow for structural cleanup
- **project-landscape-analysis** - Bounded external comparison with bypass, source ladder, and compressed handoff
- **engineering-knowledge-garden** - Searchable project intelligence with local write roots, optional global read-only lookup, and validated entries
- **gardener-mode** - Scheduled / explicit maintenance workflow for validating and pruning the knowledge garden

**Meta**
- **writing-skills** - Create new skills following best practices (includes testing methodology)
- **using-superpowers** - Introduction to the skills system

## Philosophy

- **Test-Driven Development** - Write tests first, always
- **Systematic over ad-hoc** - Process over guessing
- **Complexity reduction** - Simplicity as primary goal
- **Evidence over claims** - Verify before declaring success

Read more: [Superpowers for Claude Code](https://blog.fsck.com/2025/10/09/superpowers/)

## Contributing

Skills live directly in this repository. To contribute:

1. Fork the repository
2. Create a branch for your skill
3. Follow the `writing-skills` skill for creating and testing new skills
4. Submit a PR

See `skills/writing-skills/SKILL.md` for the complete guide.

## Repository Notes

- This branch/worktree is based on `obra/superpowers`
- This fork is intended to be uploaded as a fork or derivative repo with explicit attribution
- If you plan to upstream pieces of it later, split the changes into small evidence-backed PRs rather than one giant fork dump

## Updating

Skills update automatically when you update the plugin:

```bash
/plugin update superpowers
```

## License

MIT License - see LICENSE file for details

## Community

Superpowers is built by [Jesse Vincent](https://blog.fsck.com) and the rest of the folks at [Prime Radiant](https://primeradiant.com).

- **Discord**: [Join us](https://discord.gg/Jd8Vphy9jq) for community support, questions, and sharing what you're building with Superpowers
- **Issues**: https://github.com/obra/superpowers/issues
- **Release announcements**: [Sign up](https://primeradiant.com/superpowers/) to get notified about new versions
