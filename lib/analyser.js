const BUMP_COMMIT_PREFIX = 'chore: bump version';

export function analyseCommits(commits) {
    const substantiveCommits = commits.filter(
        msg => !msg.startsWith(BUMP_COMMIT_PREFIX)
    );

    if (substantiveCommits.length === 0) {
        return { bump: 'none', triggeringCommits: [] };
    }

    let bump = 'none';
    const triggeringCommits = [];
    const commitTypeRegex = /^(feat|fix|refactor|perf|docs|test|chore|config)(?:\([^)]+\))?(!?):/;

    for (const msg of substantiveCommits) {
        const match = msg.match(commitTypeRegex);
        if (!match) continue;

        const [, type, hasExclamation] = match;
        const hasBreaking = hasExclamation === '!' ||
            msg.toLowerCase().includes('breaking change');

        let commitBump = 'none';
        if (hasBreaking) {
            commitBump = 'major';
        } else if (type === 'feat') {
            commitBump = 'minor';
        } else if (['fix', 'refactor', 'perf'].includes(type)) {
            commitBump = 'patch';
        }

        // Update overall bump (major > minor > patch)
        if (commitBump === 'major' ||
            (commitBump === 'minor' && bump !== 'major') ||
            (commitBump === 'patch' && bump === 'none')) {
            bump = commitBump;
        }

        if (commitBump !== 'none') {
            const label = commitBump.charAt(0).toUpperCase() + commitBump.slice(1);
            triggeringCommits.push(`${label}: ${msg}`);
        }
    }

    return { bump, triggeringCommits };
}