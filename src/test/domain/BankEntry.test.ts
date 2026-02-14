import { describe, it, expect } from 'vitest';
import { hasBankedSurplus } from '../../core/domain/entities/BankEntry';
import type { BankRecordDTO } from '../../core/domain/types/BankingTypes';

describe('BankEntry Entity', () => {
    describe('hasBankedSurplus', () => {
        it('should return true when totalBanked is positive', () => {
            const record: BankRecordDTO = { shipId: 'R002', year: 2024, totalBanked: 26308224 };
            expect(hasBankedSurplus(record)).toBe(true);
        });

        it('should return false when totalBanked is zero', () => {
            const record: BankRecordDTO = { shipId: 'R001', year: 2024, totalBanked: 0 };
            expect(hasBankedSurplus(record)).toBe(false);
        });

        it('should return false when totalBanked is negative', () => {
            const record: BankRecordDTO = { shipId: 'R001', year: 2024, totalBanked: -100 };
            expect(hasBankedSurplus(record)).toBe(false);
        });
    });
});
