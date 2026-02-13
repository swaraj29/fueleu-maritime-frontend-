import type { RouteDTO, ComparisonDTO } from '../../domain/types/RouteTypes';

/**
 * Outbound port for Route data access
 * Implemented by infrastructure API adapter
 */
export interface IRouteRepository {
    fetchAll(): Promise<RouteDTO[]>;
    setBaseline(routeId: string): Promise<{ message: string }>;
    fetchComparison(): Promise<ComparisonDTO[]>;
}
