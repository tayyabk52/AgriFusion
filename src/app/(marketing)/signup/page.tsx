'use client';

import React, { useState } from 'react';
import { RoleCard } from '@/components/auth/RoleCard';
import { RoleModal } from '@/components/auth/RoleModal';
import { motion } from 'framer-motion';
import {
    Sprout,
    Briefcase,
    GraduationCap,
    ShoppingBag,
    ArrowRight,
} from 'lucide-react';

const ROLES = [
    {
        id: 'farmer',
        title: 'Farmer',
        tagline: 'Optimize your yield with AI insights',
        icon: Sprout,
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
        description: 'Join as a Farmer to access personalized crop planning, soil analysis tools, and connect with experts to maximize your harvest potential.',
        requirements: ['Valid Phone Number', 'Farm Location Details', 'Land Size Information'],
        benefits: ['AI Crop Recommendations', 'Direct Expert Access', 'Waste Selling Marketplace'],
        color: 'emerald'
    },
    {
        id: 'consultant',
        title: 'Consultant',
        tagline: 'Manage farms & advise growers',
        icon: Briefcase,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        description: 'Register as a Consultant to manage multiple farm profiles, interpret soil data, and bridge the gap between technology and traditional farming.',
        requirements: ['Professional License / Certificate', 'Years of Experience', 'Field Expertise Areas'],
        benefits: ['Client Management Dashboard', 'Advanced Analysis Tools', 'Network with Experts'],
        color: 'blue'
    },
    {
        id: 'expert',
        title: 'Agricultural Expert',
        tagline: 'Solve complex agricultural challenges',
        icon: GraduationCap,
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
        description: 'Join our panel of specialists to resolve high-level queries, verify specific crop diseases, and provide scientific guidance to the community.',
        requirements: ['Advanced Degree / Certification', 'Specialization Proof', 'Availability Schedule'],
        benefits: ['Paid Consultation Opportunities', 'Professional Recognition', 'Research Data Access'],
        color: 'violet'
    },
    {
        id: 'buyer',
        title: 'Industry Buyer',
        tagline: 'Source sustainable biomass',
        icon: ShoppingBag,
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
        description: 'Register your business to browse and purchase agricultural waste directly from farmers for biomass, recycling, or industrial use.',
        requirements: ['Registered Business Name', 'Material Requirements', 'Business Contact Info'],
        benefits: ['Direct Marketplace Access', 'Verified Seller Network', 'Transparent Pricing'],
        color: 'amber'
    }
];

export default function SignupPage() {
    const [selectedRole, setSelectedRole] = useState<typeof ROLES[0] | null>(null);

    return (
        <div className="bg-white">
            <div className="relative min-h-screen pt-32 pb-20 px-6">
                {/* Ambient Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-white to-white opacity-60" />
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Premium Header */}
                    <div className="text-center max-w-4xl mx-auto mb-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                            className="space-y-6"
                        >
                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight"
                            >
                                Choose your{' '}
                                <span className="relative inline-block">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 animate-[gradient_3s_ease_infinite]" style={{
                                        backgroundSize: '200% 200%'
                                    }}>
                                        path
                                    </span>
                                    {/* Underline decoration */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 rounded-full origin-left"
                                    />
                                </span>
                            </motion.h1>

                            {/* Description with better typography */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="max-w-2xl mx-auto"
                            >
                                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                                    AgriFusion connects the entire agricultural supply chain. Select your role to begin your tailored registration process.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-sm sm:max-w-2xl lg:max-w-7xl mx-auto">
                        {ROLES.map((role, index) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <RoleCard
                                    role={role}
                                    onClick={setSelectedRole}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Login Link Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="mt-20 flex justify-center"
                    >
                        <div className="relative group">
                            {/* Background glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                            {/* Card */}
                            <div className="relative px-8 py-5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-lg group-hover:border-emerald-200/60 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-600 text-sm font-medium">
                                        Already have an account?
                                    </span>
                                    <a
                                        href="/signin"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group/btn"
                                    >
                                        <span>Log in here</span>
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <RoleModal
                role={selectedRole}
                isOpen={!!selectedRole}
                onClose={() => setSelectedRole(null)}
            />
        </div>
    );
}
