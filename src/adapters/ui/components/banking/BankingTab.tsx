import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { formatNumber } from '../../../../shared/utils/formatters';

const SHIPS = ['R001', 'R002', 'R003', 'R004', 'R005'];
const YEARS = [2024, 2025];

const BankingTab: React.FC = () => {
    const {
        cb, bankRecord, applyResult, loading, error, successMsg,
        loadCB, loadBankRecords, handleBankSurplus, handleApplyBanked, clearMessages,
    } = useBanking();

    const [selectedShip, setSelectedShip] = useState(SHIPS[0]);
    const [selectedYear, setSelectedYear] = useState(YEARS[0]);
    const [applyAmount, setApplyAmount] = useState('');

    const handleLoadData = async () => {
        clearMessages();
        await loadCB(selectedShip, selectedYear);
        await loadBankRecords(selectedShip, selectedYear);
    };

    const canBank = cb !== null && cb.cb > 0;
    const canApply = cb !== null && cb.cb < 0 && Number(applyAmount) > 0;

    return (
        <div className="space-y-6">
            {/* Ship Selection */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Select Ship & Year</h3>
                <div className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Ship ID</label>
                        <select
                            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            value={selectedShip}
                            onChange={(e) => setSelectedShip(e.target.value)}
                        >
                            {SHIPS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Year</label>
                        <select
                            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleLoadData}
                        disabled={loading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? 'Loading...' : 'Load Data'}
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg px-4 py-3 text-sm">
                    {successMsg}
                </div>
            )}

            {/* KPIs */}
            {cb && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Compliance Balance</p>
                        <p className={`text-2xl font-bold ${cb.cb >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatNumber(cb.cb, 0)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">gCO₂eq</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${cb.cb >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {cb.cb >= 0 ? '✅ Surplus' : '❌ Deficit'}
                        </span>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Banked</p>
                        <p className="text-2xl font-bold text-cyan-400">
                            {bankRecord ? formatNumber(bankRecord.totalBanked, 0) : '0'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">gCO₂eq</p>
                    </div>

                    {applyResult && (
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Last Application</p>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400">Before: <span className="text-white">{formatNumber(applyResult.cb_before, 0)}</span></p>
                                <p className="text-xs text-slate-400">Applied: <span className="text-amber-400">{formatNumber(applyResult.applied, 0)}</span></p>
                                <p className="text-xs text-slate-400">After: <span className="text-emerald-400">{formatNumber(applyResult.cb_after, 0)}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            {cb && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Surplus */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                        <h3 className="text-white font-semibold mb-3">Bank Surplus</h3>
                        <p className="text-xs text-slate-400 mb-4">Bank a ship's positive compliance balance for future use (Article 20).</p>
                        <button
                            onClick={() => handleBankSurplus(selectedShip, selectedYear)}
                            disabled={!canBank || loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:text-slate-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            {!canBank ? 'CB must be positive to bank' : 'Bank Surplus'}
                        </button>
                    </div>

                    {/* Apply Banked */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                        <h3 className="text-white font-semibold mb-3">Apply Banked Surplus</h3>
                        <p className="text-xs text-slate-400 mb-3">Apply banked surplus to offset a deficit.</p>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Amount (gCO₂eq)"
                                value={applyAmount}
                                onChange={(e) => setApplyAmount(e.target.value)}
                                className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                            <button
                                onClick={() => handleApplyBanked(selectedShip, selectedYear, Number(applyAmount))}
                                disabled={!canApply || loading}
                                className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:text-slate-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankingTab;
