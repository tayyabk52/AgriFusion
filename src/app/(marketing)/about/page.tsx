'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Target, Eye, CheckCircle2, Sprout, Users, Recycle, TrendingUp, Globe, Lightbulb } from 'lucide-react';
import { ChallengeCard } from '@/components/ui/ChallengeCard';
import { PremiumMissionCard } from '@/components/ui/PremiumMissionCard';
import { PremiumVisionCard } from '@/components/ui/PremiumVisionCard';

export default function AboutPage() {
    const solutions = [
        'AI-powered crop combination recommendations using intercropping methods',
        'Waste-to-value marketplace connecting farmers with buyers',
        'Online expert consultation for guidance and decision-making',
        'Personal dashboards tracking soil health and crop performance',
    ];

    const visionPoints = [
        'Make farming accessible through intelligent technology',
        'Connect farmers, experts, and buyers in one ecosystem',
        'Promote sustainable and profitable agriculture',
        'Bridge the gap between traditional and modern farming',
    ];

    return (
        <div className="bg-white">
            {/* Hero Section - Pure White Background */}
            <section className="relative min-h-screen w-full flex items-center justify-center pt-32 pb-32 selection:bg-emerald-100 selection:text-emerald-900 bg-white">
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
                            Cultivating Excellence <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" style={{
                                backgroundSize: '200% 200%',
                                animation: 'gradient-x 3s ease infinite'
                            }}>
                                Together
                            </span>
                        </h1>

                        <p className="text-lg text-slate-600 leading-relaxed">
                            At AgriFusion, we believe in the power of <span className="text-emerald-600 font-semibold">collaboration</span> and <span className="text-emerald-600 font-semibold">technology</span> to transform agriculture.
                            We work hand-in-hand with farmers, experts, and buyers to create a sustainable ecosystem.
                        </p>
                    </div>

                    {/* Connected Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 shadow-xl shadow-slate-200/50 rounded-2xl bg-white ring-1 ring-slate-200/50 relative z-50">

                        {/* Card 1 */}
                        <div className="group relative h-full p-8 bg-white border border-slate-200/50 rounded-none first:rounded-l-2xl last:rounded-r-2xl hover:bg-slate-50 transition-all duration-500 ease-out overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 border-r-0 last:border-r">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/0 group-hover:from-slate-50/30 group-hover:to-slate-50/30 transition-all duration-700" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-300 transition-all duration-500" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-6">
                                        <span className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase mt-2">
                                            Focus
                                        </span>
                                        <span className="text-6xl font-serif font-bold text-slate-100 group-hover:text-slate-200 transition-colors duration-500 select-none">
                                            01
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors">
                                        AI-Powered Farming
                                    </h3>

                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        Leveraging computer vision and machine learning to optimize crop yields and reduce resource waste.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative h-full p-8 bg-white border border-slate-200/50 rounded-none first:rounded-l-2xl last:rounded-r-2xl hover:bg-slate-50 transition-all duration-500 ease-out overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 border-r-0 last:border-r">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/0 group-hover:from-slate-50/30 group-hover:to-slate-50/30 transition-all duration-700" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-300 transition-all duration-500" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-6">
                                        <span className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase mt-2">
                                            Mission
                                        </span>
                                        <span className="text-6xl font-serif font-bold text-slate-100 group-hover:text-slate-200 transition-colors duration-500 select-none">
                                            02
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors">
                                        Sustainable Agriculture
                                    </h3>

                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        Developing eco-friendly protocols that regenerate soil health while maintaining high-volume production.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative h-full p-8 bg-white border border-slate-200/50 rounded-none first:rounded-l-2xl last:rounded-r-2xl hover:bg-slate-50 transition-all duration-500 ease-out overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 border-r-0 last:border-r">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/0 group-hover:from-slate-50/30 group-hover:to-slate-50/30 transition-all duration-700" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-300 transition-all duration-500" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-6">
                                        <span className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase mt-2">
                                            Impact
                                        </span>
                                        <span className="text-6xl font-serif font-bold text-slate-100 group-hover:text-slate-200 transition-colors duration-500 select-none">
                                            03
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors">
                                        Farmer Empowerment
                                    </h3>

                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        Connecting local growers directly to global markets, ensuring fair trade prices and community growth.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Challenges Section - Interactive Cards */}
            <section className="py-16 px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Challenges</span> We Address
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto">
                            <span className="hidden md:inline">Hover over</span><span className="md:hidden">Tap</span> each card to discover more details
                        </p>
                    </motion.div>

                    {/* Responsive Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1: Crop Planning */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <ChallengeCard
                                icon={TrendingUp}
                                title="Crop Planning"
                                subtitle="Optimization Challenge"
                                description="Farmers struggle with selecting optimal crop combinations for intercropping and maintaining soil health across seasons. Traditional methods often lead to suboptimal yields and soil degradation."
                                stats={[
                                    { label: 'Affected Farmers', value: '60%' },
                                    { label: 'Yield Loss', value: '30%' },
                                ]}
                                statusText="AI-Powered Solution Available"
                                statusColor="#10b981"
                            />
                        </motion.div>

                        {/* Card 2: Expert Access */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <ChallengeCard
                                icon={Users}
                                title="Expert Access"
                                subtitle="Consultation Barrier"
                                description="Rural farmers lack affordable and accessible agricultural consultation due to geographic isolation, limited education, and financial constraints. This knowledge gap prevents adoption of modern practices."
                                stats={[
                                    { label: 'Rural Areas', value: '75%' },
                                    { label: 'Cost Barrier', value: 'High' },
                                ]}
                                statusText="Online Network Available"
                                statusColor="#0ea5e9"
                            />
                        </motion.div>

                        {/* Card 3: Waste Management */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <ChallengeCard
                                icon={Recycle}
                                title="Waste Management"
                                subtitle="Revenue Loss"
                                description="Farm waste creates environmental pollution through burning and improper disposal, while farmers miss opportunities to generate additional income from valuable byproducts and organic materials."
                                stats={[
                                    { label: 'Waste Generated', value: '40%' },
                                    { label: 'Lost Revenue', value: '$$$' },
                                ]}
                                statusText="Marketplace Solution Ready"
                                statusColor="#f59e0b"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section - Premium Design */}
            <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
                <PremiumMissionCard
                    title="Our Mission"
                    description="To revolutionize agriculture by providing an AI-powered platform that helps farmers increase productivity, maximize profitability, and embrace sustainable farming practices."
                    solutions={solutions}
                    icon={<Target className="w-6 h-6 text-emerald-600" />}
                />
            </section>

            {/* Vision Section - Premium Design */}
            <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
                <PremiumVisionCard
                    title="Future Forward"
                    description="To create a world where every farmer has access to intelligent tools and expert guidance, enabling them to grow more with less while preserving our planet for future generations."
                    visionPoints={visionPoints}
                    icon={<Eye className="w-6 h-6 text-slate-900" />}
                />
            </section>
        </div>
    );
}
