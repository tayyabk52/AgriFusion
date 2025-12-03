'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tractor, MapPin, Ruler, Sprout, AlertCircle } from 'lucide-react';

interface FarmDetailsCardProps {
    farmName?: string;
    district?: string;
    state?: string;
    landSizeAcres?: number;
    currentCrops?: string[];
}

export function FarmDetailsCard({
    farmName,
    district,
    state,
    landSizeAcres,
    currentCrops
}: FarmDetailsCardProps) {
    // Safely handle null/undefined values
    const crops = currentCrops || [];
    const hasAnyData = farmName || district || state || landSizeAcres || crops.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Tractor className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Farm Details</h3>
                        <p className="text-xs text-slate-500">Your farm information and location</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {!hasAnyData ? (
                    /* Placeholder when no data */
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                            <AlertCircle className="text-blue-500" size={28} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Farm Details Pending</h4>
                        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                            Your farm details will be configured by your assigned consultant.
                            They will help you set up your farm profile with accurate information.
                        </p>
                        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl inline-block">
                            <p className="text-xs text-emerald-700 font-semibold">
                                🌱 This is part of Phase 2 - Coming Soon
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Display data when available */
                    <div className="space-y-4">
                        {/* Farm Name */}
                        {farmName && (
                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <Tractor className="text-emerald-600" size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                        Farm Name
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {farmName}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {(district || state) && (
                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="text-blue-600" size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                        Location
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {district && state ? `${district}, ${state}` : district || state}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Land Size */}
                        {landSizeAcres && (
                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <Ruler className="text-amber-600" size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                        Land Size
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {landSizeAcres} Acres
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Current Crops */}
                        {crops.length > 0 && (
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sprout className="text-emerald-600" size={18} />
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Current Crops
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {crops.map((crop, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200"
                                        >
                                            <Sprout size={12} />
                                            {crop}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
