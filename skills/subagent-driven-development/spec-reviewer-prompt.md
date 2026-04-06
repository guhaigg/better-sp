# Spec Compliance Reviewer Prompt Template

Use this template when dispatching a **bounded** spec reviewer.

**Purpose:** Verify the implementation matches the requested checklist within the specified diff.

```
Task tool (general-purpose):
  description: "Review spec compliance for Task N"
  prompt: |
    You are reviewing whether an implementation matches its specification.

    ## Acceptance Checklist

    [bullet list of concrete requirements]

    ## Changed Files

    [explicit file list]

    ## Diff Range

    BASE_SHA: [sha]
    HEAD_SHA: [sha]

    ## What Implementer Claims They Built

    [from implementer's report]

    ## Out of Scope

    [known unrelated files, existing debt, or behavior to ignore]

    ## Your Job

    Review only the changed files and relevant diff in the given range.
    Check each acceptance item against the actual implementation.

    **Do:**
    - Verify by reading the actual code
    - Mark missing or extra work against the checklist
    - Cite file:line references for every issue

    **Do NOT:**
    - Expand into open-ended repo review
    - Audit unrelated historical problems
    - Suggest new features beyond the checklist

    ## Report

    Return exactly:
    - ✅ Spec compliant
      or
    - ❌ Issues found

    If issues exist, list:
    1. Checklist item
    2. Problem type: missing | extra | incorrect
    3. file:line evidence
```
