'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
    delay?: number;
}

export function OverviewCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor,
    bgColor,
    delay = 0
}: OverviewCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4"
        >
            <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={iconColor} size={24} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                    {title}
                </p>
                <h3 className="text-xl font-bold text-slate-900 truncate">
                    {value}
                </h3>
                {subtitle && (
                    <p className="text-[10px] text-slate-400 truncate">
                        {subtitle}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
