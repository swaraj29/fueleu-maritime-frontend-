import type { IRouteRepository } from '../../../core/ports/outbound/IRouteRepository';
import type { RouteDTO, ComparisonDTO } from '../../../core/domain/types/RouteTypes';
import apiClient from './apiClient';

/**
 * Route API adapter implementing IRouteRepository (functional)
 */
export const routeApi: IRouteRepository = {
    fetchAll: async (): Promise<RouteDTO[]> => {
        const { data } = await apiClient.get<RouteDTO[]>('/routes');
        return data;
    },

    setBaseline: async (routeId: string): Promise<{ message: string }> => {
        const { data } = await apiClient.post<{ message: string }>(`/routes/${routeId}/baseline`);
        return data;
    },

    fetchComparison: async (): Promise<ComparisonDTO[]> => {
        const { data } = await apiClient.get<ComparisonDTO[]>('/routes/comparison');
        return data;
    },
};
