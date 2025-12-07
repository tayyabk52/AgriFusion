'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatItem {
    label: string;
    value: string;
    icon?: LucideIcon;
    /** Explicit Tailwind classes for the icon and background */
    iconClass?: string;
    bgClass?: string;
    /** Badge-style classes for compact display */
    badgeClass?: string;
}

interface StatsGridProps {
    stats: StatItem[];
    /** Choose display variant */
    variant?: 'default' | 'compact';
}

/**
 * Reusable stats grid component for dashboard pages.
 * Uses explicit Tailwind classes to ensure production build includes all styles.
 */
export function StatsGrid({ stats, variant = 'default' }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                    {variant === 'compact' && stat.icon ? (
                        // Compact variant with icon and badge
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <stat.icon size={20} className={stat.iconClass || 'text-slate-600'} />
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.badgeClass || 'bg-slate-50 text-slate-700'
                                        }`}
                                >
                                    {stat.value}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </>
                    ) : stat.icon ? (
                        // Default variant with icon box
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`w-10 h-10 rounded-xl ${stat.bgClass || 'bg-slate-50'
                                        } flex items-center justify-center`}
                                >
                                    <stat.icon
                                        size={20}
                                        className={stat.iconClass || 'text-slate-600'}
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </>
                    ) : (
                        // Simple variant without icon
                        <>
                            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                        </>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
