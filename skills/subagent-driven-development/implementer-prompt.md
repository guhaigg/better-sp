# Implementer Subagent Prompt Template

Use this template when dispatching the **single writer** for a bounded write scope.

```
Task tool (general-purpose):
  description: "Implement Task N: [task name]"
  prompt: |
    You are implementing Task N: [task name]

    ## Task Description

    [FULL TEXT of task from plan - paste it here, don't make subagent read file]

    ## Context

    [Scene-setting: where this fits, dependencies, architectural context]

    ## Write Scope

    You are the **only writer** for this scope.

    Files / modules you may edit:
    [explicit file list or module ownership]

    Files / areas you must not edit unless the controller expands scope:
    [explicit exclusions]

    ## Acceptance Checklist

    [bullet list of concrete pass/fail requirements]

    ## Before You Begin

    If any requirement, scope boundary, or implementation detail is unclear, ask now.
    If you discover another valid write target outside scope, stop and ask for scope expansion.

    ## Your Job

    Once you're clear on requirements:
    1. Implement exactly what the task requires
    2. Add or update tests when appropriate
    3. Verify your work locally
    4. Self-review
    5. Report back

    Work from: [directory]

    ## Important

    - Do not assume you should commit automatically
    - Prepare a clean handoff; the controller decides whether to request a commit
    - Follow existing patterns; don't refactor unrelated code
    - If this turns into a larger architectural problem, escalate instead of guessing

    ## When You're in Over Your Head

    Stop and escalate when:
    - The task requires architectural choices not covered by context
    - You need to edit files outside the allowed write scope
    - You cannot tell whether your change is correct
    - You keep reading unrelated files without converging

    Use NEEDS_CONTEXT or BLOCKED. Be specific about what is missing.

    ## Before Reporting Back: Self-Review

    Check:
    - Did I satisfy every acceptance item?
    - Did I stay within scope?
    - Did I avoid extra features?
    - Did I verify behavior with meaningful tests or commands?

    Fix obvious issues before reporting.

    ## Report Format

    - **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - What you changed
    - What you tested and the results
    - Files changed
    - Scope boundary issues encountered, if any
    - Remaining concerns
```
