'use client';

import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Role {
    id: string;
    title: string;
    tagline: string;
    icon: LucideIcon;
    image: string;
    description: string;
    requirements: string[];
    benefits: string[];
    color: string;
}

interface RoleCardProps {
    role: Role;
    onClick: (role: Role) => void;
}

const getColorClasses = (color: string) => {
    const colors: Record<string, { gradient: string; glow: string; hover: string }> = {
        emerald: {
            gradient: 'from-emerald-600 via-teal-500 to-emerald-500',
            glow: 'group-hover:shadow-emerald-500/30',
            hover: 'group-hover:border-emerald-400/40'
        },
        blue: {
            gradient: 'from-blue-600 via-cyan-500 to-blue-500',
            glow: 'group-hover:shadow-blue-500/30',
            hover: 'group-hover:border-blue-400/40'
        },
        violet: {
            gradient: 'from-violet-600 via-purple-500 to-violet-500',
            glow: 'group-hover:shadow-violet-500/30',
            hover: 'group-hover:border-violet-400/40'
        },
        amber: {
            gradient: 'from-amber-600 via-orange-500 to-amber-500',
            glow: 'group-hover:shadow-amber-500/30',
            hover: 'group-hover:border-amber-400/40'
        }
    };
    return colors[color] || colors.emerald;
};

export const RoleCard = ({ role, onClick }: RoleCardProps) => {
    const Icon = role.icon;
    const colorClasses = getColorClasses(role.color);

    return (
        <motion.div
            whileHover={{ y: -12, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(role)}
            className={`group relative h-[340px] sm:h-[380px] md:h-[400px] w-full cursor-pointer rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl ${colorClasses.glow} transition-all duration-500 border-2 border-slate-200 ${colorClasses.hover} bg-slate-900`}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={role.image}
                    alt={role.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40 group-hover:from-slate-950/95 group-hover:via-slate-900/70 transition-all duration-500" />

            {/* Large Background Icon */}
            <div className="absolute top-8 right-8 z-[2] opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                <Icon size={100} className="text-white" strokeWidth={1} />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8">
                {/* Top Section - Icon Badge */}
                <div className="flex justify-start items-start">
                    <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border-2 border-white/30 text-white shadow-xl"
                    >
                        <Icon size={28} strokeWidth={2} className="md:w-8 md:h-8" />
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div>
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 tracking-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300 origin-left">
                        {role.title}
                    </h3>

                    {/* Tagline */}
                    <p className="text-sm text-white/90 font-medium mb-4 md:mb-5 leading-relaxed drop-shadow">
                        {role.tagline}
                    </p>

                    {/* CTA Button */}
                    <motion.div
                        whileHover={{ x: 4 }}
                        className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                    >
                        <span>View Details</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </motion.div>
                </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 z-[15] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
        </motion.div>
    );
};
