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

test("extract-guidance creates a compressed guidance brief from a landscape archive", () => {
  const root = makeRepo();
  const archive = run(
    root,
    "archive-create",
    "--title",
    "Controller routing landscape",
    "--tags",
    "routing,agents",
  );

  writeFileSync(
    archive,
    `---
title: Controller routing landscape
kind: landscape-brief
status: archived
tags:
  - routing
  - agents
sources: []
distilled_into: []
created_at: 2026-04-06
last_reviewed: 2026-04-06
---

# Landscape Brief

## Goal

- Compare controller routing strategies.

## Bypass Check

- External comparison was still useful.

## Search Strategy

- Query style: routing
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

- one execution entry
- one writer plus readers on shared write scope

### Avoid

- human-facing internal mode menus

### Preferred Shape

- route internally by task metadata

### Unknowns

- whether more transcript harnesses are needed

### Confidence

- Medium-High

## Distill Candidates

- [ ] Pattern: route shared write scope through one writer plus readers
- [ ] Pitfall: do not hard-wait after dispatch
`,
    "utf8",
  );

  const output = run(root, "extract-guidance", "--archive", archive);
  const [guidanceLine] = output.split(/\r?\n/);
  const guidancePath = guidanceLine.replace(/^GUIDANCE\s+/, "");

  assert.ok(existsSync(guidancePath), "guidance file should be created");
  const guidanceContent = readFileSync(guidancePath, "utf8");
  assert.match(guidanceContent, /kind: guidance-brief/);
  assert.match(guidanceContent, /source_archive:/);
  assert.match(guidanceContent, /## Borrow/);
  assert.match(guidanceContent, /one execution entry/);
  assert.match(guidanceContent, /## Preferred Shape/);
  assert.match(guidanceContent, /route internally by task metadata/);
  assert.match(output, /DISTILL_CANDIDATES/);
  assert.match(output, /Pattern: route shared write scope through one writer plus readers/);
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
  const archive = run(root, "archive-create", "--title", "Landscape for validation");
  run(root, "extract-guidance", "--archive", archive);
  const report = run(root, "validate", "docs/engineering-knowledge-garden", "--include-archive");
  assert.match(report, /PASS/);
  assert.match(report, /landscapes/);
  assert.match(report, /guidance/);
});
