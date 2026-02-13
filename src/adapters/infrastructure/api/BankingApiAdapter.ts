import type { IBankingRepository } from '../../../core/ports/outbound/IBankingRepository';
import type { ComplianceBalanceDTO, AdjustedCBDTO } from '../../../core/domain/types/ComplianceTypes';
import type {
    BankRecordDTO,
    BankSurplusRequest,
    BankSurplusResponse,
    ApplyBankedRequest,
    ApplyBankedResponse,
} from '../../../core/domain/types/BankingTypes';
import apiClient from './apiClient';

/**
 * Banking API adapter implementing IBankingRepository (functional)
 */
export const bankingApi: IBankingRepository = {
    getComplianceBalance: async (shipId: string, year: number): Promise<ComplianceBalanceDTO> => {
        const { data } = await apiClient.get<ComplianceBalanceDTO>('/compliance/cb', {
            params: { shipId, year },
        });
        return data;
    },

    getAdjustedCB: async (shipId: string, year: number): Promise<AdjustedCBDTO> => {
        const { data } = await apiClient.get<AdjustedCBDTO>('/compliance/adjusted-cb', {
            params: { shipId, year },
        });
        return data;
    },

    getBankRecords: async (shipId: string, year: number): Promise<BankRecordDTO> => {
        const { data } = await apiClient.get<BankRecordDTO>('/banking/records', {
            params: { shipId, year },
        });
        return data;
    },

    bankSurplus: async (request: BankSurplusRequest): Promise<BankSurplusResponse> => {
        const { data } = await apiClient.post<BankSurplusResponse>('/banking/bank', request);
        return data;
    },

    applyBanked: async (request: ApplyBankedRequest): Promise<ApplyBankedResponse> => {
        const { data } = await apiClient.post<ApplyBankedResponse>('/banking/apply', request);
        return data;
    },
};
