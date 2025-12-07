import { NodeStrategy } from './node.js';
import { GitStrategy } from './git.js';

export function loadStrategy(config) {
    // If raw mode is enabled via config (or override), force Git strategy
    if (config.raw) {
        return new GitStrategy(config);
    }

    switch (config.preset) {
        case 'node':
            return new NodeStrategy(config);
        case 'git': // Explicit git preset if desired
            return new GitStrategy(config);
        default:
            // Default to Node for backward compatibility if preset is missing/unknown
            // Or throw error? For now, let's fallback to Node or throw if strictly unknown.
            // Given the refactor, let's default to Node to match existing behavior.
            return new NodeStrategy(config);
    }
}
