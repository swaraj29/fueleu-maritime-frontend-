import { describe, it, expect } from 'vitest';
import { isCompliant, getEnergyInScope } from '../../core/domain/entities/Route';
import type { RouteDTO } from '../../core/domain/types/RouteTypes';

const mockRoute: RouteDTO = {
    id: 'uuid-1',
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
};

describe('Route Entity', () => {
    describe('isCompliant', () => {
        it('should return true when ghgIntensity is below target', () => {
            const compliantRoute = { ...mockRoute, ghgIntensity: 88.0 };
            expect(isCompliant(compliantRoute, 89.3368)).toBe(true);
        });

        it('should return true when ghgIntensity equals target', () => {
            const exactRoute = { ...mockRoute, ghgIntensity: 89.3368 };
            expect(isCompliant(exactRoute, 89.3368)).toBe(true);
        });

        it('should return false when ghgIntensity exceeds target', () => {
            expect(isCompliant(mockRoute, 89.3368)).toBe(false);
        });
    });

    describe('getEnergyInScope', () => {
        it('should calculate energy as fuelConsumption × 41000', () => {
            expect(getEnergyInScope(mockRoute)).toBe(5000 * 41000);
        });

        it('should return 205000000 for fuelConsumption of 5000', () => {
            expect(getEnergyInScope(mockRoute)).toBe(205_000_000);
        });
    });
});
