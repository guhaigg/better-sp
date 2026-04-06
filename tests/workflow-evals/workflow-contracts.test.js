import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

function read(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("writing-plans preserves a single execution entry handoff", () => {
  const content = read("skills/writing-plans/SKILL.md");
  assert.match(content, /single execution entry/i);
  assert.match(content, /superpowers:executing-plans/);
  assert.match(content, /Execution Recommendation/);
  assert.match(content, /Write Scope/);
  assert.match(content, /Review Level/);
});

test("executing-plans keeps routing internal instead of asking the human to pick a mode", () => {
  const content = read("skills/executing-plans/SKILL.md");
  assert.match(content, /This skill is the default execution entry point/i);
  assert.match(content, /This skill owns execution routing; don't ask the human to choose between internal strategies unless blocked/i);
  assert.match(content, /parallel` → use `superpowers:dispatching-parallel-agents/i);
  assert.match(content, /high-assurance-serial` → use `superpowers:subagent-driven-development/i);
});

test("parallel routing contracts preserve one writer plus readers and no hard wait", () => {
  const parallelContent = read("skills/dispatching-parallel-agents/SKILL.md");
  const serialContent = read("skills/subagent-driven-development/SKILL.md");

  assert.match(parallelContent, /single writer \+ read-only sidecars/i);
  assert.match(parallelContent, /do not immediately wait/i);
  assert.match(serialContent, /Shared write scope != waiting/i);
  assert.match(serialContent, /Do not spawn and immediately wait/i);
  assert.match(serialContent, /L0 — Self-review only/);
  assert.match(serialContent, /L1 — Single external review/);
  assert.match(serialContent, /L2 — Two-stage review/);
});

test("refactor-mode stays a distinct workflow with a refactor brief", () => {
  const content = read("skills/refactor-mode/SKILL.md");
  assert.match(content, /Refactoring is not “feature work but cleaner\.”/i);
  assert.match(content, /# Refactor Brief/);
  assert.match(content, /Frozen Behavior/);
  assert.match(content, /Target Shape/);
  assert.match(content, /Migration Order/);
});
