import { describe, it, expect, vi } from 'vitest';
import { createPool, fetchAdjustedCB } from '../../core/application/usecases/pooling/PoolingUseCases';
import type { IPoolingRepository } from '../../core/ports/outbound/IPoolingRepository';

const mockRepo: IPoolingRepository = {
    getAdjustedCB: vi.fn().mockResolvedValue({ originalCB: -6817560, adjustedCB: -6817560 }),
    createPool: vi.fn().mockResolvedValue([
        { shipId: 'R002', cbBefore: 26308224, cbAfter: 19490664, year: 2024 },
        { shipId: 'R001', cbBefore: -6817560, cbAfter: 0, year: 2024 },
    ]),
};

describe('Pooling Use Cases', () => {
    describe('createPool', () => {
        it('should create pool and return member results', async () => {
            const request = {
                members: [
                    { shipId: 'R002', cbBefore: 26308224 },
                    { shipId: 'R001', cbBefore: -6817560 },
                ],
                year: 2024,
            };

            const result = await createPool(mockRepo, request);
            expect(result).toHaveLength(2);
            expect(result[0].cbAfter).toBe(19490664);
            expect(result[1].cbAfter).toBe(0);
            expect(mockRepo.createPool).toHaveBeenCalledWith(request);
        });
    });

    describe('fetchAdjustedCB', () => {
        it('should return adjusted CB from repository', async () => {
            const result = await fetchAdjustedCB(mockRepo, 'R001', 2024);
            expect(result.originalCB).toBe(-6817560);
            expect(result.adjustedCB).toBe(-6817560);
        });
    });
});
