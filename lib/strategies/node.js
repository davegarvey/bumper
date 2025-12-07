import fs from 'fs';
import { BaseStrategy } from './base.js';

export class NodeStrategy extends BaseStrategy {
    getCurrentVersion() {
        // Use the first configured package file as the source of truth
        const mainFile = this.config.packageFiles[0];
        if (fs.existsSync(mainFile)) {
            const pkg = JSON.parse(fs.readFileSync(mainFile, 'utf8'));
            return pkg.version;
        }
        throw new Error(`Package file not found: ${mainFile}`);
    }

    updateFiles(newVersion) {
        const updated = [];
        for (const file of this.config.packageFiles) {
            if (fs.existsSync(file)) {
                const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
                pkg.version = newVersion;
                fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
                updated.push(file);
            }
        }
        return updated;
    }
}
