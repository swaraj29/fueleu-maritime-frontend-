import type { IPoolingRepository } from '../../../core/ports/outbound/IPoolingRepository';
import type { CreatePoolRequest, PoolMemberResult } from '../../../core/domain/types/PoolingTypes';
import type { AdjustedCBDTO } from '../../../core/domain/types/ComplianceTypes';
import apiClient from './apiClient';

/**
 * Pooling API adapter implementing IPoolingRepository (functional)
 */
export const poolingApi: IPoolingRepository = {
    getAdjustedCB: async (shipId: string, year: number): Promise<AdjustedCBDTO> => {
        const { data } = await apiClient.get<AdjustedCBDTO>('/compliance/adjusted-cb', {
            params: { shipId, year },
        });
        return data;
    },

    createPool: async (request: CreatePoolRequest): Promise<PoolMemberResult[]> => {
        const { data } = await apiClient.post<PoolMemberResult[]>('/pools', request);
        return data;
    },
};
