'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

interface ProfileCardProps {
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    status: string;
    isVerified: boolean;
    createdAt: string;
}

export function ProfileCard({
    fullName,
    email,
    phone,
    avatarUrl,
    status,
    isVerified,
    createdAt
}: ProfileCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'approved':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'rejected':
            case 'suspended':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
        >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={fullName}
                                width={80}
                                height={80}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Name and Status */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">{fullName}</h2>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
                                {status === 'active' || status === 'approved' ? (
                                    <CheckCircle2 size={12} />
                                ) : (
                                    <Shield size={12} />
                                )}
                                {status.toUpperCase()}
                            </span>
                            {isVerified && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                    <CheckCircle2 size={12} />
                                    Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Mail className="text-slate-600" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Email Address
                            </p>
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                {email}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Phone className="text-slate-600" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Phone Number
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                                {phone || 'Not provided'}
                            </p>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 md:col-span-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="text-slate-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Member Since
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                                {formatDate(createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
