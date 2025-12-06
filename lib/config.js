import fs from 'fs';
import path from 'path';

const DEFAULT_CONFIG = {
    packageFiles: ['package.json'],
    commitPrefix: 'chore: bump version',
    tagPrefix: 'v',
    push: true
};

export function loadConfig(cwd = process.cwd()) {
    const configPath = path.join(cwd, '.versionrc.json');

    if (fs.existsSync(configPath)) {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return { ...DEFAULT_CONFIG, ...userConfig };
    }

    return DEFAULT_CONFIG;
}