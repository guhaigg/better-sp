#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const TYPES = new Set([
  "decision",
  "pattern",
  "pitfall",
  "verification-recipe",
  "reusable-asset",
  "agent-optimization",
]);

const STATUSES = new Set(["draft", "proven", "deprecated", "archived"]);

const REQUIRED_KEYS = [
  "title",
  "type",
  "status",
  "tags",
  "triggers",
  "scope",
  "evidence",
  "last_verified",
  "supersedes",
];

const REQUIRED_SECTIONS = [
  "## Use when",
  "## Why",
  "## Apply",
  "## Avoid",
  "## Verification",
  "## Related entries",
];

function expandHome(input) {
  if (!input) return input;
  if (input === "~") return os.homedir();
  if (input.startsWith("~/")) return path.join(os.homedir(), input.slice(2));
  return input;
}

function resolvePath(input, base = process.cwd()) {
  if (!input) return null;
  const expanded = expandHome(input);
  return path.isAbsolute(expanded) ? expanded : path.resolve(base, expanded);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    if (args[key] === undefined) {
      args[key] = next;
    } else if (Array.isArray(args[key])) {
      args[key].push(next);
    } else {
      args[key] = [args[key], next];
    }
    i += 1;
  }
  return args;
}

function normalizeList(value) {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value.flatMap((item) => normalizeList(item));
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseFrontmatter(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "---") return { data: null, body: content };
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) return { data: null, body: content };

  const raw = lines.slice(1, end);
  const data = {};

  for (let i = 0; i < raw.length; i += 1) {
    const line = raw[i];
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;

    if (rawValue === "") {
      const list = [];
      while (i + 1 < raw.length && /^\s*-\s+/.test(raw[i + 1])) {
        i += 1;
        list.push(raw[i].replace(/^\s*-\s+/, "").trim());
      }
      data[key] = list;
      continue;
    }

    if (/^\[.*\]$/.test(rawValue.trim())) {
      const inner = rawValue.trim().slice(1, -1).trim();
      data[key] = inner
        ? inner.split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        : [];
      continue;
    }

    data[key] = rawValue.trim().replace(/^['"]|['"]$/g, "");
  }

  return {
    data,
    body: lines.slice(end + 1).join("\n"),
  };
}

function walkMarkdownFiles(root) {
  const results = [];
  if (!root || !fs.existsSync(root)) return results;

  function visit(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === ".git" || entry.name === "archive") continue;
        visit(full);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".md")) {
        if (entry.name === "README.md" || entry.name === "INDEX.md") continue;
        results.push(full);
      }
    }
  }

  visit(root);
  return results;
}

function loadEntry(file, source) {
  const content = fs.readFileSync(file, "utf8");
  const { data, body } = parseFrontmatter(content);
  return {
    file,
    source,
    data: data || {},
    body,
    content,
  };
}

function collectEntries(root, globalRoot) {
  const entries = [];
  for (const file of walkMarkdownFiles(root)) entries.push(loadEntry(file, "local"));
  if (globalRoot && fs.existsSync(globalRoot)) {
    for (const file of walkMarkdownFiles(globalRoot)) entries.push(loadEntry(file, "global"));
  }
  return entries;
}

function scoreEntry(entry, filters) {
  let score = 0;
  const title = String(entry.data.title || "").toLowerCase();
  const body = String(entry.body || "").toLowerCase();
  const tags = normalizeList(entry.data.tags).map((tag) => tag.toLowerCase());
  const scopes = normalizeList(entry.data.scope).map((scope) => scope.toLowerCase());

  if (filters.type && entry.data.type === filters.type) score += 5;
  for (const tag of filters.tags) {
    if (tags.includes(tag.toLowerCase())) score += 3;
  }
  for (const scope of filters.scopes) {
    if (scopes.some((item) => item.includes(scope.toLowerCase()))) score += 2;
  }
  for (const term of filters.textTerms) {
    const lower = term.toLowerCase();
    if (title.includes(lower)) score += 2;
    if (body.includes(lower)) score += 1;
  }

  return score;
}

