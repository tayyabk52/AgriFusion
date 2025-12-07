'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';
import { SoilAnalysisResponse } from '@/types/soil';
import { formatSoilClassName, getConfidenceLevel } from '@/lib/soilApi';
import { SoilClassCard } from './SoilClassCard';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
    results: SoilAnalysisResponse;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    const { class: soilClass, confidence, probabilities } = results;
    const { level: confidenceLevel, color: confidenceColor } = getConfidenceLevel(confidence);
    const formattedClassName = formatSoilClassName(soilClass);

    const sortedProbabilities = Object.entries(probabilities)
        .sort(([, a], [, b]) => b - a)
        .map(([type, prob]) => ({ type, probability: prob }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
        >
            {/* Compact Result Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">Identified Soil Type</p>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {formattedClassName}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 mb-1">Confidence</p>
                            <div className="text-2xl font-bold">
                                {(confidence * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={cn(
                                "h-full rounded-full",
                                confidenceColor === 'emerald' ? 'bg-emerald-400' :
                                    confidenceColor === 'green' ? 'bg-green-400' :
                                        confidenceColor === 'yellow' ? 'bg-yellow-400' : 'bg-orange-400'
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Compact Probability Grid */}
            <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Top Matches
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                    {sortedProbabilities.slice(0, 6).map((item, index) => (
                        <SoilClassCard
                            key={item.type}
                            soilType={item.type}
                            probability={item.probability}
                            index={index}
                            isTopPrediction={item.type === soilClass}
                        />
                    ))}
                </div>
            </div>

            {/* Compact Info */}
            <div className="bg-slate-50 rounded-xl p-3 flex gap-2.5 items-start border border-slate-100">
                <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                    AI analysis based on visual patterns. For critical decisions, verify with physical testing.
                </p>
            </div>
        </motion.div>
    );
};
