'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Lightbulb } from 'lucide-react';

interface PremiumVisionCardProps {
    title: string;
    description: string;
    visionPoints: string[];
    icon?: React.ReactNode;
}

export const PremiumVisionCard: React.FC<PremiumVisionCardProps> = ({
    title,
    description,
    visionPoints,
    icon
}) => {
    return (
        <div className="relative w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row-reverse gap-8 items-stretch">
                {/* Premium Night Landscape Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative lg:w-1/2"
                >
                    <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                        {/* Landscape Section - Night theme */}
                        <div className="absolute inset-0">
                            {/* Night Sky with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-indigo-800 to-blue-700" />

                            {/* Stars */}
                            <div className="absolute top-[10%] left-[15%] w-1 h-1 rounded-full bg-white animate-pulse" />
                            <div className="absolute top-[15%] left-[35%] w-1 h-1 rounded-full bg-white animate-pulse delay-100" />
                            <div className="absolute top-[8%] right-[25%] w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-200" />
                            <div className="absolute top-[20%] right-[15%] w-1 h-1 rounded-full bg-white animate-pulse" />
                            <div className="absolute top-[12%] left-[60%] w-1 h-1 rounded-full bg-white animate-pulse delay-300" />

                            {/* Moon */}
                            <div className="absolute top-[15%] right-[15%] w-20 h-20">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[0_0_50px_rgba(255,255,255,0.5)]" />
                                <div className="absolute inset-0 rounded-full bg-white opacity-30 scale-[1.3]" />
                                <div className="absolute inset-0 rounded-full bg-white opacity-10 scale-[1.6]" />
                                {/* Moon crater */}
                                <div className="absolute top-[30%] left-[25%] w-3 h-3 rounded-full bg-slate-200 opacity-40" />
                                <div className="absolute top-[50%] right-[30%] w-2 h-2 rounded-full bg-slate-200 opacity-30" />
                            </div>

                            {/* Fields - Lower section with night tones */}
                            <div className="absolute bottom-0 w-full h-[35%] bg-gradient-to-b from-blue-800 to-blue-900 overflow-hidden">
                                {/* Field rows with moonlight reflection */}
                                <div className="absolute top-[10%] left-[30%] w-14 h-1 bg-slate-300 opacity-25" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 70% 100%, 30% 100%)' }} />
                                <div className="absolute top-[22%] left-[38%] w-24 h-1 bg-slate-300 opacity-25" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 70% 100%, 30% 100%)' }} />
                                <div className="absolute top-[35%] right-[15%] w-18 h-0.5 bg-slate-300 opacity-20" style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }} />
                                <div className="absolute top-[48%] right-[22%] w-22 h-0.5 bg-slate-300 opacity-20" style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }} />
                            </div>

                            {/* Hill 1 - Right side with night tones */}
                            <div className="absolute right-[-15%] bottom-[25%] w-40 h-12 rounded-full bg-indigo-900 z-10" />

                            {/* Hill 2 - Right side deeper */}
                            <div className="absolute right-[-25%] bottom-[15%] w-40 h-20 rounded-full bg-indigo-950 z-10" />

                            {/* Hill 3 - Left foreground */}
                            <div className="absolute left-[-60%] bottom-[-20%] w-96 h-40 rounded-full bg-blue-950 z-20" />

                            {/* Trees silhouette on left hill */}
                            <div className="absolute bottom-[22%] left-[5%] w-12 h-16 z-[5]">
                                <svg viewBox="0 0 64 64" fill="#1e3a8a" className="drop-shadow-lg opacity-80">
                                    <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
                                </svg>
                            </div>

                            <div className="absolute bottom-[16%] left-[22%] w-12 h-16 z-[5]">
                                <svg viewBox="0 0 64 64" fill="#1e40af" className="drop-shadow-lg opacity-80">
                                    <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
                                </svg>
                            </div>

                            {/* Hill 4 - Right foreground */}
                            <div className="absolute right-[-60%] bottom-[-30%] w-96 h-40 rounded-full bg-indigo-950 z-20" />

                            {/* Trees silhouette on right hill */}
                            <div className="absolute bottom-[12%] right-[2%] w-16 h-20 z-[5]">
                                <svg viewBox="0 0 64 64" fill="#1e3a8a" className="drop-shadow-lg opacity-80">
                                    <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
                                </svg>
                            </div>

                            {/* Moonlight overlay filter */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-300/10 via-transparent to-blue-950/20 z-40 pointer-events-none" />
                        </div>

                        {/* Content Overlay - Top section */}
                        <div className="absolute top-0 left-0 right-0 p-6 z-50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                                        {icon || <Eye className="w-6 h-6 text-slate-900" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold tracking-wider uppercase text-white">Our Vision</p>
                                        <h3 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Overlay - Bottom section */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6 z-50 rounded-b-3xl">
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                {description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-3">
                                <span className="font-semibold">Future of Farming</span>
                                <span>{visionPoints.length} Key Goals</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Vision Points List */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="lg:w-1/2 flex flex-col justify-center"
                >
                    <div className="space-y-5">
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4 border border-blue-100/50">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-xs font-bold tracking-wider uppercase text-blue-700">Future Vision</span>
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
                                Our Vision
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Building a sustainable agricultural future
                            </p>
                        </div>

                        {/* Vision Points Grid */}
                        {visionPoints.map((point, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="group relative"
                            >
                                {/* Decorative line connector (except for last item) */}
                                {idx < visionPoints.length - 1 && (
                                    <div className="absolute left-[23px] top-[60px] w-0.5 h-[calc(100%+8px)] bg-gradient-to-b from-blue-200 via-blue-100 to-transparent group-hover:from-blue-400 group-hover:via-blue-200 transition-all duration-500"></div>
                                )}

                                <div className="relative flex items-start gap-5 p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/80 hover:border-blue-300/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-700"></div>

                                    {/* Number Badge */}
                                    <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                        {/* Outer ring */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110"></div>
                                        {/* Inner ring */}
                                        <div className="absolute inset-[2px] rounded-2xl bg-white group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-500"></div>
                                        {/* Number */}
                                        <span className="relative text-xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="relative flex-1 pt-1">
                                        <p className="text-slate-700 leading-relaxed font-medium text-base group-hover:text-slate-900 transition-colors duration-300">
                                            {point}
                                        </p>
                                    </div>

                                    {/* Icon indicator */}
                                    <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                                        <Lightbulb className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
