import type { BankRecordDTO } from '../types/BankingTypes';

/**
 * BankEntry domain entity helpers
 */

/** Whether this ship has banked surplus available */
export const hasBankedSurplus = (record: BankRecordDTO): boolean => {
    return record.totalBanked > 0;
};
