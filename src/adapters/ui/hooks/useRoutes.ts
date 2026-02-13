import { useState, useEffect, useCallback } from 'react';
import type { RouteDTO, ComparisonDTO, RouteFilters } from '../../../core/domain/types/RouteTypes';
import { routeApi } from '../../infrastructure/api/RouteApiAdapter';
import { fetchRoutes, setBaseline, fetchComparison } from '../../../core/application/usecases/routes/RouteUseCases';

export const useRoutes = () => {
    const [routes, setRoutes] = useState<RouteDTO[]>([]);
    const [comparisons, setComparisons] = useState<ComparisonDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<RouteFilters>({});

    const loadRoutes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRoutes(routeApi, filters);
            setRoutes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch routes');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const handleSetBaseline = useCallback(async (routeId: string) => {
        setError(null);
        try {
            await setBaseline(routeApi, routeId);
            await loadRoutes();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set baseline');
        }
    }, [loadRoutes]);

    const loadComparisons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchComparison(routeApi);
            setComparisons(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch comparisons');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRoutes();
    }, [loadRoutes]);

    return {
        routes,
        comparisons,
        loading,
        error,
        filters,
        setFilters,
        loadRoutes,
        handleSetBaseline,
        loadComparisons,
    };
};