function printSearchResults(entries) {
  if (entries.length === 0) {
    console.log("No matching garden entries.");
    return;
  }

  for (const entry of entries) {
    const tags = normalizeList(entry.data.tags).join(", ") || "none";
    const scopes = normalizeList(entry.data.scope).join(", ") || "none";
    console.log(`[${entry.source}] ${entry.data.type || "unknown"} | ${entry.data.title || path.basename(entry.file)}`);
    console.log(`  file: ${entry.file}`);
    console.log(`  tags: ${tags}`);
    console.log(`  scope: ${scopes}`);
    console.log(`  status: ${entry.data.status || "unknown"}`);
    console.log("");
  }
}

function validateEntry(entry) {
  const errors = [];
  const data = entry.data || {};

  for (const key of REQUIRED_KEYS) {
    if (!(key in data)) errors.push(`missing frontmatter key: ${key}`);
  }

  if (data.type && !TYPES.has(data.type)) {
    errors.push(`invalid type: ${data.type}`);
  }
  if (data.status && !STATUSES.has(data.status)) {
    errors.push(`invalid status: ${data.status}`);
  }

  for (const key of ["tags", "triggers", "scope", "evidence", "supersedes"]) {
    if (key in data && !Array.isArray(data[key])) {
      errors.push(`${key} must be a list`);
    }
  }

  const body = entry.body || "";
  for (const heading of REQUIRED_SECTIONS) {
    if (!body.includes(heading)) {
      errors.push(`missing body section: ${heading}`);
    }
  }

  return errors;
}

function commandSearch(args) {
  const root = resolvePath(args.root || "docs/engineering-knowledge-garden");
  const globalRoot = resolvePath(args["global-root"] || process.env.SUPERPOWERS_GLOBAL_GARDEN || "");
  const limit = Number(args.limit || 8);

  const filters = {
    type: args.type || "",
    tags: normalizeList(args.tag),
    scopes: normalizeList(args.scope),
    textTerms: normalizeList(args.text || args.q),
  };

  const entries = collectEntries(root, globalRoot);

  const filtered = entries
    .map((entry) => ({ ...entry, score: scoreEntry(entry, filters) }))
    .filter((entry) => {
      if (filters.type && entry.data.type !== filters.type) return false;
      if (filters.tags.length > 0) {
        const tags = normalizeList(entry.data.tags).map((tag) => tag.toLowerCase());
        if (!filters.tags.some((tag) => tags.includes(tag.toLowerCase()))) return false;
      }
      if (filters.scopes.length > 0) {
        const scopes = normalizeList(entry.data.scope).map((scope) => scope.toLowerCase());
        if (!filters.scopes.some((needle) => scopes.some((scope) => scope.includes(needle.toLowerCase())))) return false;
      }
      if (filters.textTerms.length > 0) {
        const haystack = `${entry.data.title || ""}\n${entry.body || ""}`.toLowerCase();
        if (!filters.textTerms.every((term) => haystack.includes(term.toLowerCase()))) return false;
      }
      return true;
    })
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))
    .slice(0, limit);

  printSearchResults(filtered);
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function daysBetween(older, newer) {
  return Math.floor((newer.getTime() - older.getTime()) / (1000 * 60 * 60 * 24));
}

function tokenizeEntry(entry) {
  const titleTokens = String(entry.data.title || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((item) => item.length >= 3);
  const tags = normalizeList(entry.data.tags).map((tag) => tag.toLowerCase());
  return new Set([...titleTokens, ...tags]);
}

function jaccard(left, right) {
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function commandAudit(args) {
  const root = resolvePath(args.root || "docs/engineering-knowledge-garden");
  const staleDays = Number(args.days || 180);
  const duplicateThreshold = Number(args.threshold || 0.5);
  const now = new Date();
  const entries = collectEntries(root, null).filter((entry) => entry.data.status !== "archived");

  if (entries.length === 0) {
    console.log("No garden entries found for audit.");
    return;
  }

  const stale = entries
    .map((entry) => {
      const parsed = parseDate(entry.data.last_verified);
      const age = parsed ? daysBetween(parsed, now) : Number.POSITIVE_INFINITY;
      return { entry, age, parsed };
    })
    .filter(({ age }) => age >= staleDays)
    .sort((a, b) => b.age - a.age);

  const duplicatePairs = [];
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const left = entries[i];
      const right = entries[j];
      if (left.data.type !== right.data.type) continue;
      const score = jaccard(tokenizeEntry(left), tokenizeEntry(right));
      const exactTitle = String(left.data.title || "").trim().toLowerCase() === String(right.data.title || "").trim().toLowerCase();
      if (exactTitle || score >= duplicateThreshold) {
        duplicatePairs.push({ left, right, score: exactTitle ? 1 : score });
      }
    }
  }

  console.log("Garden audit summary");
  console.log("====================");
  console.log(`Root: ${root}`);
  console.log(`Entries scanned: ${entries.length}`);
  console.log("");

  if (stale.length === 0) {
    console.log(`Stale entries (>${staleDays} days): none`);
  } else {
    console.log(`Stale entries (>${staleDays} days):`);
    for (const item of stale) {
      console.log(`- ${item.entry.file} (${item.parsed ? item.age + " days" : "invalid last_verified"})`);
    }
  }

  console.log("");

  if (duplicatePairs.length === 0) {
    console.log(`Duplicate candidates (threshold ${duplicateThreshold}): none`);
  } else {
    console.log(`Duplicate candidates (threshold ${duplicateThreshold}):`);
    for (const pair of duplicatePairs) {
      console.log(`- score=${pair.score.toFixed(2)}`);
      console.log(`  A: ${pair.left.file}`);
      console.log(`  B: ${pair.right.file}`);
    }
  }
}

