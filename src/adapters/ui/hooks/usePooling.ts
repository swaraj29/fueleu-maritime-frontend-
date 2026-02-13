import { useState, useCallback } from 'react';
import type { PoolMember, PoolMemberResult } from '../../../core/domain/types/PoolingTypes';
import type { AdjustedCBDTO } from '../../../core/domain/types/ComplianceTypes';
import { poolingApi } from '../../infrastructure/api/PoolingApiAdapter';
import { createPool, fetchAdjustedCB } from '../../../core/application/usecases/pooling/PoolingUseCases';
import { getPoolSum, isPoolValid } from '../../../core/domain/entities/Pool';

export const usePooling = () => {
    const [members, setMembers] = useState<PoolMember[]>([]);
    const [poolResults, setPoolResults] = useState<PoolMemberResult[] | null>(null);
    const [adjustedCBMap, setAdjustedCBMap] = useState<Record<string, AdjustedCBDTO>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const loadAdjustedCB = useCallback(async (shipId: string, year: number) => {
        try {
            const data = await fetchAdjustedCB(poolingApi, shipId, year);
            setAdjustedCBMap((prev) => ({ ...prev, [shipId]: data }));
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch adjusted CB');
            return null;
        }
    }, []);

    const addMember = useCallback((member: PoolMember) => {
        setMembers((prev) => {
            if (prev.find((m) => m.shipId === member.shipId)) return prev;
            return [...prev, member];
        });
    }, []);

    const removeMember = useCallback((shipId: string) => {
        setMembers((prev) => prev.filter((m) => m.shipId !== shipId));
    }, []);

    const handleCreatePool = useCallback(async (year: number) => {
        if (!isPoolValid(members)) {
            setError('Pool sum cannot be negative');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const results = await createPool(poolingApi, { members, year });
            setPoolResults(results);
            setSuccessMsg('Pool created successfully');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create pool');
        } finally {
            setLoading(false);
        }
    }, [members]);

    const poolSum = getPoolSum(members);
    const poolValid = isPoolValid(members);

    return {
        members,
        poolResults,
        adjustedCBMap,
        loading,
        error,
        successMsg,
        poolSum,
        poolValid,
        addMember,
        removeMember,
        handleCreatePool,
        loadAdjustedCB,
        clearMessages: () => { setError(null); setSuccessMsg(null); },
        resetPool: () => { setMembers([]); setPoolResults(null); },
    };
};
