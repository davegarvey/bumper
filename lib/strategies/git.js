import { BaseStrategy } from './base.js';
import { getLastTag } from '../git.js';

export class GitStrategy extends BaseStrategy {
    getCurrentVersion() {
        const lastTag = getLastTag();
        if (!lastTag) {
            return '0.0.0'; // Default if no tags exist
        }

        // Remove prefix if present
        const prefix = this.config.tagPrefix || 'v';
        if (lastTag.startsWith(prefix)) {
            return lastTag.substring(prefix.length);
        }

        return lastTag;
    }

    // eslint-disable-next-line no-unused-vars
    updateFiles(newVersion) {
        // Git strategy doesn't update any files
        return [];
    }
}