function commandValidate(args) {
  const targets = args._.length > 0
    ? args._.map((item) => resolvePath(item))
    : [resolvePath(args.root || "docs/engineering-knowledge-garden")];

  const files = [];
  for (const target of targets) {
    if (!target || !fs.existsSync(target)) continue;
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      files.push(...walkMarkdownFiles(target));
    } else if (stat.isFile()) {
      files.push(target);
    }
  }

  if (files.length === 0) {
    console.error("No files found to validate.");
    process.exit(1);
  }

  let errorCount = 0;
  for (const file of files) {
    const entry = loadEntry(file, "local");
    const errors = validateEntry(entry);
    if (errors.length === 0) {
      console.log(`PASS ${file}`);
      continue;
    }
    errorCount += errors.length;
    console.log(`FAIL ${file}`);
    for (const error of errors) {
      console.log(`  - ${error}`);
    }
  }

  if (errorCount > 0) process.exit(1);
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function typeDirectory(type) {
  switch (type) {
    case "decision": return "decisions";
    case "pattern": return "patterns";
    case "pitfall": return "pitfalls";
    case "verification-recipe": return "verification-recipes";
    case "reusable-asset": return "reusable-assets";
    case "agent-optimization": return "agent-optimizations";
    default: throw new Error(`Unsupported type: ${type}`);
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function commandCreate(args) {
  const type = args.type;
  const title = args.title;
  if (!type || !title) {
    console.error("create requires --type and --title");
    process.exit(1);
  }
  if (!TYPES.has(type)) {
    console.error(`Invalid type: ${type}`);
    process.exit(1);
  }

  const root = resolvePath(args.root || "docs/engineering-knowledge-garden");
  const slug = slugify(args.slug || title);
  const dir = path.join(root, typeDirectory(type));
  const file = path.join(dir, `${slug}.md`);
  fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(file)) {
    console.error(`Refusing to overwrite existing file: ${file}`);
    process.exit(1);
  }

  const tags = normalizeList(args.tags).map((tag) => `"${tag}"`).join(", ");
  const scope = normalizeList(args.scope).map((item) => `"${item}"`).join(", ");

  const content = `---
title: ${title}
type: ${type}
status: draft
tags: [${tags}]
triggers: []
scope: [${scope}]
evidence: []
last_verified: ${today()}
supersedes: []
---

## Use when

- 

## Why

-

## Apply

1. 

## Avoid

- 

## Verification

- 

## Related entries

- none
`;

  fs.writeFileSync(file, content, "utf8");
  console.log(file);
}

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];
  const args = parseArgs(argv.slice(1));

  try {
    switch (command) {
      case "search":
        commandSearch(args);
        break;
      case "validate":
        commandValidate(args);
        break;
      case "audit":
        commandAudit(args);
        break;
      case "create":
        commandCreate(args);
        break;
      default:
        console.log("Usage:");
        console.log("  garden.js search --tag auth --scope src/auth --type pattern");
        console.log("  garden.js validate docs/engineering-knowledge-garden/");
        console.log("  garden.js audit --days 180 --threshold 0.5");
        console.log('  garden.js create --type pattern --title "Consolidate auth parsing in shared core"');
        process.exit(command ? 1 : 0);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
