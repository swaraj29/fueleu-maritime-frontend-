import type { RouteDTO } from '../types/RouteTypes';

/**
 * Route domain entity helpers
 */

/** Check if a route is compliant with a given target intensity */
export const isCompliant = (route: RouteDTO, targetIntensity: number): boolean => {
    return route.ghgIntensity <= targetIntensity;
};

/** Get energy in scope (MJ) = fuelConsumption × 41,000 */
export const getEnergyInScope = (route: RouteDTO): number => {
    return route.fuelConsumption * 41_000;
};
