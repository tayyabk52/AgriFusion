'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Sprout, Recycle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';

// --- Visualizations ---

const ScanningViz = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-800 overflow-hidden relative group-hover:border-emerald-500/30 transition-colors duration-500">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500" />
        </div>
        <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-px opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
            {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="bg-slate-900" />
            ))}
        </div>
    </div>
);

const CropListViz = () => (
    <div className="flex flex-col gap-3 p-6 w-full h-full overflow-hidden mask-image-b relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        {[
            { name: 'Wheat', yield: '+15%', color: 'text-amber-600 bg-amber-50' },
            { name: 'Corn', yield: '+12%', color: 'text-yellow-600 bg-yellow-50' },
            { name: 'Soybeans', yield: '+8%', color: 'text-emerald-600 bg-emerald-50' },
            { name: 'Rice', yield: '+10%', color: 'text-cyan-600 bg-cyan-50' },
        ].map((crop, idx) => (
            <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-100 transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", crop.color)}>
                        <Sprout size={16} />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">{crop.name}</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{crop.yield}</span>
            </motion.div>
        ))}
    </div>
);

const WasteViz = () => (
    <div className="flex items-center justify-center w-full h-full relative overflow-hidden bg-slate-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />

        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 border border-dashed border-slate-300 rounded-full flex items-center justify-center relative"
        >
            <div className="absolute inset-0 rounded-full border border-slate-100 animate-ping opacity-20" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center z-10">
                <Recycle className="text-emerald-500 w-8 h-8" />
            </div>
        </div>

        <motion.div
            className="absolute w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
            <div className="absolute top-1/2 left-[20%] w-3 h-3 bg-blue-400 rounded-full blur-[1px]" />
            <div className="absolute top-[20%] right-1/2 w-2 h-2 bg-emerald-400 rounded-full blur-[1px]" />
        </motion.div>
    </div>
);

const NetworkViz = () => (
    <div className="grid grid-cols-3 gap-3 p-5 w-full h-full opacity-90">
        {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={cn(
                    "rounded-xl border flex items-center justify-center transition-all duration-300",
                    i === 4
                        ? "bg-emerald-50 border-emerald-200 shadow-sm z-10 scale-110"
                        : "bg-white border-slate-100 text-slate-300"
                )}
            >
                {i === 4 ? (
                    <Users className="text-emerald-600 w-5 h-5" />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100" />
                )}
            </motion.div>
        ))}
    </div>
);

const features = [
    {
        Icon: ScanLine,
        name: "Smart Soil Analysis",
        description: "AI-powered soil analysis using image recognition to determine soil composition and health metrics.",
        className: "col-span-3 lg:col-span-1",
        background: <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" alt="Soil Analysis" className="w-full h-full object-cover" /></div>,
        href: "/soil-analysis",
    },
    {
        Icon: Sprout,
        name: "Intelligent Crop Mix",
        description: "Generate optimized intercropping patterns with AI predictions for maximum yield and sustainable farming.",
        className: "col-span-3 lg:col-span-2",
        background: <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80" alt="Crop Fields" className="w-full h-full object-cover" /></div>,
    },
    {
        Icon: Recycle,
        name: "Waste-to-Value Marketplace",
        description: "Transform agricultural waste into revenue by connecting with buyers seeking sustainable biomass materials.",
        className: "col-span-3 lg:col-span-2",
        background: <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" alt="Agricultural Waste" className="w-full h-full object-cover" /></div>,
    },
    {
        Icon: Users,
        name: "Expert Network",
        description: "Connect with verified agricultural experts for instant guidance and professional consultation.",
        className: "col-span-3 lg:col-span-1",
        background: <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80" alt="Expert Consultation" className="w-full h-full object-cover" /></div>,
    },
];

export const ModulesSection = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-white">
            {/* Pure white background - no gradients */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-white" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
                    >
                        Core Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">Modules</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Explore our core modules designed to revolutionize agricultural productivity.
                    </motion.p>
                </div>

                <BentoGrid>
                    {features.map((feature, idx) => (
                        <BentoCard key={idx} {...feature} index={idx} />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};
