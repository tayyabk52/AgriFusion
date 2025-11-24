'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone } from 'lucide-react';

interface PersonalInfoStepProps {
    formData: {
        fullName: string;
        email: string;
        phone: string;
    };
    onChange: (field: string, value: string) => void;
    errors: Record<string, string>;
}

export const PersonalInfoStep = ({ formData, onChange, errors }: PersonalInfoStepProps) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
        >
            {/* Full Name */}
            <motion.div variants={itemVariants}>
                <label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <User size={12} className="text-white" strokeWidth={2.5} />
                    </div>
                    Full Name
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => onChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                            } outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium`}
                    />
                </div>
                {errors.fullName && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                    >
                        {errors.fullName}
                    </motion.p>
                )}
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
                <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Mail size={12} className="text-white" strokeWidth={2.5} />
                    </div>
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                        } outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium`}
                />
                {errors.email && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1.5"
                    >
                        {errors.email}
                    </motion.p>
                )}
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Phone size={12} className="text-white" strokeWidth={2.5} />
                    </div>
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                        } outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium`}
                />
                {errors.phone && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1.5"
                    >
                        {errors.phone}
                    </motion.p>
                )}
                <p className="text-xs text-slate-500 mt-1.5 italic">
                    We'll use this to send you important updates
                </p>
            </motion.div>
        </motion.div>
    );
};
