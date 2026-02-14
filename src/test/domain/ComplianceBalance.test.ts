import { describe, it, expect } from 'vitest';
import { isSurplus, isDeficit } from '../../core/domain/entities/ComplianceBalance';

describe('ComplianceBalance Entity', () => {
    describe('isSurplus', () => {
        it('should return true for positive CB', () => {
            expect(isSurplus(26308224)).toBe(true);
        });

        it('should return false for zero CB', () => {
            expect(isSurplus(0)).toBe(false);
        });

        it('should return false for negative CB', () => {
            expect(isSurplus(-6817560)).toBe(false);
        });
    });

    describe('isDeficit', () => {
        it('should return true for negative CB', () => {
            expect(isDeficit(-6817560)).toBe(true);
        });

        it('should return false for zero CB', () => {
            expect(isDeficit(0)).toBe(false);
        });

        it('should return false for positive CB', () => {
            expect(isDeficit(26308224)).toBe(false);
        });
    });
});
