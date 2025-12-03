'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import {
    User, Mail, Phone,
    Camera, Save, Lock, Shield, AlertCircle, CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
}

interface FarmerData {
    id: string;
    profile_id: string;
    farm_name?: string;
    district?: string;
    state?: string;
    country?: string;
    land_size_acres?: number;
    current_crops?: string[];
}

export default function FarmerSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data States
    const [profile, setProfile] = useState<Profile | null>(null);
    const [farmerData, setFarmerData] = useState<FarmerData | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-dismiss message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);



    const fetchData = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                router.push('/signin');
                return;
            }

            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

            if (profileError) throw profileError;
            setProfile(profileData);

            // Fetch Farmer Data
            const { data: farmer, error: farmerError } = await supabase
                .from('farmers')
                .select('*')
                .eq('profile_id', profileData.id)
                .single();

            if (farmerError && farmerError.code !== 'PGRST116') throw farmerError;
            setFarmerData(farmer);

            // Initialize Form Data
            setFormData({
                full_name: profileData.full_name || '',
                phone: profileData.phone || '',
            });

            // Set initial avatar
            if (profileData.avatar_url) {
                setAvatarPreview(profileData.avatar_url);
            }

        } catch (error: any) {
            console.error('Error fetching data:', error);
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };



    const handleSaveProfile = async () => {
        if (!profile) return;
        setSaving(true);
        setMessage(null);

        try {
            let avatarUrl = profile.avatar_url;

            // Upload Avatar if changed
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars') // Make sure this bucket exists
                    .upload(filePath, avatarFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                avatarUrl = publicUrl;
            }

            // Update Profile Table
            const { error: profileUpdateError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (profileUpdateError) throw profileUpdateError;

            // Refresh local state
            setProfile(prev => prev ? { ...prev, full_name: formData.full_name, phone: formData.phone, avatar_url: avatarUrl } : null);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

        } catch (error: any) {
            console.error('Error saving profile:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-sm text-slate-500">Manage your account and farm preferences</p>
                </div>

            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'profile'
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                >
                    <User size={16} />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'security'
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                >
                    <Shield size={16} />
                    Security
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'profile' ? (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <User size={20} className="text-emerald-600" />
                                    Personal Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className={`
                                                w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg
                                                ${avatarPreview ? 'bg-white' : 'bg-slate-100 flex items-center justify-center'}
                                            `}>
                                            {avatarPreview ? (
                                                <Image src={avatarPreview} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={32} className="text-slate-400" />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full hover:bg-emerald-600 transition-colors shadow-lg border-2 border-white"
                                        >
                                            <Camera size={14} />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
                                        <p className="text-xs text-slate-500 mt-1 max-w-xs">
                                            Upload a clear photo to help your consultant recognize you. Max size 2MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="email"
                                                value={profile?.email || ''}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                            <Button
                                variant="premium"
                                size="lg"
                                onClick={handleSaveProfile}
                                isLoading={saving}
                                icon={<Save size={18} />}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                <Lock className="text-slate-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Security Settings</h2>
                                <p className="text-sm text-slate-500">Manage your password and account security</p>
                            </div>
                        </div>

                        <div className="space-y-6 max-w-md">
                            <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex gap-3">
                                <Shield className="shrink-0" size={20} />
                                <p>To change your password, we'll send a secure link to your email address <strong>{profile?.email}</strong>.</p>
                            </div>

                            <Button
                                variant="outline"
                                onClick={async () => {
                                    if (profile?.email) {
                                        await supabase.auth.resetPasswordForEmail(profile.email);
                                        setMessage({ type: 'success', text: 'Password reset email sent!' });
                                    }
                                }}
                            >
                                Send Password Reset Email
                            </Button>
                        </div>
                    </motion.div>
                )
                }
            </AnimatePresence >

            {/* Toast Notification */}
            <AnimatePresence>
                {
                    message && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className={`
                                fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border
                                ${message.type === 'success'
                                    ? 'bg-white border-emerald-100 text-slate-900'
                                    : 'bg-white border-red-100 text-slate-900'
                                }
                            `}
                        >
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                ${message.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}
                            `}>
                                {message.type === 'success' ? <CheckCircle2 size={20} strokeWidth={3} /> : <AlertCircle size={20} strokeWidth={3} />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${message.type === 'success' ? 'text-emerald-900' : 'text-red-900'}`}>
                                    {message.type === 'success' ? 'Success' : 'Error'}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium">{message.text}</p>
                            </div>
                            <button
                                onClick={() => setMessage(null)}
                                className="ml-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    );
}
