import { describe, it, expect } from 'vitest';
import { NodeStrategy } from '../../lib/strategies/node.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('NodeStrategy', () => {
    describe('getCurrentVersion', () => {
        it('should read version from package.json', () => {
            const testPkgPath = path.join(__dirname, '../fixtures', 'package.json');
            const config = { packageFiles: [testPkgPath] };
            const strategy = new NodeStrategy(config);

            const version = strategy.getCurrentVersion();
            expect(version).toBe('1.2.3');
        });
    });

    describe('updateFiles', () => {
        it('should update version in package files', () => {
            const testPkgPath = path.join(__dirname, '../fixtures', 'test-package.json');
            const originalContent = JSON.stringify({ version: '1.0.0', name: 'test' }, null, 2) + '\n';
            fs.writeFileSync(testPkgPath, originalContent);

            const config = { packageFiles: [testPkgPath] };
            const strategy = new NodeStrategy(config);

            const updated = strategy.updateFiles('2.0.0');
            expect(updated).toEqual([testPkgPath]);

            const content = JSON.parse(fs.readFileSync(testPkgPath, 'utf8'));
            expect(content.version).toBe('2.0.0');

            // Cleanup
            fs.unlinkSync(testPkgPath);
        });

        it('should skip non-existent files', () => {
            const config = { packageFiles: ['non-existent.json'] };
            const strategy = new NodeStrategy(config);
            const updated = strategy.updateFiles('2.0.0');
            expect(updated).toEqual([]);
        });
    });
});
