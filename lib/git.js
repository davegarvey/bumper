import { execSync } from 'child_process';

// Environment variables to prevent git from waiting for interactive input
const GIT_ENV = {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',           // Disable git credential prompts
    GIT_SSH_COMMAND: 'ssh -o BatchMode=yes', // Disable SSH interactive prompts
    GIT_ASKPASS: '',                    // Disable askpass helper
    SSH_ASKPASS: '',                    // Disable SSH askpass
};

function runGitCommand(cmd, options = {}) {
    try {
        return execSync(cmd, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
            env: GIT_ENV,
            timeout: 30000,  // 30 second timeout to catch hangs
            ...options
        });
    } catch (error) {
        if (error.killed && error.signal === 'SIGTERM') {
            throw new Error(`Git command timed out (30s): ${cmd}\nThis usually means git is waiting for interactive input (credentials, confirmation, etc.)`);
        }
        const stderr = error.stderr?.toString().trim() || '';
        const stdout = error.stdout?.toString().trim() || '';
        const message = stderr || stdout || error.message;
        throw new Error(`Git command failed: ${cmd}\n${message}`);
    }
}

export function getLastTag() {
    try {
        return runGitCommand('git describe --tags --abbrev=0').trim();
    } catch {
        return null;
    }
}

export function getCommitsSinceTag(lastTag) {
    const cmd = lastTag
        ? `git log ${lastTag}..HEAD --pretty=%s`
        : 'git log --pretty=%s';

    return runGitCommand(cmd)
        .trim()
        .split('\n')
        .filter(msg => msg.trim() !== '');
}

export function commitChanges(version, files, options = {}) {
    const prefix = options.commitPrefix || 'chore: bump version';
    // If prefix ends with a colon, ensure strict spacing, otherwise assume user provided full prefix format
    // But simplified behavior: just string interpolation.
    // The default is 'chore: bump version', so the commit message becomes "chore: bump version to 1.2.3"
    // If options.commitPrefix is "chore(release):", message = "chore(release): to 1.2.3" ?
    // Let's assume the prefix should replace the "chore: bump version" part.

    // Existing: `git commit -m "chore: bump version to ${version}"`
    // If commitPrefix is provided, usage: `${prefix} to ${version}` ? 
    // Or does commitPrefix include the whole message structure?
    // "commitPrefix": "chore: bump version" (default) -> "chore: bump version to <ver>"

    runGitCommand(`git add ${files.join(' ')}`);
    runGitCommand(`git commit -m "${prefix} to ${version}"`);
}

export function createTag(version, options = {}, message = null) {
    const prefix = options.tagPrefix || 'v';
    const tagName = `${prefix}${version}`;
    if (message) {
        runGitCommand(`git tag -a "${tagName}" -m "${message}"`);
    } else {
        runGitCommand(`git tag "${tagName}"`);
    }
}

export function push() {
    runGitCommand('git push && git push --tags');
}