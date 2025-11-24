'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, FlaskConical, Sprout, Layers, Recycle, UserCheck, MessageCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/Button';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Floating Card Component
const FloatingCard = ({
    icon: Icon,
    label,
    value,
    delay,
    className
}: {
    icon: React.ElementType,
    label: string,
    value: string,
    delay: number,
    className?: string
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as any }}
        className={cn(
            "absolute p-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 z-20",
            className
        )}
    >
        <div className="p-3 bg-emerald-100/50 rounded-xl text-emerald-600">
            <Icon size={24} strokeWidth={2.5} />
        </div>
        <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-lg font-bold text-slate-900">{value}</p>
        </div>
    </motion.div>
);

export const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, 200]);
    const y3 = useTransform(scrollY, [0, 500], [0, 300]);

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-slate-50 flex items-center pt-20">

            {/* BACKGROUND: Paper Cut Layers */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Layer 1 (Furthest) */}
                <motion.div style={{ y: y1 }} className="absolute bottom-0 left-0 right-0 h-[80%]">
                    <svg viewBox="0 0 1440 800" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                        <path
                            fill="#d1fae5" // emerald-100
                            fillOpacity="0.6"
                            d="M0,256L60,261.3C120,267,240,277,360,261.3C480,245,600,203,720,202.7C840,203,960,245,1080,261.3C1200,277,1320,267,1380,261.3L1440,256L1440,800L1380,800C1320,800,1200,800,1080,800C960,800,840,800,720,800C600,800,480,800,360,800C240,800,120,800,60,800L0,800Z"
                            style={{ filter: 'drop-shadow(0px -4px 10px rgba(0,0,0,0.02))' }}
                        />
                    </svg>
                </motion.div>

                {/* Layer 2 */}
                <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 right-0 h-[70%]">
                    <svg viewBox="0 0 1440 700" className="w-full h-full" preserveAspectRatio="none">
                        <path
                            fill="#a7f3d0" // emerald-200
                            fillOpacity="0.7"
                            d="M0,192L80,197.3C160,203,320,213,480,197.3C640,181,800,139,960,144C1120,149,1280,203,1360,229.3L1440,256L1440,700L1360,700C1280,700,1120,700,960,700C800,700,640,700,480,700C320,700,160,700,80,700L0,700Z"
                            style={{ filter: 'drop-shadow(0px -6px 15px rgba(16, 185, 129, 0.1))' }}
                        />
                    </svg>
                </motion.div>

                {/* Layer 3 */}
                <motion.div style={{ y: y3 }} className="absolute bottom-0 left-0 right-0 h-[50%]">
                    <svg viewBox="0 0 1440 500" className="w-full h-full" preserveAspectRatio="none">
                        <path
                            fill="#34d399" // emerald-400
                            fillOpacity="0.8"
                            d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,149.3C840,139,960,149,1080,165.3C1200,181,1320,203,1380,213.3L1440,224L1440,500L1380,500C1320,500,1200,500,1080,500C960,500,840,500,720,500C600,500,480,500,360,500C240,500,120,500,60,500L0,500Z"
                            style={{ filter: 'drop-shadow(0px -8px 20px rgba(5, 150, 105, 0.15))' }}
                        />
                    </svg>
                </motion.div>

                {/* Layer 4 (Closest - Right Side Accent) */}
                <motion.div className="absolute bottom-0 right-0 w-[60%] h-[40%] z-10">
                    <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="none">
                        <path
                            fill="#059669" // emerald-600
                            fillOpacity="0.9"
                            d="M0,160L40,170.7C80,181,160,203,240,197.3C320,192,400,160,480,144C560,128,640,128,720,138.7L800,149.3L800,400L720,400C640,400,560,400,480,400C400,400,320,400,240,400C160,400,80,400,40,400L0,400Z"
                            style={{ filter: 'drop-shadow(0px -10px 25px rgba(4, 120, 87, 0.2))' }}
                        />
                    </svg>
                </motion.div>
            </div>

            {/* CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT COLUMN: Typography & CTA */}
                <div className="flex flex-col gap-8 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                            Cultivating the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                Future of Farming
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
                            Empowering farmers with <span className="text-emerald-700">data-driven insights</span>, <span className="text-emerald-700">sustainable practices</span>, and advanced analytics to <span className="text-slate-900">maximize yield</span> and minimize impact.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <Button
                            variant="premium"
                            rounded="full"
                            size="xl"
                            className="px-8 py-4 shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-900/30"
                            icon={<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            iconPosition="right"
                        >
                            Get Started Now
                        </Button>

                        {/* Updated Button: Soil Analysis */}
                        <Button
                            variant="glass"
                            rounded="full"
                            size="xl"
                            className="px-8 py-4"
                            icon={
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                    <FlaskConical size={16} fill="currentColor" className="opacity-80" />
                                </div>
                            }
                        >
                            Soil Analysis
                        </Button>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: Visual Composition */}
                <div className="relative h-[600px] hidden lg:block perspective-1000">
                    {/* Floating Cards Composition */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full"
                    >
                        {/* Main Abstract Shape/Image Placeholder */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full blur-3xl opacity-60" />

                        {/* Card 1: Intercropping */}
                        <FloatingCard
                            icon={Layers}
                            label="Intercropping"
                            value="Maize + Beans"
                            delay={0.4}
                            className="top-[20%] right-[10%]"
                        />

                        {/* Card 2: Soil Type */}
                        <FloatingCard
                            icon={Sprout}
                            label="Soil Type"
                            value="Loamy / Fertile"
                            delay={0.6}
                            className="bottom-[30%] left-[5%]"
                        />

                        {/* Card 3: Waste Management */}
                        <FloatingCard
                            icon={Recycle}
                            label="Waste Mgmt"
                            value="2 Buyers Found"
                            delay={0.8}
                            className="top-[40%] left-[20%] scale-90 opacity-80 blur-[1px]"
                        />

                        {/* Central Visual Element: Expert Hiring Profile */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Expert Header */}
                            <div className="p-6 pb-4 border-b border-white/50 flex justify-between items-center">
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/50 px-2 py-1 rounded-lg">
                                    Top Expert
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">Online</span>
                                </div>
                            </div>

                            {/* Expert Profile */}
                            <div className="p-6 flex flex-col items-center text-center gap-3">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                    <UserCheck size={40} className="text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Dr. Sarah Khan</h3>
                                    <p className="text-sm text-slate-500 font-medium">Senior Agronomist • PhD</p>
                                </div>

                                <div className="flex gap-2 mt-2 w-full">
                                    <div className="flex-1 p-2 bg-white/50 rounded-xl border border-white/50">
                                        <p className="text-xs text-slate-400 uppercase">Exp</p>
                                        <p className="font-bold text-slate-700">12 Yrs</p>
                                    </div>
                                    <div className="flex-1 p-2 bg-white/50 rounded-xl border border-white/50">
                                        <p className="text-xs text-slate-400 uppercase">Rating</p>
                                        <p className="font-bold text-slate-700">4.9/5</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="p-4 pt-0">
                                <Button
                                    variant="emerald"
                                    rounded="xl"
                                    fullWidth
                                    className="py-3 shadow-lg shadow-emerald-200"
                                    icon={<MessageCircle size={18} />}
                                >
                                    Connect Now
                                </Button>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};
