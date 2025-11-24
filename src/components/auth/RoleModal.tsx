'use client';

import React, { useEffect } from 'react';
import { X, ShieldCheck, Briefcase, CheckCircle2, ArrowRight, LucideIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

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

interface RoleModalProps {
    role: Role | null;
    isOpen: boolean;
    onClose: () => void;
}

const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; icon: string; button: string }> = {
        emerald: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-900',
            border: 'border-emerald-100',
            icon: 'text-emerald-600',
            button: 'bg-emerald-600 hover:bg-emerald-700'
        },
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-900',
            border: 'border-blue-100',
            icon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700'
        },
        violet: {
            bg: 'bg-violet-50',
            text: 'text-violet-900',
            border: 'border-violet-100',
            icon: 'text-violet-600',
            button: 'bg-violet-600 hover:bg-violet-700'
        },
        amber: {
            bg: 'bg-amber-50',
            text: 'text-amber-900',
            border: 'border-amber-100',
            icon: 'text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700'
        }
    };
    return colors[color] || colors.emerald;
};

export const RoleModal = ({ role, isOpen, onClose }: RoleModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!role) return null;

    const Icon = role.icon;
    const theme = getColorClasses(role.color);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: "spring",
                            duration: 0.6,
                            bounce: 0.2,
                            opacity: { duration: 0.3 }
                        }}
                        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:max-h-[700px]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-slate-600 transition-all shadow-sm hover:shadow-md border border-slate-100 backdrop-blur-sm"
                        >
                            <X size={20} />
                        </button>

                        {/* LEFT SIDE: Visual Header */}
                        <div className="relative w-full md:w-[40%] h-40 md:h-auto shrink-0 overflow-hidden bg-slate-100">
                            <img
                                src={role.image}
                                alt={role.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />

                            <div className="absolute inset-0 flex flex-col justify-end p-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-wider mb-3"
                                >
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    Verified Role
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                                >
                                    {role.title}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-slate-300 font-medium leading-relaxed"
                                >
                                    {role.tagline}
                                </motion.p>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Content */}
                        <div className="flex-1 flex flex-col min-h-0 bg-white">
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Sparkles size={12} />
                                        Overview
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {role.description}
                                    </p>
                                </div>

                                {/* Compact Info Sections */}
                                <div className="space-y-5">
                                    {/* Requirements */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <Briefcase size={12} />
                                            Requirements
                                        </h4>
                                        <ul className="space-y-2">
                                            {role.requirements.map((req, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                                                    <span className="leading-relaxed">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Benefits */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} />
                                            Benefits
                                        </h4>
                                        <ul className="space-y-2">
                                            {role.benefits.map((benefit, i) => (
                                                <li key={i} className={`flex items-start gap-2 text-sm ${theme.text}`}>
                                                    <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${theme.icon}`} />
                                                    <span className="leading-relaxed">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="p-5 md:p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 shrink-0">
                                <div className="hidden sm:block">
                                    <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Next Step</span>
                                    <span className="block text-sm font-semibold text-slate-900">Registration Form</span>
                                </div>
                                <Button
                                    variant="emerald"
                                    size="lg"
                                    rounded="xl"
                                    className="flex-1 sm:flex-none"
                                    icon={<ArrowRight size={18} />}
                                    iconPosition="right"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
