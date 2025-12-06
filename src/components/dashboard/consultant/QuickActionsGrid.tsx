'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Recycle, MessageSquarePlus, UserPlus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QUICK_ACTIONS = [
    {
        id: 'crop-rec',
        label: 'New Crop',
        sublabel: 'Recommendation',
        icon: Sprout,
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-50 to-teal-50',
        hoverBg: 'group-hover:from-emerald-100 group-hover:to-teal-100',
    },
    {
        id: 'waste',
        label: 'Record',
        sublabel: 'Waste',
        icon: Recycle,
        gradient: 'from-teal-500 to-cyan-600',
        bgGradient: 'from-teal-50 to-cyan-50',
        hoverBg: 'group-hover:from-teal-100 group-hover:to-cyan-100',
    },
    {
        id: 'query',
        label: 'Create',
        sublabel: 'Query',
        icon: MessageSquarePlus,
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-50 to-indigo-50',
        hoverBg: 'group-hover:from-blue-100 group-hover:to-indigo-100',
    },
    {
        id: 'register',
        label: 'Register',
        sublabel: 'Farmer',
        icon: UserPlus,
        gradient: 'from-emerald-600 to-teal-600',
        isPrimary: true,
    },
];

export const QuickActionsGrid = () => {
    const router = useRouter();

    const handleActionClick = (actionId: string) => {
        switch (actionId) {
            case 'register':
                router.push('/dashboard/consultant/farmer-network');
                break;
            case 'waste':
                router.push('/dashboard/consultant/waste');
                break;
            case 'query':
                router.push('/dashboard/consultant/queries');
                break;
            case 'crop-rec':
                // Future feature - could navigate to crop recommendations page
                console.log('Crop recommendations feature coming soon');
                break;
            default:
                break;
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {QUICK_ACTIONS.map((action, index) => (
                <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleActionClick(action.id)}
                    aria-label={`${action.label} ${action.sublabel}`}
                    className={`p-4 sm:p-5 rounded-2xl shadow-md transition-all duration-300 text-left group relative overflow-hidden ${action.isPrimary
                            ? `bg-gradient-to-br ${action.gradient} shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50`
                            : `bg-white border border-slate-100 hover:shadow-lg hover:border-slate-200`
                        }`}
                >
                    {/* Background for non-primary */}
                    {!action.isPrimary && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} ${action.hoverBg} transition-all duration-300 opacity-80`} />
                    )}

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${action.isPrimary
                                ? 'bg-white/20 text-white backdrop-blur-sm group-hover:bg-white/30'
                                : `bg-white/60 backdrop-blur-sm group-hover:bg-white group-hover:shadow-md`
                            }`}>
                            <action.icon
                                size={20}
                                strokeWidth={2.5}
                                className={action.isPrimary ? '' : `text-slate-700 bg-gradient-to-br ${action.gradient} bg-clip-text`}
                            />
                        </div>

                        {/* Text */}
                        <div className="mb-1">
                            <p className={`text-xs sm:text-sm font-bold leading-tight mb-0.5 ${action.isPrimary ? 'text-white' : 'text-slate-900'
                                }`}>
                                {action.label}
                            </p>
                            <p className={`text-[10px] sm:text-xs font-semibold leading-tight ${action.isPrimary ? 'text-white/90' : 'text-slate-600'
                                }`}>
                                {action.sublabel}
                            </p>
                        </div>

                        {/* Arrow Indicator - hidden on mobile */}
                        <motion.div
                            initial={{ x: -5, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            className={`hidden sm:block absolute bottom-4 right-4 ${action.isPrimary ? 'text-white/70' : 'text-slate-400'
                                }`}
                        >
                            <ArrowRight size={16} strokeWidth={2.5} />
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    {action.isPrimary && (
                        <>
                            <div className="absolute right-0 bottom-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full blur-xl" />
                        </>
                    )}
                    {!action.isPrimary && (
                        <div className={`absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${action.gradient} opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500`} />
                    )}
                </motion.button>
            ))}
        </div>
    );
};
