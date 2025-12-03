'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users } from 'lucide-react';

export const PerformanceWidget = () => {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-5 -mb-5" />

            <div className="relative z-10">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">Performance Snapshot</h3>

                <div className="space-y-6">
                    {/* Metric 1 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Queries Resolved (30d)</p>
                                <p className="text-lg font-bold">42</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+12%</span>
                    </div>

                    {/* Metric 2 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                <Clock size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Avg Response Time</p>
                                <p className="text-lg font-bold">1.5 hrs</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">-15m</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                <Users size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Farmers Managed</p>
                                <p className="text-lg font-bold">156</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500">Total</span>
                    </div>
                </div>

                <button className="w-full mt-6 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200">
                    View Full Analytics
                </button>
            </div>
        </div>
    );
};
