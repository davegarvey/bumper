# Bumper

Automatic semantic versioning based on conventional commits, optimized for AI-generated commit messages.

## Installation

```bash
npx @davegarvey/bumper
```

## Usage

```bash
# Run in your project root
npx @davegarvey/bumper

# Don't push to remote
npx @davegarvey/bumper --no-push
```

## Configuration

Create `.versionrc.json` in your project root:

```json
{
  "packageFiles": [
    "package.json",
    "client/package.json"
  ],
  "push": true
}
```

## GitHub Actions

```yaml
- name: Auto version
  run: npx @davegarvey/bumper
```

## How It Works

1. Analyzes commits since last tag
2. Determines version bump (major/minor/patch) based on conventional commits
3. Updates package.json files
4. Creates git commit and tag
5. Optionally pushes to remote

## Commit Types

- `feat:` → minor bump
- `fix:`, `refactor:`, `perf:` → patch bump
- Any type with `!` or `BREAKING CHANGE` → major bump
- `docs:`, `test:`, `chore:`, `config:` → no bump
