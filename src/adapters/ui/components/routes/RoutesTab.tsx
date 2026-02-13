import React from 'react';
import { useRoutes } from '../../hooks/useRoutes';
import { TARGET_INTENSITY } from '../../../../shared/constants/fuelConstants';
import { formatNumber } from '../../../../shared/utils/formatters';

const RoutesTab: React.FC = () => {
    const { routes, loading, error, filters, setFilters, handleSetBaseline } = useRoutes();

    const vesselTypes = [...new Set(routes.map((r) => r.vesselType))];
    const fuelTypes = [...new Set(routes.map((r) => r.fuelType))];
    const years = [...new Set(routes.map((r) => r.year))];

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Filters</h3>
                <div className="flex flex-wrap gap-3">
                    <select
                        className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        value={filters.vesselType || ''}
                        onChange={(e) => setFilters({ ...filters, vesselType: e.target.value || undefined })}
                    >
                        <option value="">All Vessel Types</option>
                        {vesselTypes.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>

                    <select
                        className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        value={filters.fuelType || ''}
                        onChange={(e) => setFilters({ ...filters, fuelType: e.target.value || undefined })}
                    >
                        <option value="">All Fuel Types</option>
                        {fuelTypes.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>

                    <select
                        className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        value={filters.year || ''}
                        onChange={(e) => setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : undefined })}
                    >
                        <option value="">All Years</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-700/50 text-slate-300 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Route ID</th>
                                <th className="px-4 py-3">Vessel Type</th>
                                <th className="px-4 py-3">Fuel Type</th>
                                <th className="px-4 py-3">Year</th>
                                <th className="px-4 py-3">GHG Intensity (gCO₂e/MJ)</th>
                                <th className="px-4 py-3">Fuel Consumption (t)</th>
                                <th className="px-4 py-3">Distance (km)</th>
                                <th className="px-4 py-3">Total Emissions (t)</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                            Loading routes...
                                        </div>
                                    </td>
                                </tr>
                            ) : routes.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">No routes found</td>
                                </tr>
                            ) : (
                                routes.map((route) => (
                                    <tr key={route.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-cyan-400">{route.routeId}</td>
                                        <td className="px-4 py-3 text-white">{route.vesselType}</td>
                                        <td className="px-4 py-3 text-white">{route.fuelType}</td>
                                        <td className="px-4 py-3 text-white">{route.year}</td>
                                        <td className="px-4 py-3">
                                            <span className={route.ghgIntensity <= TARGET_INTENSITY ? 'text-emerald-400' : 'text-amber-400'}>
                                                {route.ghgIntensity.toFixed(4)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white">{formatNumber(route.fuelConsumption, 0)}</td>
                                        <td className="px-4 py-3 text-white">{formatNumber(route.distance, 0)}</td>
                                        <td className="px-4 py-3 text-white">{formatNumber(route.totalEmissions, 0)}</td>
                                        <td className="px-4 py-3">
                                            {route.isBaseline ? (
                                                <span className="inline-flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                                                    ✅ Baseline
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleSetBaseline(route.routeId)}
                                                    className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Set Baseline
                                                </button>
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

export default RoutesTab;
