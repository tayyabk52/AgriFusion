'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FarmerDashboardLayout } from '@/components/dashboard/farmer/FarmerDashboardLayout';
import Loader from '@/components/ui/Loader';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, Award, Briefcase, Clock, UserCheck, AlertCircle } from 'lucide-react';
import Image from 'next/image';

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

interface ConsultantData {
    profile: Profile;
    qualification?: string;
    experience_years?: number;
    specialization_areas?: string[];
}

export default function MyConsultantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [consultantData, setConsultantData] = useState<ConsultantData | null>(null);

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
                    await fetchConsultantData(profileData.id);
                }
            }
        } catch (error) {
            console.error('Error in checkAuthAndFetchData:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConsultantData = async (profileId: string) => {
        try {
            const { data: farmer, error: farmerError } = await supabase
                .from('farmers')
                .select('consultant_id')
                .eq('profile_id', profileId)
                .single();

            if (farmerError || !farmer?.consultant_id) {
                return;
            }

            const { data: consultantProfile, error: consultantProfileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', farmer.consultant_id)
                .single();

            if (consultantProfileError) {
                console.error('Error fetching consultant profile:', consultantProfileError);
                return;
            }

            const { data: consultant, error: consultantError } = await supabase
                .from('consultants')
                .select('*')
                .eq('profile_id', farmer.consultant_id)
                .single();

            if (!consultantError) {
                setConsultantData({
                    profile: consultantProfile,
                    qualification: consultant.qualification,
                    experience_years: consultant.experience_years,
                    specialization_areas: consultant.specialization_areas
                });
            }
        } catch (error) {
            console.error('Error fetching consultant data:', error);
        }
    };

    if (loading) return <Loader />;
    if (!profile) return null;

    return (
        <FarmerDashboardLayout
            farmerName={profile.full_name}
            farmerEmail={profile.email}
            avatarUrl={profile.avatar_url || undefined}
            isVerified={profile.is_verified}
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Consultant</h1>
                    <p className="text-sm text-slate-600">
                        {consultantData
                            ? 'Your assigned agricultural expert and their expertise'
                            : 'A consultant will be assigned to help optimize your farming practices'}
                    </p>
                </motion.div>

                {!consultantData ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex items-center justify-center"
                    >
                        <div className="text-center max-w-md">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Clock className="text-indigo-500" size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Consultant Assignment Pending</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                A qualified agricultural consultant will be assigned to you shortly.
                                They will help you optimize your farming practices and maximize your yields.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                <UserCheck size={16} />
                                Our team is reviewing your profile
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Consultant Details Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Consultant Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-start gap-6 mb-6">
                                <div className="relative flex-shrink-0">
                                    {consultantData.profile.avatar_url ? (
                                        <Image
                                            src={consultantData.profile.avatar_url}
                                            alt={consultantData.profile.full_name}
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-blue-100">
                                            {consultantData.profile.full_name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                        <UserCheck size={14} className="text-white" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        {consultantData.profile.full_name}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                                            Active Consultant
                                        </span>
                                        {consultantData.experience_years && (
                                            <span className="text-sm text-slate-600 font-medium">
                                                {consultantData.experience_years}+ years experience
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Specialized agricultural consultant dedicated to helping you succeed
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <Mail className="text-slate-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Email</p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {consultantData.profile.email}
                                        </p>
                                    </div>
                                </div>

                                {consultantData.profile.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <Phone className="text-slate-600" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {consultantData.profile.phone}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Qualification Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <GraduationCap className="text-blue-600" size={20} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Education</h3>
                                    <p className="text-xs text-slate-500">Qualification</p>
                                </div>
                            </div>
                            <p className="text-base font-semibold text-slate-900">
                                {consultantData.qualification || 'Not specified'}
                            </p>
                        </motion.div>

                        {/* Experience Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <Award className="text-amber-600" size={20} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Experience</h3>
                                    <p className="text-xs text-slate-500">Professional years</p>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-slate-900 mb-1">
                                {consultantData.experience_years || 0}
                            </p>
                            <p className="text-sm text-slate-600">Years</p>
                        </motion.div>

                        {/* Specialization Areas Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                    <Briefcase className="text-indigo-600" size={20} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Specialization Areas</h3>
                                    <p className="text-xs text-slate-500">Expertise and focus areas</p>
                                </div>
                            </div>

                            {consultantData.specialization_areas && consultantData.specialization_areas.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {consultantData.specialization_areas.map((area, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100"
                                        >
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No specializations listed</p>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </FarmerDashboardLayout>
    );
}
