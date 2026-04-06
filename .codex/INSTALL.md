# Installing better-sp for Codex

Enable `better-sp` in Codex via native skill discovery. The mechanism is the same as upstream Superpowers: point `~/.agents/skills/superpowers` at a skills directory, then restart Codex.

**Important:** keep the discovery mount name as `superpowers`. Do **not** create a second `better-sp` mount beside an existing `superpowers` mount, or Codex may discover duplicate skill trees.

## Prerequisites

- Git

## Installation

1. **Clone the better-sp repository:**
   ```bash
   git clone https://github.com/guhaigg/better-sp.git ~/.codex/better-sp
   ```

2. **Create or repoint the skills symlink/junction:**
   ```bash
   mkdir -p ~/.agents/skills
   rm -f ~/.agents/skills/superpowers
   ln -s ~/.codex/better-sp/skills ~/.agents/skills/superpowers
   ```

   **Windows (PowerShell):**
   ```powershell
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
   if (Test-Path "$env:USERPROFILE\.agents\skills\superpowers") {
     Remove-Item "$env:USERPROFILE\.agents\skills\superpowers" -Force
   }
   cmd /c mklink /J "$env:USERPROFILE\.agents\skills\superpowers" "$env:USERPROFILE\.codex\better-sp\skills"
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

4. **Optional: use a worktree instead of the clone root.** If you are iterating on a branch/worktree, the junction target may point directly at that worktree's `skills/` directory. The discovery mechanism is path-based.

## Migrating from old bootstrap

If you installed superpowers before native skill discovery, you need to:

1. **Clone or update better-sp:**
   ```bash
   cd ~/.codex/better-sp && git pull
   ```

2. **Repoint `~/.agents/skills/superpowers`** to `~/.codex/better-sp/skills` (step 2 above) — this is the discovery mechanism.

3. **Remove the old bootstrap block** from `~/.codex/AGENTS.md` — any block referencing `superpowers-codex bootstrap` is no longer needed.

4. **Restart Codex.**

## Verify

```bash
ls -la ~/.agents/skills/superpowers
```

You should see a symlink (or junction on Windows) pointing to your `better-sp` skills directory.

## Updating

```bash
cd ~/.codex/better-sp && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/superpowers
```

Optionally delete the clone: `rm -rf ~/.codex/better-sp`.
