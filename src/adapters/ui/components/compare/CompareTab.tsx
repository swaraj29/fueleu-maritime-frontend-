import React, { useEffect } from 'react';
import { useRoutes } from '../../hooks/useRoutes';
import { TARGET_INTENSITY } from '../../../../shared/constants/fuelConstants';
import { formatPercentDiff } from '../../../../shared/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const CompareTab: React.FC = () => {
    const { comparisons, loading, error, loadComparisons } = useRoutes();

    useEffect(() => {
        loadComparisons();
    }, [loadComparisons]);

    const chartData = comparisons.map((c) => ({
        name: c.comparisonRouteId,
        baseline: c.baselineIntensity,
        comparison: c.comparisonIntensity,
        target: TARGET_INTENSITY,
    }));

    return (
        <div className="space-y-6">
            {/* Target Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span className="text-slate-300 text-sm">
                        Target Intensity: <span className="text-cyan-400 font-semibold">{TARGET_INTENSITY} gCO₂e/MJ</span>
                        <span className="text-slate-500 ml-2">(2% below {91.16} reference)</span>
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Chart */}
            {chartData.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-white font-semibold mb-4">GHG Intensity Comparison</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[80, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Legend wrapperStyle={{ color: '#94a3b8' }} />
                            <ReferenceLine y={TARGET_INTENSITY} stroke="#22d3ee" strokeDasharray="5 5" label={{ value: 'Target', fill: '#22d3ee', fontSize: 12 }} />
                            <Bar dataKey="baseline" name="Baseline" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="comparison" name="Comparison" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-700/50 text-slate-300 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Baseline Route</th>
                                <th className="px-4 py-3">Comparison Route</th>
                                <th className="px-4 py-3">Baseline Intensity</th>
                                <th className="px-4 py-3">Comparison Intensity</th>
                                <th className="px-4 py-3">% Difference</th>
                                <th className="px-4 py-3">Compliant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                            Loading comparisons...
                                        </div>
                                    </td>
                                </tr>
                            ) : comparisons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        No comparisons found. Please set a baseline route first.
                                    </td>
                                </tr>
                            ) : (
                                comparisons.map((c) => (
                                    <tr key={c.comparisonRouteId} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-indigo-400">{c.baselineRouteId}</td>
                                        <td className="px-4 py-3 font-mono text-cyan-400">{c.comparisonRouteId}</td>
                                        <td className="px-4 py-3 text-white">{c.baselineIntensity.toFixed(4)}</td>
                                        <td className="px-4 py-3 text-white">{c.comparisonIntensity.toFixed(4)}</td>
                                        <td className="px-4 py-3">
                                            <span className={c.percentDiff < 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                {formatPercentDiff(c.percentDiff)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {c.compliant ? (
                                                <span className="text-emerald-400 text-lg">✅</span>
                                            ) : (
                                                <span className="text-red-400 text-lg">❌</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompareTab;
