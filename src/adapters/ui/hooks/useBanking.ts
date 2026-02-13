import { useState, useCallback } from 'react';
import type { ComplianceBalanceDTO } from '../../../core/domain/types/ComplianceTypes';
import type { BankRecordDTO, ApplyBankedResponse } from '../../../core/domain/types/BankingTypes';
import { bankingApi } from '../../infrastructure/api/BankingApiAdapter';
import {
    fetchComplianceBalance,
    bankSurplus,
    applyBanked,
    fetchBankRecords,
} from '../../../core/application/usecases/banking/BankingUseCases';

export const useBanking = () => {
    const [cb, setCb] = useState<ComplianceBalanceDTO | null>(null);
    const [bankRecord, setBankRecord] = useState<BankRecordDTO | null>(null);
    const [applyResult, setApplyResult] = useState<ApplyBankedResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const loadCB = useCallback(async (shipId: string, year: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchComplianceBalance(bankingApi, shipId, year);
            setCb(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch CB');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadBankRecords = useCallback(async (shipId: string, year: number) => {
        setError(null);
        try {
            const data = await fetchBankRecords(bankingApi, shipId, year);
            setBankRecord(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bank records');
        }
    }, []);

    const handleBankSurplus = useCallback(async (shipId: string, year: number) => {
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const result = await bankSurplus(bankingApi, shipId, year);
            setSuccessMsg(`Successfully banked ${result.bankedAmount.toLocaleString()} gCO₂eq`);
            await loadCB(shipId, year);
            await loadBankRecords(shipId, year);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to bank surplus');
        } finally {
            setLoading(false);
        }
    }, [loadCB, loadBankRecords]);

    const handleApplyBanked = useCallback(async (shipId: string, year: number, amount: number) => {
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const result = await applyBanked(bankingApi, shipId, year, amount);
            setApplyResult(result);
            setSuccessMsg(`Applied ${result.applied.toLocaleString()} gCO₂eq`);
            await loadCB(shipId, year);
            await loadBankRecords(shipId, year);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to apply banked surplus');
        } finally {
            setLoading(false);
        }
    }, [loadCB, loadBankRecords]);

    return {
        cb,
        bankRecord,
        applyResult,
        loading,
        error,
        successMsg,
        loadCB,
        loadBankRecords,
        handleBankSurplus,
        handleApplyBanked,
        clearMessages: () => { setError(null); setSuccessMsg(null); },
    };
};
