import type { CreatePoolRequest, PoolMemberResult } from '../../domain/types/PoolingTypes';
import type { AdjustedCBDTO } from '../../domain/types/ComplianceTypes';

/**
 * Outbound port for Pooling data access
 * Implemented by infrastructure API adapter
 */
export interface IPoolingRepository {
    getAdjustedCB(shipId: string, year: number): Promise<AdjustedCBDTO>;
    createPool(request: CreatePoolRequest): Promise<PoolMemberResult[]>;
}
