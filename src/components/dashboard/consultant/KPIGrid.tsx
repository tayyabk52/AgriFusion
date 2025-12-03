'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, HelpCircle, Hourglass, Recycle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const KPI_DATA = [
    {
        id: 'active-farmers',
        label: 'Active Farmers',
        value: '42',
        change: '+12%',
        trend: 'up',
        icon: Users,
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-50 to-teal-50',
        iconBg: 'bg-emerald-100',
    },
    {
        id: 'open-queries',
        label: 'Open Queries',
        value: '8',
        change: '+2',
        trend: 'up',
        icon: HelpCircle,
        gradient: 'from-amber-500 to-orange-600',
        bgGradient: 'from-amber-50 to-orange-50',
        iconBg: 'bg-amber-100',
    },
    {
        id: 'expert-pending',
        label: 'Expert Pending',
        value: '3',
        change: '-1',
        trend: 'down',
        icon: Hourglass,
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-50 to-indigo-50',
        iconBg: 'bg-blue-100',
    },
    {
        id: 'active-waste',
        label: 'Active Waste',
        value: '12',
        change: '+5',
        trend: 'up',
        icon: Recycle,
        gradient: 'from-teal-500 to-cyan-600',
        bgGradient: 'from-teal-50 to-cyan-50',
        iconBg: 'bg-teal-100',
    },
    {
        id: 'new-offers',
        label: 'New Offers',
        value: '5',
        change: '+3',
        trend: 'up',
        icon: Wallet,
        gradient: 'from-violet-500 to-purple-600',
        bgGradient: 'from-violet-50 to-purple-50',
        iconBg: 'bg-violet-100',
    },
];

export const KPIGrid = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {KPI_DATA.map((kpi, index) => (
                <motion.div
                    key={kpi.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Icon */}
                    <div className="relative z-10 mb-4">
                        <div className={`inline-flex p-3 rounded-xl ${kpi.iconBg} group-hover:bg-gradient-to-br group-hover:${kpi.gradient} transition-all duration-300`}>
                            <kpi.icon
                                size={22}
                                className="text-slate-600 group-hover:text-white transition-colors duration-300"
                                strokeWidth={2.5}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            {kpi.label}
                        </p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                                {kpi.value}
                            </h3>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                    kpi.trend === 'up'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {kpi.trend === 'up' ? (
                                    <TrendingUp size={12} strokeWidth={3} />
                                ) : (
                                    <TrendingDown size={12} strokeWidth={3} />
                                )}
                                <span>{kpi.change}</span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500" />
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />
                </motion.div>
            ))}
        </div>
    );
};
