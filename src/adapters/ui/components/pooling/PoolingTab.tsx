import React, { useState, useEffect } from 'react';
import { usePooling } from '../../hooks/usePooling';
import { useRoutes } from '../../hooks/useRoutes';
import { formatNumber } from '../../../../shared/utils/formatters';

const YEARS = [2024, 2025];

const PoolingTab: React.FC = () => {
    const { routes } = useRoutes();
    const {
        members, poolResults, loading, error, successMsg,
        poolSum, poolValid, addMember, removeMember,
        handleCreatePool, loadAdjustedCB, resetPool,
    } = usePooling();

    const [selectedYear, setSelectedYear] = useState(YEARS[0]);
    const [adjustedCBs, setAdjustedCBs] = useState<Record<string, number>>({});

    // Load adjusted CB for all routes
    useEffect(() => {
        const loadAll = async () => {
            const results: Record<string, number> = {};
            for (const route of routes) {
                if (route.year === selectedYear) {
                    const data = await loadAdjustedCB(route.routeId, selectedYear);
                    if (data) {
                        results[route.routeId] = data.adjustedCB;
                    }
                }
            }
            setAdjustedCBs(results);
        };
        if (routes.length > 0) {
            loadAll();
        }
    }, [routes, selectedYear, loadAdjustedCB]);

    const availableShips = routes
        .filter((r) => r.year === selectedYear)
        .filter((r) => !members.find((m) => m.shipId === r.routeId));

    const handleAddShip = (shipId: string) => {
        const cb = adjustedCBs[shipId];
        if (cb !== undefined) {
            addMember({ shipId, cbBefore: cb });
        }
    };

    return (
        <div className="space-y-6">
            {/* Year Selection */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-slate-400">Year:</label>
                        <select
                            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            value={selectedYear}
                            onChange={(e) => { setSelectedYear(Number(e.target.value)); resetPool(); }}
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={resetPool}
                        className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        Reset Pool
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Ships */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                    <h3 className="text-white font-semibold mb-4">Available Ships</h3>
                    {availableShips.length === 0 ? (
                        <p className="text-slate-400 text-sm">No ships available for this year.</p>
                    ) : (
                        <div className="space-y-2">
                            {availableShips.map((ship) => (
                                <div key={ship.routeId} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-3">
                                    <div>
                                        <span className="font-mono text-cyan-400 text-sm">{ship.routeId}</span>
                                        <span className="text-slate-400 text-xs ml-2">({ship.vesselType})</span>
                                        {adjustedCBs[ship.routeId] !== undefined && (
                                            <span className={`ml-3 text-sm ${adjustedCBs[ship.routeId] >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {formatNumber(adjustedCBs[ship.routeId], 0)} gCO₂eq
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAddShip(ship.routeId)}
                                        disabled={adjustedCBs[ship.routeId] === undefined}
                                        className="text-xs bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pool Members */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
                    <h3 className="text-white font-semibold mb-4">Pool Members</h3>

                    {/* Pool Sum Indicator */}
                    <div className={`mb-4 p-3 rounded-lg border ${poolValid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <p className="text-xs text-slate-400">Pool Sum</p>
                        <p className={`text-xl font-bold ${poolValid ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatNumber(poolSum, 0)} gCO₂eq
                        </p>
                        <p className={`text-xs mt-1 ${poolValid ? 'text-emerald-400' : 'text-red-400'}`}>
                            {poolValid ? '✅ Pool is valid (sum ≥ 0)' : '❌ Pool invalid (sum < 0)'}
                        </p>
                    </div>

                    {members.length === 0 ? (
                        <p className="text-slate-400 text-sm">Add ships to the pool from the left panel.</p>
                    ) : (
                        <div className="space-y-2 mb-4">
                            {members.map((m) => (
                                <div key={m.shipId} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-3">
                                    <div>
                                        <span className="font-mono text-cyan-400 text-sm">{m.shipId}</span>
                                        <span className={`ml-3 text-sm ${m.cbBefore >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {formatNumber(m.cbBefore, 0)} gCO₂eq
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeMember(m.shipId)}
                                        className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => handleCreatePool(selectedYear)}
                        disabled={!poolValid || members.length < 2 || loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:text-slate-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : members.length < 2 ? 'Need at least 2 members' : !poolValid ? 'Pool sum must be ≥ 0' : 'Create Pool'}
                    </button>
                </div>
            </div>

            {/* Pool Results */}
            {poolResults && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50">
                        <h3 className="text-white font-semibold">Pool Results (After Redistribution)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-700/50 text-slate-300 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Ship ID</th>
                                    <th className="px-4 py-3">CB Before</th>
                                    <th className="px-4 py-3">CB After</th>
                                    <th className="px-4 py-3">Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {poolResults.map((r) => (
                                    <tr key={r.shipId} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-cyan-400">{r.shipId}</td>
                                        <td className="px-4 py-3">
                                            <span className={r.cbBefore >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                {formatNumber(r.cbBefore, 0)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={r.cbAfter >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                {formatNumber(r.cbAfter, 0)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={r.cbAfter - r.cbBefore >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                                                {formatNumber(r.cbAfter - r.cbBefore, 0)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoolingTab;
