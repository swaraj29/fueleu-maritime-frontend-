import type { ComplianceBalanceDTO, AdjustedCBDTO } from '../../domain/types/ComplianceTypes';
import type {
    BankRecordDTO,
    BankSurplusRequest,
    BankSurplusResponse,
    ApplyBankedRequest,
    ApplyBankedResponse,
} from '../../domain/types/BankingTypes';

/**
 * Outbound port for Banking and Compliance data access
 * Implemented by infrastructure API adapter
 */
export interface IBankingRepository {
    getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalanceDTO>;
    getAdjustedCB(shipId: string, year: number): Promise<AdjustedCBDTO>;
    getBankRecords(shipId: string, year: number): Promise<BankRecordDTO>;
    bankSurplus(request: BankSurplusRequest): Promise<BankSurplusResponse>;
    applyBanked(request: ApplyBankedRequest): Promise<ApplyBankedResponse>;
}
