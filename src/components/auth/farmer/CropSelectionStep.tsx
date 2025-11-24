'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Plus, X } from 'lucide-react';

interface CropSelectionStepProps {
    formData: {
        currentCrops: string[];
    };
    onChange: (field: string, value: string[]) => void;
    errors: Record<string, string>;
}

const COMMON_CROPS = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane",
    "Jowar", "Bajra", "Groundnut", "Soybean", "Sunflower",
    "Chickpea", "Pigeon Pea", "Mustard", "Potato", "Tomato",
    "Onion", "Chili", "Tea", "Coffee", "Rubber"
];

export const CropSelectionStep = ({ formData, onChange, errors }: CropSelectionStepProps) => {
    const [customCrop, setCustomCrop] = useState('');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }
        }
    };

    const toggleCrop = (crop: string) => {
        const currentCrops = formData.currentCrops || [];
        if (currentCrops.includes(crop)) {
            onChange('currentCrops', currentCrops.filter(c => c !== crop));
        } else {
            onChange('currentCrops', [...currentCrops, crop]);
        }
    };

    const addCustomCrop = () => {
        if (customCrop.trim() && !formData.currentCrops.includes(customCrop.trim())) {
            onChange('currentCrops', [...formData.currentCrops, customCrop.trim()]);
            setCustomCrop('');
        }
    };

    const removeCrop = (crop: string) => {
        onChange('currentCrops', formData.currentCrops.filter(c => c !== crop));
    };

    return (
        <div className="space-y-5">
            {/* Title */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Sprout size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                    What crops do you currently grow?
                </h3>
            </div>

            {/* Selected Crops Display - Compact */}
            {formData.currentCrops.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
                >
                    <p className="text-xs font-semibold text-emerald-900 mb-2">
                        Selected ({formData.currentCrops.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {formData.currentCrops.map((crop) => (
                            <motion.div
                                key={crop}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-emerald-300 shadow-sm"
                            >
                                <span className="text-xs font-medium text-slate-700">{crop}</span>
                                <button
                                    onClick={() => removeCrop(crop)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                    type="button"
                                >
                                    <X size={12} strokeWidth={2.5} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Common Crops Grid - More Compact */}
            <div>
                <p className="text-xs font-semibold text-slate-700 mb-2.5">Select from common crops:</p>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
                >
                    {COMMON_CROPS.map((crop) => {
                        const isSelected = formData.currentCrops.includes(crop);
                        return (
                            <motion.button
                                key={crop}
                                variants={itemVariants}
                                type="button"
                                onClick={() => toggleCrop(crop)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${isSelected
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200 border-2 border-emerald-400'
                                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                                    }`}
                            >
                                {crop}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>

            {/* Custom Crop Input - Mobile Responsive */}
            <div>
                <p className="text-xs font-semibold text-slate-700 mb-2.5">Or add a custom crop:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={customCrop}
                        onChange={(e) => setCustomCrop(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCrop())}
                        placeholder="Enter crop name"
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm bg-white shadow-sm border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300 outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium"
                    />
                    <motion.button
                        type="button"
                        onClick={addCustomCrop}
                        disabled={!customCrop.trim()}
                        whileHover={customCrop.trim() ? { scale: 1.03 } : {}}
                        whileTap={customCrop.trim() ? { scale: 0.97 } : {}}
                        className="px-5 py-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add Crop
                    </motion.button>
                </div>
            </div>

            {errors.currentCrops && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs"
                >
                    {errors.currentCrops}
                </motion.p>
            )}
        </div>
    );
};
