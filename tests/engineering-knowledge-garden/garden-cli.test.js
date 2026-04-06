import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const script = path.join(repoRoot, "skills", "engineering-knowledge-garden", "scripts", "garden.cjs");

function makeRepo() {
  const root = mkdtempSync(path.join(os.tmpdir(), "garden-cli-"));
  mkdirSync(path.join(root, "docs", "engineering-knowledge-garden"), { recursive: true });
  return root;
}

function run(root, ...args) {
  return execFileSync("node", [script, ...args], {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

function writeArchive(root, relativePath, content) {
  const full = path.join(root, relativePath);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, content, "utf8");
  return full;
}

test("archive-create scaffolds a structured landscape brief", () => {
  const root = makeRepo();
  const output = run(
    root,
    "archive-create",
    "--title",
    "Better SP routing landscape",
    "--tags",
    "routing,orchestration",
  );

  assert.ok(existsSync(output), "archive file should be created");
  const content = readFileSync(output, "utf8");
  assert.match(content, /kind: landscape-brief/);
  assert.match(content, /status: archived/);
  assert.match(content, /## Downstream Guidance/);
  assert.match(content, /## Distill Candidates/);
});

test("distill creates a draft garden entry and records the linkage back to the archive", () => {
  const root = makeRepo();
  const archive = run(
    root,
    "archive-create",
    "--title",
    "Controller routing landscape",
    "--tags",
    "routing,agents",
  );

  const output = run(
    root,
    "distill",
    "--archive",
    archive,
    "--type",
    "pattern",
    "--title",
    "Route shared write scope through one writer plus readers",
    "--scope",
    "skills/executing-plans/SKILL.md",
  );

  const [entryLine] = output.split(/\r?\n/);
  const entryPath = entryLine.replace(/^ENTRY\s+/, "");
  assert.ok(existsSync(entryPath), "distilled garden entry should exist");

  const entryContent = readFileSync(entryPath, "utf8");
  assert.match(entryContent, /type: pattern/);
  assert.match(entryContent, /status: draft/);
  assert.match(entryContent, /distilled from archive/);
  assert.match(entryContent, /archive: `/);

  const archiveContent = readFileSync(archive, "utf8");
  assert.match(archiveContent, /status: distilled/);
  assert.match(archiveContent, /distilled_into:/);
  assert.match(archiveContent, /patterns\/route-shared-write-scope-through-one-writer-plus-readers\.md/);
});

test("audit surfaces archive briefs that were never distilled", () => {
  const root = makeRepo();
  writeArchive(
    root,
    path.join("docs", "engineering-knowledge-garden", "archive", "landscapes", "2026-01-01-old-routing-landscape.md"),
    `---
title: Old routing landscape
kind: landscape-brief
status: archived
tags:
  - routing
sources:
  - https://example.com/post
distilled_into: []
created_at: 2026-01-01
last_reviewed: 2026-01-01
---

# Landscape Brief

## Goal

- Compare routing approaches.

## Bypass Check

- Research was required.

## Search Strategy

- Query style:
- Sources prioritized:
- Why these sources:

## Candidate Comparison

### Candidate 1: Example
- Problem solved:
- Workflow / architecture shape:
- Evidence:
- Strengths:
- Tradeoffs:
- Borrow:
- Avoid:

## Downstream Guidance

### Borrow

- 

### Avoid

- 

### Preferred Shape

- 

### Unknowns

- 

### Confidence

- Medium

## Distill Candidates

- [ ] Pattern:
- [ ] Pitfall:
- [ ] Decision:
`,
  );

  const report = run(root, "audit", "--archive-days", "7", "--days", "999");
  assert.match(report, /Archive backlog/);
  assert.match(report, /2026-01-01-old-routing-landscape\.md/);
});

test("validate can include archive briefs when requested", () => {
  const root = makeRepo();
  run(root, "archive-create", "--title", "Landscape for validation");
  const report = run(root, "validate", "docs/engineering-knowledge-garden", "--include-archive");
  assert.match(report, /PASS/);
  assert.match(report, /landscapes/);
});
