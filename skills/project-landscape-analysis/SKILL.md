---
name: project-landscape-analysis
description: Use when a greenfield project, new subsystem, or high-cost architecture decision would benefit from bounded external comparison before brainstorming or planning
---

# Project Landscape Analysis

Study the surrounding landscape **before** locking a design when external comparison is genuinely useful.

**Core principle:** bypass trivial cases, prefer human-written teardowns over raw repos, and pass only a compressed guidance card downstream.

## When to Use

Use when:
- the user explicitly asks to look at similar projects, references, benchmarks, or existing implementations
- the task is greenfield or introduces a new subsystem with high design uncertainty
- the decision is expensive enough that external comparison could prevent rework
- existing internal patterns are weak, missing, or clearly not enough

Don't use when:
- the problem already has a de facto standard and you can state it directly
- the task is a small bugfix, text edit, or narrow tactical patch
- the user already knows the target shape and only needs a spec or implementation plan

## The Workflow

### Phase 0: Bypass Check

Before any external search, ask:

> Is this mostly a standard pattern I already know well enough to summarize without research?

If **yes**:
- write a short **De Facto Standard Brief**
- skip the rest

### Phase 1: Search the Best Summaries First

Do **not** default to cloning repos and spelunking source trees.

Use this source ladder:

1. **Secondary sources first**
   - engineering blogs
   - architecture teardowns
   - benchmarks
   - design writeups
   - issue/discussion summaries
2. **Project-facing materials**
   - README
   - docs
   - examples
   - issue / discussion pages
3. **Bounded repo inspection only if still necessary**
   - manifest / package file
   - docs folder
   - 1-3 key files max

If you cannot verify something, say so. Do not hallucinate comparison rows.

## Search Channels

Use the lightest tool that gives reliable signals:

- web search for blog posts, teardowns, and benchmarks
- `gh search repos` for candidate repositories
- `gh search code` or `gh api` for bounded GitHub follow-up

Prefer metadata and summarized analysis over raw source.

## Candidate Set Size

Keep it small:
- target **3-5** candidates
- use **2** if the landscape is already clear
- go above **5** only when the domain is unusually fragmented

## Comparison Dimensions

Only compare dimensions you can support with evidence:

- what problem the project solves
- workflow / architecture shape
- execution or orchestration model
- memory / retrieval / review approach
- strengths
- visible tradeoffs
- what is worth borrowing
- what should be avoided

If a dimension is unknown, mark it `unknown`.

## Output Artifacts

### 1. Full Landscape Brief

Save the full research artifact to:

`docs/engineering-knowledge-garden/archive/YYYY-MM-DD-<topic>-landscape.md`

Use the template in:
- `references/landscape-brief-template.md`

This is for human review and later retrieval, not for stuffing into downstream prompts.

### 2. Constraint & Guidance Brief

Pass only the compressed handoff downstream:

- **Borrow**
- **Avoid**
- **Preferred Shape**
- **Unknowns**

Use the template in:
- `references/constraint-guidance-brief-template.md`

This is the only part that should flow into `brainstorming` or `writing-plans`.

## Compression Rule

Never hand the entire landscape brief to downstream implementation skills unless the human explicitly asks for it.

Downstream should receive:
- the saved file path
- the short guidance brief

Not:
- long repo descriptions
- big comparison matrices
- raw notes from every candidate

## Knowledge Garden Integration

Treat landscape analysis as the **external intake** side of the knowledge loop:

- full brief → `engineering-knowledge-garden/archive/`
- distilled durable lessons later become:
  - `decision`
  - `pattern`
  - `pitfall`

Do not immediately promote every research note into evergreen knowledge.

## Red Flags

**Never:**
- read 7 repos deeply in one pass
- fabricate architecture details from README marketing text
- pass giant research artifacts into downstream prompts
- trigger external search for a trivial or standard problem

**Always:**
- do the bypass check first
- prefer secondary sources
- keep repo inspection bounded
- compress the handoff
- preserve uncertainty when evidence is incomplete

## Integration

- **superpowers:brainstorming** - use after this when behavior/spec is still unclear
- **superpowers:writing-plans** - use after this when the target shape is already clear enough to plan
- **superpowers:engineering-knowledge-garden** - archive full research and later distill durable entries
