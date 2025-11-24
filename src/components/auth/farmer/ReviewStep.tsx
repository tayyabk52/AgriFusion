'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Home, MapPin, Map, Ruler, Sprout, CheckCircle } from 'lucide-react';

interface ReviewStepProps {
    formData: {
        fullName: string;
        email: string;
        phone: string;
        farmName: string;
        state: string;
        district: string;
        landSize: string;
        currentCrops: string[];
    };
}

export const ReviewStep = ({ formData }: ReviewStepProps) => {
    const sections = [
        {
            title: "Personal Information",
            icon: User,
            items: [
                { label: "Full Name", value: formData.fullName, icon: User },
                { label: "Email", value: formData.email, icon: Mail },
                { label: "Phone", value: formData.phone, icon: Phone }
            ]
        },
        {
            title: "Farm Details",
            icon: Home,
            items: [
                { label: "Farm Name", value: formData.farmName, icon: Home },
                { label: "State", value: formData.state, icon: Map },
                { label: "District", value: formData.district, icon: MapPin },
                { label: "Land Size", value: `${formData.landSize} acres`, icon: Ruler }
            ]
        },
        {
            title: "Current Crops",
            icon: Sprout,
            items: []
        }
    ];

    return (
        <div className="space-y-5">
            {/* Compact Success Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                className="flex justify-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CheckCircle size={32} className="text-white" strokeWidth={2.5} />
                </div>
            </motion.div>

            {/* Compact Title */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Review Your Information
                </h3>
                <p className="text-xs text-slate-600">
                    Verify all details before submitting
                </p>
            </div>

            {/* Review Sections - Premium Compact Cards */}
            <div className="space-y-3">
                {sections.map((section, sectionIdx) => {
                    const SectionIcon = section.icon;
                    return (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + sectionIdx * 0.08 }}
                            className="relative bg-white rounded-xl p-4 border-2 border-slate-200/80 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden group"
                        >
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-teal-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                                        <SectionIcon size={16} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900">{section.title}</h4>
                                </div>

                                {section.title === "Current Crops" ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {formData.currentCrops.map((crop, idx) => (
                                            <motion.span
                                                key={crop}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 + idx * 0.03 }}
                                                className="px-2.5 py-1 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-sm"
                                            >
                                                {crop}
                                            </motion.span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {section.items.map((item) => {
                                            const ItemIcon = item.icon;
                                            return (
                                                <div key={item.label} className="flex items-start gap-2 text-xs">
                                                    <div className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center mt-0.5 shrink-0">
                                                        <ItemIcon size={10} className="text-emerald-600" strokeWidth={2.5} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-slate-500 font-medium">{item.label}:</span>
                                                        <span className="ml-1.5 text-slate-900 font-bold break-words">{item.value}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Important Note - Compact */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200"
            >
                <p className="text-xs text-blue-900 leading-relaxed">
                    <span className="font-bold">Note:</span> Your registration will be reviewed. You'll receive email notification once approved.
                </p>
            </motion.div>
        </div>
    );
};
