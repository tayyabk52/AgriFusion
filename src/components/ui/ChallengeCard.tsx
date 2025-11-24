'use client';

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface ChallengeCardProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    description: string;
    stats: Array<{ label: string; value: string }>;
    statusText: string;
    statusColor: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
    icon: Icon,
    title,
    subtitle,
    description,
    stats,
    statusText,
    statusColor,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`relative transition-all duration-500 ${isExpanded ? 'mb-48 md:mb-0 z-30' : 'z-10'}`}
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Main Card - Always Visible */}
            <div className={`relative w-full h-32 rounded-3xl backdrop-blur-sm border border-slate-200/50 shadow-lg transition-all duration-500 ease-out cursor-pointer z-20 ${isExpanded ? 'bg-gradient-to-br from-emerald-50 to-white' : 'bg-white/90'
                }`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 rounded-3xl transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'
                    }`} />

                <div className="relative p-6 flex items-center gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-md transition-transform duration-500 ${isExpanded ? 'scale-110' : 'scale-100'
                        }`}>
                        <Icon className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className={`text-xl font-bold truncate transition-colors ${isExpanded ? 'text-emerald-700' : 'text-slate-900'
                            }`}>
                            {title}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium truncate">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Expandable Details Card - Shows on Hover/Click */}
            <div className={`absolute top-0 left-0 w-full rounded-3xl bg-white border border-slate-200/50 shadow-xl transition-all duration-500 ease-out overflow-hidden z-10 ${isExpanded ? 'h-[320px] shadow-2xl' : 'h-32'
                }`}>
                <div className={`transition-opacity duration-300 p-6 pt-40 ${isExpanded ? 'opacity-100 delay-300' : 'opacity-0'
                    }`}>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center p-3 rounded-xl bg-slate-50">
                                <div className="text-xs text-slate-500 mb-1 font-medium">{stat.label}</div>
                                <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="absolute bottom-0 left-0 right-0 h-12 rounded-b-3xl flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                        style={{ backgroundColor: statusColor }}
                    >
                        {statusText}
                    </div>
                </div>
            </div>
        </div>
    );
};
