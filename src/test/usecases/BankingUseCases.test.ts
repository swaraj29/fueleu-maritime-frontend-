import { describe, it, expect, vi } from 'vitest';
import {
    fetchComplianceBalance,
    bankSurplus,
    applyBanked,
    fetchBankRecords,
} from '../../core/application/usecases/banking/BankingUseCases';
import type { IBankingRepository } from '../../core/ports/outbound/IBankingRepository';

const mockRepo: IBankingRepository = {
    getComplianceBalance: vi.fn().mockResolvedValue({ cb: -6817560 }),
    getAdjustedCB: vi.fn().mockResolvedValue({ originalCB: -6817560, adjustedCB: -1817560 }),
    getBankRecords: vi.fn().mockResolvedValue({ shipId: 'R002', year: 2024, totalBanked: 26308224 }),
    bankSurplus: vi.fn().mockResolvedValue({ bankedAmount: 26308224 }),
    applyBanked: vi.fn().mockResolvedValue({ cb_before: -6817560, applied: 5000000, cb_after: -1817560 }),
};

describe('Banking Use Cases', () => {
    describe('fetchComplianceBalance', () => {
        it('should return CB from repository', async () => {
            const result = await fetchComplianceBalance(mockRepo, 'R001', 2024);
            expect(result.cb).toBe(-6817560);
            expect(mockRepo.getComplianceBalance).toHaveBeenCalledWith('R001', 2024);
        });
    });

    describe('bankSurplus', () => {
        it('should bank surplus via repository', async () => {
            const result = await bankSurplus(mockRepo, 'R002', 2024);
            expect(result.bankedAmount).toBe(26308224);
            expect(mockRepo.bankSurplus).toHaveBeenCalledWith({ shipId: 'R002', year: 2024 });
        });
    });

    describe('applyBanked', () => {
        it('should apply banked surplus and return before/after CB', async () => {
            const result = await applyBanked(mockRepo, 'R001', 2024, 5000000);
            expect(result.cb_before).toBe(-6817560);
            expect(result.applied).toBe(5000000);
            expect(result.cb_after).toBe(-1817560);
            expect(mockRepo.applyBanked).toHaveBeenCalledWith({
                shipId: 'R001', year: 2024, amount: 5000000,
            });
        });
    });

    describe('fetchBankRecords', () => {
        it('should return bank records from repository', async () => {
            const result = await fetchBankRecords(mockRepo, 'R002', 2024);
            expect(result.totalBanked).toBe(26308224);
            expect(result.shipId).toBe('R002');
        });
    });
});
