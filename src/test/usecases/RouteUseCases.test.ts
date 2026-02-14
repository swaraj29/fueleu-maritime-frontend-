import { describe, it, expect, vi } from 'vitest';
import { fetchRoutes, setBaseline, fetchComparison } from '../../core/application/usecases/routes/RouteUseCases';
import type { IRouteRepository } from '../../core/ports/outbound/IRouteRepository';
import type { RouteDTO } from '../../core/domain/types/RouteTypes';

const mockRoutes: RouteDTO[] = [
    {
        id: '1', routeId: 'R001', vesselType: 'Container', fuelType: 'HFO',
        year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000,
        totalEmissions: 4500, isBaseline: true,
    },
    {
        id: '2', routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG',
        year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500,
        totalEmissions: 4200, isBaseline: false,
    },
    {
        id: '3', routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO',
        year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800,
        totalEmissions: 4300, isBaseline: false,
    },
];

const mockRepo: IRouteRepository = {
    fetchAll: vi.fn().mockResolvedValue(mockRoutes),
    setBaseline: vi.fn().mockResolvedValue({ message: 'Baseline updated' }),
    fetchComparison: vi.fn().mockResolvedValue([
        {
            baselineRouteId: 'R001', comparisonRouteId: 'R002',
            baselineIntensity: 91.0, comparisonIntensity: 88.0,
            percentDiff: -3.3, compliant: true,
        },
    ]),
};

describe('Route Use Cases', () => {
    describe('fetchRoutes', () => {
        it('should return all routes when no filters', async () => {
            const result = await fetchRoutes(mockRepo);
            expect(result).toHaveLength(3);
            expect(mockRepo.fetchAll).toHaveBeenCalled();
        });

        it('should filter by vesselType', async () => {
            const result = await fetchRoutes(mockRepo, { vesselType: 'Container' });
            expect(result).toHaveLength(1);
            expect(result[0].routeId).toBe('R001');
        });

        it('should filter by fuelType', async () => {
            const result = await fetchRoutes(mockRepo, { fuelType: 'LNG' });
            expect(result).toHaveLength(1);
            expect(result[0].routeId).toBe('R002');
        });

        it('should filter by year', async () => {
            const result = await fetchRoutes(mockRepo, { year: 2025 });
            expect(result).toHaveLength(1);
            expect(result[0].routeId).toBe('R004');
        });

        it('should apply multiple filters', async () => {
            const result = await fetchRoutes(mockRepo, { vesselType: 'Container', year: 2024 });
            expect(result).toHaveLength(1);
            expect(result[0].routeId).toBe('R001');
        });

        it('should return empty array when no matches', async () => {
            const result = await fetchRoutes(mockRepo, { vesselType: 'Tanker', year: 2025 });
            expect(result).toHaveLength(0);
        });
    });

    describe('setBaseline', () => {
        it('should call setBaseline on repository', async () => {
            const result = await setBaseline(mockRepo, 'R001');
            expect(result.message).toBe('Baseline updated');
            expect(mockRepo.setBaseline).toHaveBeenCalledWith('R001');
        });
    });

    describe('fetchComparison', () => {
        it('should return comparison data from repository', async () => {
            const result = await fetchComparison(mockRepo);
            expect(result).toHaveLength(1);
            expect(result[0].compliant).toBe(true);
            expect(result[0].percentDiff).toBe(-3.3);
        });
    });
});
