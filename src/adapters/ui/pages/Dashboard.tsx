import React, { useState } from 'react';
import RoutesTab from '../components/routes/RoutesTab';
import CompareTab from '../components/compare/CompareTab';
import BankingTab from '../components/banking/BankingTab';
import PoolingTab from '../components/pooling/PoolingTab';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'routes', label: 'Routes', icon: '🚢' },
    { id: 'compare', label: 'Compare', icon: '📊' },
    { id: 'banking', label: 'Banking', icon: '🏦' },
    { id: 'pooling', label: 'Pooling', icon: '🤝' },
];

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('routes');

    const renderTab = () => {
        switch (activeTab) {
            case 'routes':
                return <RoutesTab />;
            case 'compare':
                return <CompareTab />;
            case 'banking':
                return <BankingTab />;
            case 'pooling':
                return <PoolingTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                FE
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-lg leading-tight">FuelEU Maritime</h1>
                                <p className="text-slate-400 text-xs">Compliance Dashboard</p>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500">
                            Target: <span className="text-cyan-400 font-mono">89.3368 gCO₂e/MJ</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tabs Navigation */}
                <div className="flex gap-1 bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 mb-6 border border-slate-700/50">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                {renderTab()}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700/50 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-xs text-slate-500">
                        FuelEU Maritime Regulation (EU) 2023/1805 — Compliance Platform
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
