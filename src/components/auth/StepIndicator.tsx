'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    label: string;
    description?: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    className?: string;
}

export const StepIndicator = ({ steps, currentStep, className }: StepIndicatorProps) => {
    return (
        <div className={cn("w-full mx-auto", className)}>
            {/* Desktop View - Compact */}
            <div className="hidden md:flex items-center justify-between relative px-4">
                {/* Progress Line */}
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-200 -z-10">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: '0%' }}
                        animate={{
                            width: `${((currentStep) / (steps.length - 1)) * 100}%`
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
                    />
                </div>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isUpcoming = index > currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center relative z-10">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all duration-300",
                                    isCompleted && "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200",
                                    isCurrent && "bg-white border-2 border-emerald-500 text-emerald-600 shadow-md",
                                    isUpcoming && "bg-slate-100 text-slate-400 border-2 border-slate-200"
                                )}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <Check size={14} strokeWidth={3} />
                                    </motion.div>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </motion.div>
                            <div className="text-center max-w-[100px]">
                                <p className={cn(
                                    "text-xs font-semibold transition-colors duration-300",
                                    (isCompleted || isCurrent) ? "text-slate-900" : "text-slate-400"
                                )}>
                                    {step.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900">
                        Step {currentStep + 1} of {steps.length}
                    </span>
                    <span className="text-xs text-slate-500">
                        {Math.round(((currentStep) / (steps.length - 1)) * 100)}% Complete
                    </span>
                </div>
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{
                            width: `${((currentStep + 1) / steps.length) * 100}%`
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
                    />
                </div>
                <p className="text-sm font-medium text-slate-700 mt-3">
                    {steps[currentStep].label}
                </p>
            </div>
        </div>
    );
};
