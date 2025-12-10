'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';

interface PremiumMissionCardProps {
    title: string;
    description: string;
    solutions: string[];
    icon?: React.ReactNode;
}

export const PremiumMissionCard: React.FC<PremiumMissionCardProps> = ({
    title,
    description,
    solutions,
    icon
}) => {
    return (
        <div className="relative w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                {/* Premium Landscape Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative lg:w-1/2"
                >
                    <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                        {/* Landscape Section */}
                        <div className="absolute inset-0">
                            {/* Sky with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-emerald-200 to-teal-300" />

                            {/* Sun */}
                            <div className="absolute bottom-[45%] left-[25%] w-16 h-16">
                                <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8)]" />
                                <div className="absolute inset-0 rounded-full bg-white opacity-50 scale-[1.2]" />
                                <div className="absolute inset-0 rounded-full bg-white opacity-20 scale-[1.4]" />
                            </div>

                            {/* Fields/Ocean - Lower section */}
                            <div className="absolute bottom-0 w-full h-[35%] bg-gradient-to-b from-emerald-400 to-emerald-500 overflow-hidden">
                                {/* Field rows/reflections */}
                                <div className="absolute top-[8%] left-[35%] w-12 h-1 bg-white opacity-40" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 70% 100%, 30% 100%)' }} />
                                <div className="absolute top-[18%] left-[40%] w-20 h-1 bg-white opacity-40" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 70% 100%, 30% 100%)' }} />
                                <div className="absolute top-[30%] right-[18%] w-16 h-0.5 bg-white opacity-30" style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }} />
                                <div className="absolute top-[42%] right-[25%] w-20 h-0.5 bg-white opacity-30" style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }} />
                                <div className="absolute top-[54%] right-[12%] w-20 h-1 bg-white opacity-30" style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }} />
                            </div>

                            {/* Hill 1 - Right side */}
                            <div className="absolute right-[-15%] bottom-[25%] w-40 h-12 rounded-full bg-teal-400 z-10" />

                            {/* Hill 2 - Right side deeper */}
                            <div className="absolute right-[-25%] bottom-[15%] w-40 h-20 rounded-full bg-teal-500 z-10" />

                            {/* Hill 3 - Left foreground */}
                            <div className="absolute left-[-60%] bottom-[-20%] w-96 h-40 rounded-full bg-emerald-600 z-20" />

                            {/* Crops/Trees on left hill */}
                            <div className="absolute bottom-[22%] left-[5%] w-12 h-16 z-[5]">
                                <svg viewBox="0 0 64 64" fill="#10b981" className="drop-shadow-md opacity-80">
                                    <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
                                </svg>
                            </div>

                            <div className="absolute bottom-[16%] left-[22%] w-12 h-16 z-[5]">
                                <svg viewBox="0 0 64 64" fill="#059669" className="drop-shadow-md opacity-80">
                                    <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
                                </svg>
                            </div>

                            {/* Hill 4 - Right foreground */}
                            <div className="absolute right-[-60%] bottom-[-30%] w-96 h-40 rounded-full bg-teal-600 z-20" />

                            {/* Crops/Trees on right hill */}
                            <div className="absolute bottom-[12%] right-[2%] w-16 h-20 z-[5]">
                                <svg viewBox="0 0 64 64" fill="#0d9488" className="drop-shadow-md opacity-80">
                                    <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
                                </svg>
                            </div>

                            {/* Light overlay filter */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10 z-40 pointer-events-none" />
                        </div>

                        {/* Content Overlay - Top section */}
                        <div className="absolute top-0 left-0 right-0 p-6 z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                                        {icon || <Target className="w-6 h-6 text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold tracking-wider uppercase text-slate-900">Our Focus</p>
                                        <h3 className="text-2xl font-bold text-slate-900 drop-shadow-sm">{title}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Overlay - Bottom section */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6 z-10 rounded-b-3xl">
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                {description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-3">
                                <span className="font-semibold">Powered by AI</span>
                                <span>{solutions.length} Solutions</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Solutions List */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="lg:w-1/2 flex flex-col justify-center"
                >
                    <div className="space-y-5">
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full mb-4 border border-emerald-100/50 shadow-sm shadow-emerald-100/50">
                                <div className="w-2 h-2 rounded-full bg-emerald-500">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                                </div>
                                <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">Delivery Excellence</span>
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
                                How We Deliver
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Comprehensive solutions for modern agriculture
                            </p>
                        </div>

                        {/* Solutions Grid */}
                        <div className="relative">
                            {/* Background decorative element */}
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 via-emerald-100 to-transparent rounded-full opacity-50"></div>

                            <div className="space-y-4">
                                {solutions.map((solution, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        className="group relative"
                                    >
                                        <div className="relative flex items-start gap-4 p-5 pl-6 rounded-2xl bg-gradient-to-r from-white via-white to-emerald-50/30 border border-slate-200/80 hover:border-emerald-300/60 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                                            {/* Animated gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-emerald-500/5 transition-all duration-700"></div>

                                            {/* Left accent bar */}
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-3/4 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full transition-all duration-500 shadow-lg shadow-emerald-500/50"></div>

                                            {/* Checkmark Icon */}
                                            <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center mt-0.5">
                                                {/* Outer glow */}
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 blur-md transition-all duration-500"></div>
                                                {/* Background circle */}
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-500"></div>
                                                {/* White inner circle */}
                                                <div className="absolute inset-[3px] rounded-full bg-white group-hover:bg-transparent transition-all duration-500"></div>
                                                {/* Icon */}
                                                <CheckCircle2 className="relative w-5 h-5 text-emerald-600 group-hover:text-white transition-all duration-500 group-hover:scale-110" strokeWidth={2.5} />
                                            </div>

                                            {/* Content */}
                                            <div className="relative flex-1 pt-1.5">
                                                <p className="text-slate-700 leading-relaxed font-medium text-base group-hover:text-slate-900 transition-colors duration-300">
                                                    {solution}
                                                </p>
                                            </div>

                                            {/* Index number badge (appears on hover) */}
                                            <div className="relative flex-shrink-0 flex items-center justify-center">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 shadow-lg shadow-emerald-500/30">
                                                    <span className="text-xs font-bold text-white">
                                                        {idx + 1}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Corner decoration */}
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/10 rounded-bl-[100%] transition-all duration-700"></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
