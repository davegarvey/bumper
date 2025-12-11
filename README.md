# Bumper

[![CI](https://github.com/davegarvey/bumper/actions/workflows/ci.yml/badge.svg)](https://github.com/davegarvey/bumper/actions/workflows/ci.yml)
[![Release](https://github.com/davegarvey/bumper/actions/workflows/release.yml/badge.svg)](https://github.com/davegarvey/bumper/actions/workflows/release.yml)
[![Version](https://img.shields.io/github/v/release/davegarvey/bumper)](https://github.com/davegarvey/bumper/releases)
[![Rust](https://img.shields.io/badge/rust-1.70%2B-orange)](https://www.rust-lang.org/)

Automatic semantic versioning based on conventional commits, optimised for AI-generated commit messages.

## Installation

### Pre-built Binaries (Recommended)

Download from [GitHub Releases](https://github.com/davegarvey/bumper/releases):

```bash
# Linux x86_64
curl -L https://github.com/davegarvey/bumper/releases/download/v2.3.1/bumper-linux-x86_64.tar.gz | tar xz
sudo mv bumper /usr/local/bin/

# macOS Intel
curl -L https://github.com/davegarvey/bumper/releases/download/v2.3.1/bumper-macos-x86_64.tar.gz | tar xz
sudo mv bumper /usr/local/bin/

# macOS Apple Silicon
curl -L https://github.com/davegarvey/bumper/releases/download/v2.3.1/bumper-macos-aarch64.tar.gz | tar xz
sudo mv bumper /usr/local/bin/

# Windows
curl -L https://github.com/davegarvey/bumper/releases/download/v2.3.1/bumper-windows-x86_64.zip -o bumper.zip
unzip bumper.zip
# Add to PATH
```

### Cargo Install

```bash
cargo install bumper
```

### GitHub Action

```yaml
uses: davegarvey/bumper@v1
```

### From Source

```bash
git clone https://github.com/davegarvey/bumper.git
cd bumper
cargo build --release
# Binary available at target/release/bumper
```

## Usage

```bash
# Run in your project root
bumper

# Push to remote
bumper --push

# Create git tag
bumper --tag

# Raw mode (output only version, dry run)
bumper --raw

# With explicit options overrides
bumper --tag --tag-prefix "release-v"
bumper --commit-prefix "chore(release): bump"
bumper --preset git --tag
bumper --release-notes --tag
bumper --package-files "Cargo.toml,client/Cargo.toml"

# Show help
bumper --help
```

## Configuration

You can use a file-based configuration for Bumper instead of CLI arguments.

Create `.versionrc.json` in your project root:

```json
{
  "packageFiles": ["Cargo.toml", "client/Cargo.toml"],
  "commitPrefix": "chore: bump version",
  "tagPrefix": "v",
  "push": false,
  "tag": false,
  "preset": "rust"
}
```

### Configuration Options

- **`packageFiles`**: Array of Cargo.toml files to update (default: `["Cargo.toml"]`)
- **`commitPrefix`**: Prefix for version bump commits (default: `"chore: bump version"`)
- **`tagPrefix`**: Prefix for git tags (default: `"v"`)
- **`push`**: Whether to push commits/tags to remote (default: `false`)
- **`tag`**: Whether to create git tags for versions (default: `false`)
- **`preset`**: Versioning strategy to use (default: `"rust"`). Options:
  - `"rust"`: Updates `Cargo.toml` version field
  - `"git"`: Tracks version via git tags only (no file updates)
  - `"node"`: Updates `package.json` version field

### Best Practices

- **Branch Protection**: Protect your main branch and require CI checks to pass
- **Conventional Commits**: Ensure all commits follow [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/)
- **Monorepos**: Use `packageFiles` array for multiple packages
- **CI Permissions**: Grant write access to contents/commits for automated releases

## GitHub Actions

### Recommended: Use GitHub Action (Simplest)

```yaml
name: Release
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  release:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: read
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    - uses: davegarvey/bumper@v1
      with:
        push: true
        tag: true
```

### Alternative: Manual Setup

If you prefer more control over the process:

```yaml
name: Release
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  release:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    permissions:
      contents: write      # Required for pushing commits/tags
      pull-requests: read  # Required for PR info
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0  # Required for commit analysis
    - name: Setup Rust
      uses: actions-rust-lang/setup-rust-toolchain@v1
      with:
        toolchain: stable
    - name: Run tests
      run: cargo test
    - name: Run clippy
      run: cargo clippy -- -D warnings
    - name: Configure Git
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
    - name: Install bumper
      run: cargo install bumper
    - name: Bump version and release
      run: bumper --push --tag
```

### CI Best Practices

- **Permissions**: Add `contents: write` permission for automated commits/tags
- **Branch Protection**: Require CI checks and restrict direct pushes to main
- **Testing**: Always run `cargo test` and `cargo clippy` before releasing
- **Fetch Depth**: Use `fetch-depth: 0` for complete commit history analysis

## How It Works

1. Analyzes commits since last tag
2. Determines version bump (major/minor/patch) based on conventional commits
3. Updates Cargo.toml files
4. Creates git commit
5. Optionally creates git tag
6. Optionally pushes to remote

## Commit Types

- `feat:` → minor bump
- `fix:`, `refactor:`, `perf:` → patch bump
- Any type with `!` or `BREAKING CHANGE` → major bump
- `docs:`, `test:`, `chore:`, `config:` → no bump

## Troubleshooting

### Common Issues

**"Author identity unknown"**

- **Solution**: Configure git identity in CI before running bumper
- **Example**: Add git config step as shown in CI workflow

**"bumper: command not found"**

- **Solution**: Install bumper before running: `cargo install bumper`
- **Why**: Ensure the binary is in PATH or use full path

**No version bump on merge**

- **Check**: Ensure PR contains conventional commits with `feat:`, `fix:`, etc.
- **Check**: Verify CI has write permissions to repository
- **Check**: Confirm `fetch-depth: 0` in checkout action

**Invalid config file**

- **Solution**: Ensure `.versionrc.json` contains valid JSON
- **Note**: Empty or invalid files fall back to defaults with a warning

**Cargo.toml not found**

- **Solution**: Use `--package-files` to specify correct Cargo.toml paths
- **Check**: Verify file exists and contains valid `version` field

### Getting Help

- Check commit format with conventional commits specification
- Verify CI permissions and branch protection rules
- Test locally with `bumper` for debugging (pushing is disabled by default)
- Run `cargo test` to verify your project setup

## For AI Users

This tool is optimised for AI-generated commit messages that follow conventional commit format. See [.github/prompts/sc.prompt.md](.github/prompts/sc.prompt.md) for an example prompt that generates commits compatible with bumper.
