import fs from 'fs';

export function getCurrentVersion(packagePath) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return pkg.version;
}

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

export function updatePackageFiles(files, newVersion) {
    const updated = [];

    for (const file of files) {
        if (fs.existsSync(file)) {
            const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
            pkg.version = newVersion;
            fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
            updated.push(file);
        }
    }

    return updated;
}