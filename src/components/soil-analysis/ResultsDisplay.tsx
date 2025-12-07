'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Info, Award, Sparkles } from 'lucide-react';
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
        >
            {/* Enhanced Result Card */}
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl shadow-slate-900/50"
            >
                {/* Animated Background Effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 blur-3xl rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-purple-500/5 blur-3xl rounded-full" />

                <div className="relative z-10 space-y-6">
                    {/* Header with Icon */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Award size={16} className="text-emerald-400" strokeWidth={2.5} />
                                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Analysis Complete</p>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                {formattedClassName}
                            </h1>
                            <p className="text-sm text-slate-400">
                                Identified soil type with AI-powered analysis
                            </p>
                        </div>
                        <motion.div
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                            className="hidden sm:block shrink-0"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Sparkles size={28} className="text-white" strokeWidth={2} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Confidence Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-emerald-400" strokeWidth={2.5} />
                                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Confidence Score</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="text-3xl font-bold tabular-nums"
                            >
                                {(confidence * 100).toFixed(1)}%
                            </motion.div>
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="relative">
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${confidence * 100}%` }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                    className={cn(
                                        "h-full rounded-full shadow-lg",
                                        confidenceColor === 'emerald' ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 shadow-emerald-500/50' :
                                            confidenceColor === 'green' ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-green-500/50' :
                                                confidenceColor === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 shadow-yellow-500/50' :
                                                    'bg-gradient-to-r from-orange-400 to-red-400 shadow-orange-500/50'
                                    )}
                                />
                            </div>
                            {/* Glow effect */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                className={cn(
                                    "absolute inset-0 h-2.5 rounded-full blur-md",
                                    confidenceColor === 'emerald' ? 'bg-emerald-400/30' :
                                        confidenceColor === 'green' ? 'bg-green-400/30' :
                                            confidenceColor === 'yellow' ? 'bg-yellow-400/30' :
                                                'bg-orange-400/30'
                                )}
                                style={{ width: `${confidence * 100}%` }}
                            />
                        </div>

                        <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                            confidenceColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                confidenceColor === 'green' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                    confidenceColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                        'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        )}>
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                confidenceColor === 'emerald' ? 'bg-emerald-400' :
                                    confidenceColor === 'green' ? 'bg-green-400' :
                                        confidenceColor === 'yellow' ? 'bg-yellow-400' :
                                            'bg-orange-400'
                            )} />
                            {confidenceLevel} Confidence
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Top Matches Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Top Soil Matches
                    </h3>
                    <span className="text-xs text-slate-500">
                        Top {Math.min(6, sortedProbabilities.length)} results
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            {/* Enhanced Info Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-4 flex gap-3 items-start border-2 border-blue-100/50 shadow-sm"
            >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Info size={18} className="text-blue-600" strokeWidth={2.5} />
                </div>
                <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-semibold text-blue-900">Analysis Disclaimer</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        AI analysis based on visual patterns. For critical agricultural decisions, we recommend verifying results with physical soil testing.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};
