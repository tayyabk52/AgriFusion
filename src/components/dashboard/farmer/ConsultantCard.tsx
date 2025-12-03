'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, Award, Briefcase, MapPin, UserCheck, Clock } from 'lucide-react';
import Image from 'next/image';

interface ConsultantCardProps {
    consultantName?: string;
    consultantEmail?: string;
    consultantPhone?: string;
    consultantAvatar?: string;
    qualification?: string;
    experienceYears?: number;
    specializationAreas?: string[];
}

export function ConsultantCard({
    consultantName,
    consultantEmail,
    consultantPhone,
    consultantAvatar,
    qualification,
    experienceYears,
    specializationAreas
}: ConsultantCardProps) {
    // Safely handle null/undefined values
    const specializations = specializationAreas || [];
    const hasConsultant = consultantName || consultantEmail;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                        <GraduationCap className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Your Consultant</h3>
                        <p className="text-xs text-slate-500">Expert guidance and support</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {!hasConsultant ? (
                    /* Placeholder when no consultant assigned */
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Clock className="text-indigo-500" size={28} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Consultant Assignment Pending</h4>
                        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                            A qualified agricultural consultant will be assigned to you shortly.
                            They will help you optimize your farming practices and maximize your yields.
                        </p>
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl inline-block">
                            <p className="text-xs text-blue-700 font-semibold">
                                👨‍🌾 Our team is reviewing your profile
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Display consultant info */
                    <div className="space-y-5">
                        {/* Consultant Profile Header */}
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md flex-shrink-0">
                                {consultantAvatar ? (
                                    <Image
                                        src={consultantAvatar}
                                        alt={consultantName || 'Consultant'}
                                        width={64}
                                        height={64}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                        {consultantName?.charAt(0).toUpperCase() || 'C'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-slate-900 mb-1 truncate">
                                    {consultantName}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                        <UserCheck size={12} />
                                        Active
                                    </span>
                                    {experienceYears && (
                                        <span className="text-xs text-slate-600 font-medium">
                                            {experienceYears}+ years exp.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Consultant Details */}
                        <div className="space-y-3">
                            {/* Qualification */}
                            {qualification && (
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Award className="text-blue-600" size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                            Qualification
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {qualification}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            {consultantEmail && (
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <Mail className="text-slate-600" size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                            Email
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {consultantEmail}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Phone */}
                            {consultantPhone && (
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <Phone className="text-slate-600" size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                            Phone
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {consultantPhone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Specialization Areas */}
                            {specializations.length > 0 && (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Briefcase className="text-indigo-600" size={16} />
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Specialization
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {specializations.map((area, index) => (
                                            <span
                                                key={index}
                                                className="inline-block px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
