import type { IPoolingRepository } from '../../../ports/outbound/IPoolingRepository';
import type { CreatePoolRequest, PoolMemberResult } from '../../../domain/types/PoolingTypes';
import type { AdjustedCBDTO } from '../../../domain/types/ComplianceTypes';

/**
 * Use case: Create a pool of ships for Article 21 pooling
 */
export const createPool = async (
    repo: IPoolingRepository,
    request: CreatePoolRequest,
): Promise<PoolMemberResult[]> => {
    return repo.createPool(request);
};

/**
 * Use case: Fetch adjusted CB for pooling display
 */
export const fetchAdjustedCB = async (
    repo: IPoolingRepository,
    shipId: string,
    year: number,
): Promise<AdjustedCBDTO> => {
    return repo.getAdjustedCB(shipId, year);
};
