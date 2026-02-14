import { describe, it, expect } from 'vitest';
import { getPoolSum, isPoolValid } from '../../core/domain/entities/Pool';
import type { PoolMember } from '../../core/domain/types/PoolingTypes';

describe('Pool Entity', () => {
    const surplusShip: PoolMember = { shipId: 'R002', cbBefore: 26308224 };
    const deficitShip: PoolMember = { shipId: 'R001', cbBefore: -6817560 };
    const bigDeficitShip: PoolMember = { shipId: 'R003', cbBefore: -87025320 };

    describe('getPoolSum', () => {
        it('should return sum of all member cbBefore values', () => {
            const members = [surplusShip, deficitShip];
            expect(getPoolSum(members)).toBe(26308224 + (-6817560));
        });

        it('should return 0 for empty members', () => {
            expect(getPoolSum([])).toBe(0);
        });

        it('should handle single member', () => {
            expect(getPoolSum([surplusShip])).toBe(26308224);
        });
    });

    describe('isPoolValid', () => {
        it('should return true when pool sum is positive', () => {
            expect(isPoolValid([surplusShip, deficitShip])).toBe(true);
        });

        it('should return true when pool sum is zero', () => {
            const zeroMember: PoolMember = { shipId: 'TEST', cbBefore: -26308224 };
            expect(isPoolValid([surplusShip, zeroMember])).toBe(true);
        });

        it('should return false when pool sum is negative', () => {
            expect(isPoolValid([deficitShip, bigDeficitShip])).toBe(false);
        });

        it('should return true for empty pool (sum = 0)', () => {
            expect(isPoolValid([])).toBe(true);
        });
    });
});
