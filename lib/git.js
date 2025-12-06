import { execSync } from 'child_process';

export function getLastTag() {
    try {
        return execSync('git describe --tags --abbrev=0', {
            encoding: 'utf8'
        }).trim();
    } catch {
        return null;
    }
}

export function getCommitsSinceTag(lastTag) {
    const cmd = lastTag
        ? `git log ${lastTag}..HEAD --pretty=%s`
        : 'git log --pretty=%s';

    return execSync(cmd, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(msg => msg.trim() !== '');
}

export function commitChanges(version, files) {
    execSync(`git add ${files.join(' ')}`);
    execSync(`git commit -m "chore: bump version to ${version}"`);
}

export function createTag(version) {
    execSync(`git tag v${version}`);
}

export function push() {
    execSync('git push && git push --tags');
}