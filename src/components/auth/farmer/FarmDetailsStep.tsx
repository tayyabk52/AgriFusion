'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, Map, Ruler, Globe } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

interface FarmDetailsStepProps {
    formData: {
        farmName: string;
        state: string;
        district: string;
        landSize: string;
    };
    onChange: (field: string, value: string) => void;
    errors: Record<string, string>;
}

// Default to India
const COUNTRY_CODE = 'IN';

export const FarmDetailsStep = ({ formData, onChange, errors }: FarmDetailsStepProps) => {
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [selectedStateCode, setSelectedStateCode] = useState<string>('');

    useEffect(() => {
        // Get all states of India
        const indianStates = State.getStatesOfCountry(COUNTRY_CODE);
        setStates(indianStates);
    }, []);

    useEffect(() => {
        // Get cities when state changes
        if (selectedStateCode) {
            const stateCities = City.getCitiesOfState(COUNTRY_CODE, selectedStateCode);
            setCities(stateCities);
        } else {
            setCities([]);
        }
    }, [selectedStateCode]);

    const handleStateChange = (stateName: string) => {
        onChange('state', stateName);
        onChange('district', ''); // Reset district when state changes

        const selectedState = states.find(s => s.name === stateName);
        if (selectedState) {
            setSelectedStateCode(selectedState.isoCode);
        }
    };

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
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
        >
            {/* Farm Name */}
            <motion.div variants={itemVariants}>
                <label htmlFor="farmName" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Home size={12} className="text-white" strokeWidth={2.5} />
                    </div>
                    Farm Name
                </label>
                <input
                    type="text"
                    id="farmName"
                    value={formData.farmName}
                    onChange={(e) => onChange('farmName', e.target.value)}
                    placeholder="Enter your farm's name"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.farmName ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                        } outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium`}
                />
                {errors.farmName && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1.5"
                    >
                        {errors.farmName}
                    </motion.p>
                )}
            </motion.div>

            {/* State & District - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State */}
                <motion.div variants={itemVariants}>
                    <label htmlFor="state" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Map size={12} className="text-white" strokeWidth={2.5} />
                        </div>
                        State
                    </label>
                    <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.state ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                            } outline-none transition-all duration-300 text-slate-900 cursor-pointer font-medium`}
                    >
                        <option value="" className="text-slate-400">Select state</option>
                        {states.map((state) => (
                            <option key={state.isoCode} value={state.name}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                    {errors.state && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1.5"
                        >
                            {errors.state}
                        </motion.p>
                    )}
                </motion.div>

                {/* District / City */}
                <motion.div variants={itemVariants}>
                    <label htmlFor="district" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <MapPin size={12} className="text-white" strokeWidth={2.5} />
                        </div>
                        District / City
                    </label>
                    {cities.length > 0 ? (
                        <select
                            id="district"
                            value={formData.district}
                            onChange={(e) => onChange('district', e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.district ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                                } outline-none transition-all duration-300 text-slate-900 cursor-pointer font-medium`}
                        >
                            <option value="" className="text-slate-400">Select district/city</option>
                            {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            id="district"
                            value={formData.district}
                            onChange={(e) => onChange('district', e.target.value)}
                            placeholder={formData.state ? "Enter district/city" : "Select state first"}
                            disabled={!formData.state}
                            className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.district ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                                } outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400`}
                        />
                    )}
                    {errors.district && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1.5"
                        >
                            {errors.district}
                        </motion.p>
                    )}
                </motion.div>
            </div>

            {/* Land Size */}
            <motion.div variants={itemVariants}>
                <label htmlFor="landSize" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Ruler size={12} className="text-white" strokeWidth={2.5} />
                    </div>
                    Land Size (in acres)
                </label>
                <input
                    type="number"
                    id="landSize"
                    value={formData.landSize}
                    onChange={(e) => onChange('landSize', e.target.value)}
                    placeholder="e.g., 5.5"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-white shadow-sm ${errors.landSize ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                        } outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium`}
                />
                {errors.landSize && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1.5"
                    >
                        {errors.landSize}
                    </motion.p>
                )}
                <p className="text-xs text-slate-500 mt-1.5 italic">
                    Total cultivable land area
                </p>
            </motion.div>
        </motion.div>
    );
};
