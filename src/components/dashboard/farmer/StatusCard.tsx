'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, AlertCircle, LucideIcon } from 'lucide-react';

interface StatusCardProps {
    title: string;
    status: 'verified' | 'pending' | 'assigned' | 'not-assigned' | 'active' | 'rejected';
    message: string;
    icon?: LucideIcon;
    delay?: number;
    actionText?: string;
    onAction?: () => void;
}

export function StatusCard({
    title,
    status,
    message,
    icon,
    delay = 0,
    actionText,
    onAction
}: StatusCardProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'verified':
            case 'active':
            case 'assigned':
                return {
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    textColor: 'text-emerald-700',
                    Icon: CheckCircle2
                };
            case 'pending':
            case 'not-assigned':
                return {
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    textColor: 'text-amber-700',
                    Icon: Clock
                };
            case 'rejected':
                return {
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    textColor: 'text-red-700',
                    Icon: XCircle
                };
            default:
                return {
                    bgColor: 'bg-slate-50',
                    borderColor: 'border-slate-200',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-600',
                    textColor: 'text-slate-700',
                    Icon: AlertCircle
                };
        }
    };

    const config = getStatusConfig();
    const StatusIcon = icon || config.Icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className={`${config.bgColor} border ${config.borderColor} rounded-xl p-3 shadow-sm hover:shadow-md transition-all h-full flex flex-col`}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className={config.iconColor} size={16} strokeWidth={2.5} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">
                    {title}
                </h3>
            </div>
            <p className={`text-xs ${config.textColor} leading-snug flex-1`}>
                {message}
            </p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className={`mt-2 w-full py-1.5 ${config.iconBg} ${config.iconColor} text-xs font-bold rounded-lg hover:shadow-sm transition-all`}
                >
                    {actionText}
                </button>
            )}
        </motion.div>
    );
}
