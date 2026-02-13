/**
 * Route domain types matching backend API responses
 */

export interface RouteDTO {
    id: string;
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline: boolean;
}

export interface ComparisonDTO {
    baselineRouteId: string;
    comparisonRouteId: string;
    baselineIntensity: number;
    comparisonIntensity: number;
    percentDiff: number;
    compliant: boolean;
}

export interface RouteFilters {
    vesselType?: string;
    fuelType?: string;
    year?: number;
}
