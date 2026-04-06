# Changelog

## [Unreleased]

### Added

- **Refactor mode**: Added `refactor-mode` as a dedicated structural-cleanup workflow for patch accumulation, duplication, and reuse recovery. It freezes behavior, defines target seams, and feeds structural work back into routed planning/execution instead of treating refactors as normal feature work.
- **Engineering knowledge garden**: Added `engineering-knowledge-garden` plus project-local garden structure, lightweight search/validation tooling, and initial seeded entries so durable project knowledge no longer has to accumulate in `AGENTS.md`.
- **Gardener mode**: Added `gardener-mode` plus `garden audit` support so pruning and duplicate detection can run as an explicit maintenance workflow instead of burdening normal feature work.
- **Project landscape analysis**: Added `project-landscape-analysis` for bounded external comparison before design. It performs a bypass check, prefers secondary sources over raw repo spelunking, and hands downstream skills a compressed guidance brief instead of a giant research dump.

### Changed

- **Execution routing model**: `executing-plans` is now the single execution entry point. Plans carry routing metadata (`Depends on`, `Write Scope`, `Potential Conflicts`, `Verify`, `Execution Recommendation`, `Review Level`), and execution routes tasks into direct work, sidecars, parallel dispatch, or high-assurance single-writer execution.
- **Plan handoff**: `writing-plans` no longer asks the human to choose between internal execution strategies. It hands off to `executing-plans`, which owns routing.
- **Subagent workflow model**: `subagent-driven-development` is repositioned as a high-assurance serial strategy instead of the default execution path for all subagent work.
- **Parallel degradation**: `dispatching-parallel-agents` now explicitly supports shared-write degradation to single-writer + read-only sidecars instead of blocking the controller immediately.
- **Brainstorming scope**: `brainstorming` is narrowed to unclear behavior/spec work. It now avoids dead question loops, drafts specs earlier when requirements are already sharp, and points structure-only cleanup to `refactor-mode`.
- **Skill routing**: `using-superpowers` now distinguishes between unclear behavior work (`brainstorming`) and behavior-frozen structural cleanup (`refactor-mode`).

## [5.0.5] - 2026-03-17

### Fixed

- **Brainstorm server ESM fix**: Renamed `server.js` → `server.cjs` so the brainstorming server starts correctly on Node.js 22+ where the root `package.json` `"type": "module"` caused `require()` to fail. ([PR #784](https://github.com/obra/superpowers/pull/784) by @sarbojitrana, fixes [#774](https://github.com/obra/superpowers/issues/774), [#780](https://github.com/obra/superpowers/issues/780), [#783](https://github.com/obra/superpowers/issues/783))
- **Brainstorm owner-PID on Windows**: Skip `BRAINSTORM_OWNER_PID` lifecycle monitoring on Windows/MSYS2 where the PID namespace is invisible to Node.js. Prevents the server from self-terminating after 60 seconds. The 30-minute idle timeout remains as the safety net. ([#770](https://github.com/obra/superpowers/issues/770), docs from [PR #768](https://github.com/obra/superpowers/pull/768) by @lucasyhzhu-debug)
- **stop-server.sh reliability**: Verify the server process actually died before reporting success. Waits up to 2 seconds for graceful shutdown, escalates to `SIGKILL`, and reports failure if the process survives. ([#723](https://github.com/obra/superpowers/issues/723))

### Changed

- **Execution handoff**: Restore user choice between subagent-driven-development and executing-plans after plan writing. Subagent-driven is recommended but no longer mandatory. (Reverts `5e51c3e`)
