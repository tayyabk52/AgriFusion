'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle, RotateCcw, ScanLine, BarChart3, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import { SoilAnalysisResponse, AnalysisState } from '@/types/soil';
import { analyzeSoilImage, SoilAnalysisApiError } from '@/lib/soilApi';
import { ImageUploader } from './ImageUploader';
import { ResultsDisplay } from './ResultsDisplay';
import { Button } from '@/components/ui/Button';

export const SoilAnalysisPage: React.FC = () => {
    const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
    const [results, setResults] = useState<SoilAnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = async (file: File) => {
        setAnalysisState('analyzing');
        setError(null);
        setResults(null);

        try {
            const response = await analyzeSoilImage(file);
            setResults(response);
            setAnalysisState('success');
        } catch (err) {
            setAnalysisState('error');
            if (err instanceof SoilAnalysisApiError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleReset = () => {
        setAnalysisState('idle');
        setResults(null);
        setError(null);
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 text-slate-900 flex flex-col overflow-hidden">
            {/* Enhanced Header */}
            <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md z-50 shrink-0 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-slate-400 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-100"
                        >
                            <ArrowLeft size={20} strokeWidth={2} />
                        </Link>
                        <div className="h-5 w-px bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                                <Zap size={16} className="text-white" strokeWidth={2.5} />
                            </div>
                            <h1 className="text-base font-bold tracking-tight text-slate-900">
                                Soil<span className="text-emerald-600">Lens</span>
                            </h1>
                        </div>
                    </div>

                    {analysisState === 'success' && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleReset}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-all px-3 py-2 rounded-xl hover:bg-slate-100"
                        >
                            <RotateCcw size={16} strokeWidth={2} />
                            <span className="hidden sm:inline">New Analysis</span>
                        </motion.button>
                    )}
                </div>
            </header>

            {/* Main Content - Responsive Layout */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
                    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">

                        {/* LEFT COLUMN: Input Section */}
                        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                                        AI Soil Analysis
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                                        Upload a clear soil image and get instant identification powered by advanced AI technology.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <ImageUploader
                                    onImageSelect={handleImageSelect}
                                    isAnalyzing={analysisState === 'analyzing'}
                                />
                            </motion.div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {analysisState === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="rounded-2xl bg-red-50 border-2 border-red-100 p-4 flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                                <AlertTriangle size={18} className="text-red-600" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-red-900 mb-1">Analysis Failed</h4>
                                                <p className="text-xs text-red-700 mb-2">{error}</p>
                                                <button
                                                    onClick={handleReset}
                                                    className="text-xs text-red-800 font-semibold hover:underline"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Features - Only show when idle */}
                            {analysisState === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-wrap items-center gap-4 pt-2"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shadow-sm">
                                            <CheckCircle2 size={18} className="text-emerald-600" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">9 Soil Types</p>
                                            <p className="text-xs text-slate-500">Comprehensive database</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm">
                                            <BarChart3 size={18} className="text-blue-600" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">AI Powered</p>
                                            <p className="text-xs text-slate-500">High accuracy</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Results Section */}
                        <div className="lg:col-span-7 flex items-center justify-center overflow-hidden min-h-0 flex-1 lg:flex-none lg:h-full">
                            <div className="w-full h-full flex items-center">
                                <AnimatePresence mode="wait">
                                    {analysisState === 'success' && results ? (
                                        <motion.div
                                            key="results"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            className="w-full"
                                        >
                                            <ResultsDisplay results={results} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-full h-full flex items-center justify-center"
                                        >
                                            <div className="text-center max-w-sm space-y-6 px-4">
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.05, 1],
                                                        opacity: [0.5, 0.7, 0.5]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto border-2 border-slate-200 shadow-lg"
                                                >
                                                    <ScanLine size={36} className="text-slate-400" strokeWidth={1.5} />
                                                </motion.div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        Awaiting Analysis
                                                    </h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed">
                                                        Upload a soil image to begin AI-powered analysis
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};
