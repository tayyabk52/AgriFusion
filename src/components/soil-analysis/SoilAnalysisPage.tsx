'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle, RotateCcw, ScanLine, BarChart3, CheckCircle2 } from 'lucide-react';
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
        <div className="h-screen bg-white text-slate-900 flex flex-col overflow-hidden">
            {/* Compact Header */}
            <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm z-50 shrink-0">
                <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <ArrowLeft size={18} />
                        </Link>
                        <div className="h-4 w-px bg-slate-200" />
                        <h1 className="text-sm font-bold tracking-tight text-slate-900">
                            Soil<span className="text-emerald-600">Lens</span>
                        </h1>
                    </div>

                    {analysisState === 'success' && (
                        <button
                            onClick={handleReset}
                            className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                        >
                            <RotateCcw size={14} />
                            New Analysis
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content - No Scroll */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full mx-auto max-w-7xl px-6 py-6">
                    <div className="h-full grid lg:grid-cols-12 gap-8 items-stretch">

                        {/* LEFT COLUMN: Input */}
                        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Soil Analysis Tool
                                </h2>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                                    Upload a clear image. AI identifies soil type instantly.
                                </p>
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
                                    >
                                        <div className="rounded-xl bg-red-50 border border-red-100 p-3 flex items-start gap-3">
                                            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-red-700 font-medium">{error}</p>
                                                <button
                                                    onClick={handleReset}
                                                    className="text-xs text-red-800 mt-1 hover:underline"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Quick Stats */}
                            {analysisState === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-6 pt-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <CheckCircle2 size={14} className="text-emerald-600" />
                                        </div>
                                        <span className="text-xs text-slate-600">9 Soil Types</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <BarChart3 size={14} className="text-blue-600" />
                                        </div>
                                        <span className="text-xs text-slate-600">AI Powered</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Results */}
                        <div className="lg:col-span-7 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full flex items-center">
                                <AnimatePresence mode="wait">
                                    {analysisState === 'success' && results ? (
                                        <motion.div
                                            key="results"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.3 }}
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
                                            <div className="text-center max-w-sm space-y-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                                                    <ScanLine size={28} className="text-slate-300" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                                        Awaiting Analysis
                                                    </h3>
                                                    <p className="text-xs text-slate-400">
                                                        Results will appear here after upload
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
