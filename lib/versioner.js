export function bumpVersion(currentVersion, bumpType) {
    const parts = currentVersion.split('.').map(Number);

    switch (bumpType) {
        case 'major':
            return `${parts[0] + 1}.0.0`;
        case 'minor':
            return `${parts[0]}.${parts[1] + 1}.0`;
        case 'patch':
            return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
        default:
            return currentVersion;
    }
}