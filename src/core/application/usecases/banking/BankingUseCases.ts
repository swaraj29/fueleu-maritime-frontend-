import type { IBankingRepository } from '../../../ports/outbound/IBankingRepository';
import type { ComplianceBalanceDTO } from '../../../domain/types/ComplianceTypes';
import type {
    BankRecordDTO,
    BankSurplusResponse,
    ApplyBankedResponse,
} from '../../../domain/types/BankingTypes';

/**
 * Use case: Fetch compliance balance for a ship
 */
export const fetchComplianceBalance = async (
    repo: IBankingRepository,
    shipId: string,
    year: number,
): Promise<ComplianceBalanceDTO> => {
    return repo.getComplianceBalance(shipId, year);
};

/**
 * Use case: Bank positive CB surplus (Article 20)
 */
export const bankSurplus = async (
    repo: IBankingRepository,
    shipId: string,
    year: number,
): Promise<BankSurplusResponse> => {
    return repo.bankSurplus({ shipId, year });
};

/**
 * Use case: Apply banked surplus to a deficit ship
 */
export const applyBanked = async (
    repo: IBankingRepository,
    shipId: string,
    year: number,
    amount: number,
): Promise<ApplyBankedResponse> => {
    return repo.applyBanked({ shipId, year, amount });
};

/**
 * Use case: Fetch bank records for a ship
 */
export const fetchBankRecords = async (
    repo: IBankingRepository,
    shipId: string,
    year: number,
): Promise<BankRecordDTO> => {
    return repo.getBankRecords(shipId, year);
};
