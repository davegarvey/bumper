import { describe, it, expect } from 'vitest';
import { bumpVersion } from '../lib/versioner.js';

describe('versioner', () => {
    describe('bumpVersion', () => {
        it('should bump major version', () => {
            expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0');
        });

        it('should bump minor version', () => {
            expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
        });

        it('should bump patch version', () => {
            expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4');
        });

        it('should return same version for none', () => {
            expect(bumpVersion('1.2.3', 'none')).toBe('1.2.3');
        });
    });
});