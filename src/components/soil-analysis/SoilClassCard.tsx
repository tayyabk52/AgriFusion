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
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.2,
                delay: index * 0.03,
            }}
            className={cn(
                'group relative flex items-center gap-2.5 rounded-lg border p-2.5 transition-all duration-150',
                isTopPrediction
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-white border-slate-100 hover:border-emerald-100'
            )}
        >
            <div
                className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg text-base shrink-0',
                    isTopPrediction ? 'bg-emerald-100' : 'bg-slate-50'
                )}
            >
                {getSoilIcon(soilType)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h3
                        className={cn(
                            'text-xs font-semibold capitalize truncate',
                            isTopPrediction ? 'text-emerald-900' : 'text-slate-700'
                        )}
                    >
                        {soilType.replace(/_/g, ' ')}
                    </h3>
                    {isTopPrediction && (
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${probability * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.03 }}
                            className={cn(
                                'h-full rounded-full',
                                isTopPrediction ? 'bg-emerald-500' : 'bg-slate-300'
                            )}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">
                        {percentage}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
