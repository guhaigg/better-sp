# better-sp for Codex

Guide for using `better-sp` with OpenAI Codex via native skill discovery.

## Quick Install

Tell Codex:

```
Fetch and follow instructions from https://raw.githubusercontent.com/guhaigg/better-sp/refs/heads/main/.codex/INSTALL.md
```

## Manual Installation

### Prerequisites

- OpenAI Codex CLI
- Git

### Steps

1. Clone the repo:
   ```bash
   git clone https://github.com/guhaigg/better-sp.git ~/.codex/better-sp
   ```

2. Create or repoint the skills symlink:
   ```bash
   mkdir -p ~/.agents/skills
   rm -f ~/.agents/skills/superpowers
   ln -s ~/.codex/better-sp/skills ~/.agents/skills/superpowers
   ```

3. Restart Codex.

4. **For subagent skills** (optional): Skills like `dispatching-parallel-agents` and `subagent-driven-development` require Codex's multi-agent feature. Add to your Codex config:
   ```toml
   [features]
   multi_agent = true
   ```

### Windows

Use a junction instead of a symlink (works without Developer Mode):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
if (Test-Path "$env:USERPROFILE\.agents\skills\superpowers") {
  Remove-Item "$env:USERPROFILE\.agents\skills\superpowers" -Force
}
cmd /c mklink /J "$env:USERPROFILE\.agents\skills\superpowers" "$env:USERPROFILE\.codex\better-sp\skills"
```

## How It Works

Codex has native skill discovery — it scans `~/.agents/skills/` at startup, parses SKILL.md frontmatter, and loads skills on demand. `better-sp` becomes globally visible through the same mount shape upstream Superpowers uses:

```
~/.agents/skills/superpowers/ → ~/.codex/better-sp/skills/
```

The `using-superpowers` skill is discovered automatically and enforces skill usage discipline — no extra config needed.

**Why keep the mount name as `superpowers`?**
- Codex discovery cares about the mounted skill tree, not the GitHub repo name
- keeping one `superpowers` mount avoids duplicate discovery from `superpowers` + `better-sp`
- this lets `better-sp` behave as a drop-in global replacement

## Recommended Live Layout

For normal daily use, prefer a **stable clone** as the live skill source:

```text
~/.codex/better-sp
```

and keep the global mount:

```text
~/.agents/skills/superpowers
```

pointing at:

```text
~/.codex/better-sp/skills
```

Use a worktree target only while actively iterating on skill development. After validation, move the live mount back to the stable clone and restart Codex.

## Hard Switch from Original Superpowers

If you previously used:

```text
~/.codex/superpowers
```

the safe migration order is:

1. clone `better-sp` to `~/.codex/better-sp`
2. repoint `~/.agents/skills/superpowers` to `~/.codex/better-sp/skills`
3. restart Codex
4. only then remove the old `~/.codex/superpowers` clone

Do not delete the old repository first if any active worktree still depends on its Git metadata.

## Usage

Skills are discovered automatically. Codex activates them when:
- You mention a skill by name (e.g., "use brainstorming")
- The task matches a skill's description
- The `using-superpowers` skill directs Codex to use one

### Personal Skills

Create your own skills in `~/.agents/skills/`:

```bash
mkdir -p ~/.agents/skills/my-skill
```

Create `~/.agents/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: Use when [condition] - [what it does]
---

# My Skill

[Your skill content here]
```

The `description` field is how Codex decides when to activate a skill automatically — write it as a clear trigger condition.

## Updating

```bash
cd ~/.codex/better-sp && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/superpowers
```

**Windows (PowerShell):**
```powershell
Remove-Item "$env:USERPROFILE\.agents\skills\superpowers"
```

Optionally delete the clone: `rm -rf ~/.codex/better-sp` (Windows: `Remove-Item -Recurse -Force "$env:USERPROFILE\.codex\better-sp"`).

## Troubleshooting

### Skills not showing up

1. Verify the symlink: `ls -la ~/.agents/skills/superpowers`
2. Check skills exist: `ls ~/.codex/better-sp/skills`
3. Restart Codex — skills are discovered at startup

If you use a worktree, verify the junction points at the intended worktree path, not an older clone.

### Windows junction issues

Junctions normally work without special permissions. If creation fails, try running PowerShell as administrator.

## Getting Help

- Report issues: https://github.com/guhaigg/better-sp/issues
- Main documentation: https://github.com/guhaigg/better-sp
