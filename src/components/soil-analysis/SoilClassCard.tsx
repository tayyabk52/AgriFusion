'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface SoilClassCardProps {
    soilType: string;
    probability: number;
    index: number;
    isTopPrediction?: boolean;
}

const getSoilIcon = (soilType: string) => {
    const icons: Record<string, string> = {
        alluvial: '🏞️',
        black: '⚫',
        cinder: '🌋',
        clay: '🧱',
        laterite: '🔴',
        peat: '🟤',
        red: '🔴',
        sandy: '🏖️',
        yellow: '🟡',
    };
    return icons[soilType.toLowerCase()] || '🌱';
};

export const SoilClassCard: React.FC<SoilClassCardProps> = ({
    soilType,
    probability,
    index,
    isTopPrediction = false,
}) => {
    const percentage = (probability * 100).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{
                duration: 0.25,
                delay: index * 0.04,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
                'group relative flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 min-h-[56px]',
                isTopPrediction
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50/30 border-emerald-200/60 shadow-sm shadow-emerald-100/50'
                    : 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-md hover:shadow-slate-100/50'
            )}
        >
            <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-lg shrink-0 transition-colors',
                    isTopPrediction
                        ? 'bg-white shadow-sm border border-emerald-100'
                        : 'bg-slate-50 group-hover:bg-slate-100'
                )}
            >
                {getSoilIcon(soilType)}
            </motion.div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3
                        className={cn(
                            'text-sm font-bold capitalize truncate tracking-tight',
                            isTopPrediction ? 'text-emerald-900' : 'text-slate-800'
                        )}
                    >
                        {soilType.replace(/_/g, ' ')}
                    </h3>
                    {isTopPrediction && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" strokeWidth={2.5} />
                        </motion.div>
                    )}
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${probability * 100}%` }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.04,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className={cn(
                                'h-full rounded-full',
                                isTopPrediction
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-slate-400'
                            )}
                        />
                    </div>
                    <span className={cn(
                        "text-xs font-bold shrink-0 tabular-nums",
                        isTopPrediction ? 'text-emerald-700' : 'text-slate-600'
                    )}>
                        {percentage}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
