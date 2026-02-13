import type { IRouteRepository } from '../../../ports/outbound/IRouteRepository';
import type { RouteDTO, ComparisonDTO, RouteFilters } from '../../../domain/types/RouteTypes';

/**
 * Use case: Fetch and optionally filter all routes
 */
export const fetchRoutes = async (
    routeRepo: IRouteRepository,
    filters?: RouteFilters,
): Promise<RouteDTO[]> => {
    const routes = await routeRepo.fetchAll();

    if (!filters) return routes;

    return routes.filter((route: RouteDTO) => {
        if (filters.vesselType && route.vesselType !== filters.vesselType) return false;
        if (filters.fuelType && route.fuelType !== filters.fuelType) return false;
        if (filters.year && route.year !== filters.year) return false;
        return true;
    });
};

/**
 * Use case: Set a route as the baseline for comparisons
 */
export const setBaseline = async (
    routeRepo: IRouteRepository,
    routeId: string,
): Promise<{ message: string }> => {
    return routeRepo.setBaseline(routeId);
};

/**
 * Use case: Fetch comparison data between baseline and other routes
 */
export const fetchComparison = async (
    routeRepo: IRouteRepository,
): Promise<ComparisonDTO[]> => {
    return routeRepo.fetchComparison();
};
