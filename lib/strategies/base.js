export class BaseStrategy {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get the current version of the project.
     * @returns {string} The current version string (e.g., "1.0.0").
     */
    getCurrentVersion() {
        throw new Error('getCurrentVersion must be implemented via subclass');
    }

    /**
     * Update project files with the new version.
     * @param {string} newVersion - The new version string.
     * @returns {string[]} List of files updated.
     */
    // eslint-disable-next-line no-unused-vars
    updateFiles(newVersion) {
        throw new Error('updateFiles must be implemented via subclass');
    }
}
