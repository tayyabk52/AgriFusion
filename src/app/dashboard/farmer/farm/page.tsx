'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FarmDetailsSkeleton } from '@/components/dashboard/farmer/skeletons/FarmDetailsSkeleton';
import { motion } from 'framer-motion';
import { Tractor, MapPin, Ruler, Sprout, Calendar, AlertCircle } from 'lucide-react';

interface Profile {
    id: string;
    auth_user_id: string;
    role: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    status: string;
    is_verified: boolean;
    created_at: string;
}

interface FarmerData {
    id: string;
    profile_id: string;
    consultant_id?: string;
    farm_name?: string;
    district?: string;
    state?: string;
    land_size_acres?: number;
    current_crops?: string[];
}

export default function MyFarmPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [farmerData, setFarmerData] = useState<FarmerData | null>(null);

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    const checkAuthAndFetchData = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/signin');
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
            } else {
                setProfile(profileData);

                if (profileData && profileData.role === 'farmer') {
                    await fetchFarmerData(profileData.id);
                }
            }
        } catch (error) {
            console.error('Error in checkAuthAndFetchData:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFarmerData = async (profileId: string) => {
        try {
            const { data: farmer, error: farmerError } = await supabase
                .from('farmers')
                .select('*')
                .eq('profile_id', profileId)
                .single();

            if (!farmerError) {
                setFarmerData(farmer);
            }
        } catch (error) {
            console.error('Error fetching farmer data:', error);
        }
    };

    if (loading || !profile) {
        return <FarmDetailsSkeleton />;
    }

    const hasAnyData = farmerData?.farm_name || farmerData?.district || farmerData?.state || farmerData?.land_size_acres;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Farm</h1>
                <p className="text-sm text-slate-600">Complete details about your agricultural land and crops</p>
            </motion.div>

            {!hasAnyData ? (
                /* Empty State */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex items-center justify-center"
                >
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                            <AlertCircle className="text-blue-500" size={40} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Farm Details Pending</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Your farm details will be configured by your assigned consultant.
                            They will help you set up your farm profile with accurate information.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                            <Sprout size={16} />
                            Phase 2 - Coming Soon
                        </div>
                    </div>
                </motion.div>
            ) : (
                /* Farm Details Grid */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Farm Name Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Tractor className="text-emerald-600" size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Farm Information</h2>
                                <p className="text-xs text-slate-500">Basic details about your farm</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                                    Farm Name
                                </label>
                                <p className="text-lg font-semibold text-slate-900">
                                    {farmerData?.farm_name || 'Not configured'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                                        District
                                    </label>
                                    <p className="text-base font-semibold text-slate-900">
                                        {farmerData?.district || '--'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                                        State
                                    </label>
                                    <p className="text-base font-semibold text-slate-900">
                                        {farmerData?.state || '--'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Land Size Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Ruler className="text-amber-600" size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">Land Size</h2>
                                <p className="text-xs text-slate-500">Total area</p>
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-slate-900 mb-1">
                            {farmerData?.land_size_acres || '0'}
                        </p>
                        <p className="text-sm text-slate-600">Acres</p>
                    </motion.div>

                    {/* Location Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <MapPin className="text-blue-600" size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Location</h2>
                                <p className="text-xs text-slate-500">Geographic information</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-slate-900">
                                {farmerData?.district && farmerData?.state
                                    ? `${farmerData.district}, ${farmerData.state}`
                                    : 'Location not configured'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Current Crops Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Sprout className="text-emerald-600" size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">Crops</h2>
                                <p className="text-xs text-slate-500">Currently growing</p>
                            </div>
                        </div>

                        {farmerData?.current_crops && farmerData.current_crops.length > 0 ? (
                            <div className="space-y-2">
                                {farmerData.current_crops.map((crop, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100"
                                    >
                                        <Sprout size={14} className="text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-900">{crop}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No crops configured yet</p>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
