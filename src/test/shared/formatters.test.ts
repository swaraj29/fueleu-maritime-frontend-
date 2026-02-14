import { describe, it, expect } from 'vitest';
import {
    formatNumber,
    formatGHGIntensity,
    formatCB,
    formatPercentDiff,
    isSurplus,
    isDeficit,
} from '../../shared/utils/formatters';

describe('Formatters', () => {
    describe('formatNumber', () => {
        it('should format with default 2 decimals', () => {
            expect(formatNumber(1234567.89)).toBe('1,234,567.89');
        });

        it('should format with 0 decimals', () => {
            expect(formatNumber(1234567.89, 0)).toBe('1,234,568');
        });
    });

    describe('formatGHGIntensity', () => {
        it('should format with 4 decimal places and unit', () => {
            expect(formatGHGIntensity(89.3368)).toBe('89.3368 gCO₂e/MJ');
        });
    });

    describe('formatCB', () => {
        it('should format positive CB with + sign', () => {
            const result = formatCB(26308224);
            expect(result).toContain('+');
            expect(result).toContain('gCO₂eq');
        });

        it('should format negative CB with - sign', () => {
            const result = formatCB(-6817560);
            expect(result).toContain('-');
        });
    });

    describe('formatPercentDiff', () => {
        it('should format positive diff with + sign', () => {
            expect(formatPercentDiff(2.75)).toBe('+2.75%');
        });

        it('should format negative diff without + sign', () => {
            expect(formatPercentDiff(-3.3)).toBe('-3.30%');
        });
    });

    describe('isSurplus / isDeficit', () => {
        it('isSurplus returns true for positive', () => {
            expect(isSurplus(100)).toBe(true);
        });

        it('isDeficit returns true for negative', () => {
            expect(isDeficit(-100)).toBe(true);
        });
    });
});
