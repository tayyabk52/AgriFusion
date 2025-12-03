'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { EmailVerificationNotice } from '@/components/dashboard/farmer/EmailVerificationNotice';
import { OverviewCard } from '@/components/dashboard/farmer/OverviewCard';
import { StatusCard } from '@/components/dashboard/farmer/StatusCard';
import { DashboardSkeleton } from '@/components/dashboard/farmer/skeletons/DashboardSkeleton';
import { Shield, User, Users, Sprout, TrendingUp, Calendar, ArrowRight, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

interface ConsultantData {
    profile: Profile;
    qualification?: string;
    experience_years?: number;
    specialization_areas?: string[];
}

export default function FarmerDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [farmerData, setFarmerData] = useState<FarmerData | null>(null);
    const [consultantData, setConsultantData] = useState<ConsultantData | null>(null);
    const [emailVerified, setEmailVerified] = useState(false);

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    const checkAuthAndFetchData = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/signup');
                return;
            }

            setEmailVerified(user.email_confirmed_at !== null);

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
                if (farmer?.consultant_id) {
                    await fetchConsultantData(farmer.consultant_id);
                }
            }
        } catch (error) {
            console.error('Error fetching farmer data:', error);
        }
    };

    const fetchConsultantData = async (consultantProfileId: string) => {
        try {
            const { data: consultantProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', consultantProfileId)
                .single();

            if (consultantProfile) {
                const { data: consultant } = await supabase
                    .from('consultants')
                    .select('*')
                    .eq('profile_id', consultantProfileId)
                    .single();

                if (consultant) {
                    setConsultantData({
                        profile: consultantProfile,
                        qualification: consultant.qualification,
                        experience_years: consultant.experience_years,
                        specialization_areas: consultant.specialization_areas
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching consultant data:', error);
        }
    };

    if (loading || !profile) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}


            {/* Email Verification Banner */}
            {!emailVerified && (
                <EmailVerificationNotice email={profile.email} />
            )}

            {/* Quick Stats - Google Material Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Shield className="text-blue-600" size={20} strokeWidth={2} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${profile.is_verified
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                            }`}>
                            {profile.is_verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 mb-1">Email Status</h3>
                    <p className="text-2xl font-semibold text-slate-900">
                        {profile.is_verified ? 'Verified' : 'Not Verified'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                            <User className="text-emerald-600" size={20} strokeWidth={2} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${profile.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                            }`}>
                            {profile.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 mb-1">Account</h3>
                    <p className="text-2xl font-semibold text-slate-900 capitalize">
                        {profile.status}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                            <Users className="text-purple-600" size={20} strokeWidth={2} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${consultantData
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-50 text-slate-700'
                            }`}>
                            {consultantData ? 'Assigned' : 'Pending'}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 mb-1">Consultant</h3>
                    <p className="text-2xl font-semibold text-slate-900">
                        {consultantData ? consultantData.profile.full_name.split(' ')[0] : 'Not Assigned'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                            <Sprout className="text-teal-600" size={20} strokeWidth={2} />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-50 text-slate-700">
                            {farmerData?.current_crops?.length || 0} types
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 mb-1">Active Crops</h3>
                    <p className="text-2xl font-semibold text-slate-900">
                        {farmerData?.current_crops?.length || 0}
                    </p>
                </motion.div>
            </div>

            {/* Farm Overview Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Farm Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Calendar className="text-blue-600" size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Member Since</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {new Date(profile.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="text-emerald-600" size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Total Land</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {farmerData?.land_size_acres ? `${farmerData.land_size_acres} Acres` : 'Not configured'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <MapPin className="text-orange-600" size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Location</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {farmerData?.district && farmerData?.state
                                    ? `${farmerData.district}, ${farmerData.state}`
                                    : 'Not configured'}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions - Material Design Cards */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Link href="/dashboard/farmer/farm">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                    <Sprout className="text-emerald-600" size={28} strokeWidth={2} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-slate-900 mb-1">My Farm Details</h3>
                                    <p className="text-sm text-slate-600">View and manage your farm information</p>
                                </div>
                                <ChevronRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/dashboard/farmer/consultant">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.45 }}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <Users className="text-blue-600" size={28} strokeWidth={2} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-slate-900 mb-1">My Consultant</h3>
                                    <p className="text-sm text-slate-600">Connect with your agricultural expert</p>
                                </div>
                                <ChevronRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </div>

    );
}
