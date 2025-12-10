'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import {
    User, Mail, Phone,
    Camera, Save, Lock, Shield, AlertCircle, CheckCircle2, X, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Country, ICountry } from 'country-state-city';
import * as flags from 'country-flag-icons/react/3x2';
import { toast } from 'sonner';
import { validateFullName } from '@/lib/validationUtils';


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

/**
 * Helper: Parse phone number with country code
 * Extracts country code and phone number from full phone string
 */
const parsePhoneNumber = (fullPhone: string, countries: ICountry[]): { countryCode: string; phoneNumber: string } => {
    if (!fullPhone) return { countryCode: '+92', phoneNumber: '' };
    if (!fullPhone.startsWith('+')) {
        return { countryCode: '+92', phoneNumber: fullPhone.replace(/\D/g, '') };
    }

    // Sort countries by phonecode length (descending) to match longest first
    const sortedCountries = [...countries].sort((a, b) => b.phonecode.length - a.phonecode.length);

    for (const country of sortedCountries) {
        const codeToMatch = `+${country.phonecode}`;
        if (fullPhone.startsWith(codeToMatch)) {
            const phoneNumber = fullPhone.substring(codeToMatch.length);
            if (/^\d+$/.test(phoneNumber) && phoneNumber.length >= 7) {
                return {
                    countryCode: codeToMatch,
                    phoneNumber: phoneNumber
                };
            }
        }
    }

    // Fallback regex
    const match = fullPhone.match(/^(\+\d{1,4})(\d{7,15})$/);
    if (match) {
        return { countryCode: match[1], phoneNumber: match[2] };
    }

    return { countryCode: '+92', phoneNumber: fullPhone.replace(/\+/g, '') };
};

export default function FarmerSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data States
    const [profile, setProfile] = useState<Profile | null>(null);
    const [farmerData, setFarmerData] = useState<FarmerData | null>(null);

    // Phone validation
    const [countries] = useState<ICountry[]>(() => Country.getAllCountries());
    const [phoneValidationError, setPhoneValidationError] = useState<string>('');
    const [nameValidationError, setNameValidationError] = useState<string>('');

    // Form States
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        phoneCountryCode: '+92',
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

            // Parse phone number if exists
            const parsedPhone = parsePhoneNumber(profileData.phone || '', countries);

            // Initialize Form Data
            setFormData({
                full_name: profileData.full_name || '',
                phone: parsedPhone.phoneNumber,
                phoneCountryCode: parsedPhone.countryCode,
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

        // Clear validation errors when user types
        if (name === 'phone') {
            setPhoneValidationError('');
        }
        if (name === 'full_name') {
            setNameValidationError('');
        }
    };

    const handlePhoneChange = (value: string) => {
        // Only allow digits
        const cleanedValue = value.replace(/\D/g, '').slice(0, 15);
        setFormData(prev => ({ ...prev, phone: cleanedValue }));
        setPhoneValidationError('');
    };

    const handlePhoneCountryCodeChange = (newCountryCode: string) => {
        setFormData(prev => ({ ...prev, phoneCountryCode: newCountryCode }));
        setPhoneValidationError('');
    };

    /**
     * Validate phone number with country-specific rules
     * Matches the validation logic from CreateFarmerForm
     */
    const validatePhoneNumber = (): boolean => {
        if (!formData.phone.trim()) {
            setPhoneValidationError('Phone number is required');
            return false;
        }
        if (!/^\d+$/.test(formData.phone)) {
            setPhoneValidationError('Phone number must contain only digits');
            return false;
        }
        if (formData.phone.length < 7 || formData.phone.length > 15) {
            setPhoneValidationError('Phone number must be between 7 and 15 digits');
            return false;
        }
        if (formData.phoneCountryCode === '+92' && formData.phone.length !== 10) {
            setPhoneValidationError('Pakistani phone numbers must be exactly 10 digits');
            return false;
        }

        setPhoneValidationError('');
        return true;
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Please upload a JPG, PNG, or GIF image' });
            return;
        }

        // Validate file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
            return;
        }

        // Set file and preview
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };



    const handleSaveProfile = async () => {
        if (!profile) return;

        // Validate full name
        const nameValidation = validateFullName(formData.full_name);
        if (!nameValidation.valid) {
            setNameValidationError(nameValidation.error || 'Invalid full name');
            setMessage({ type: 'error', text: nameValidation.error || 'Invalid full name' });
            return;
        }

        // Validate phone number before saving
        if (!validatePhoneNumber()) {
            setMessage({ type: 'error', text: phoneValidationError });
            return;
        }

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

            // Combine phone with country code
            const fullPhone = `${formData.phoneCountryCode}${formData.phone}`;

            // Update Profile Table
            const { error: profileUpdateError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: fullPhone,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (profileUpdateError) throw profileUpdateError;

            // Refresh local state
            setProfile(prev => prev ? { ...prev, full_name: formData.full_name, phone: fullPhone, avatar_url: avatarUrl } : null);
            toast.success('Profile updated successfully!');

        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast.error(error.message || 'Failed to update profile.');
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
                                            <User className={`absolute left-3 top-3 ${nameValidationError ? 'text-red-500' : 'text-slate-400'}`} size={18} />
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 outline-none transition-all ${
                                                    nameValidationError
                                                        ? 'bg-red-50/50 border border-red-300 focus:ring-red-500/20 focus:border-red-500'
                                                        : 'bg-slate-50 border border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                                                }`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {nameValidationError && (
                                            <p className="text-xs text-red-600 mt-1 ml-1 font-medium">{nameValidationError}</p>
                                        )}
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
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                                        <div className={`flex w-full rounded-xl bg-slate-50 transition-all duration-200 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 border ${phoneValidationError ? 'border-red-300 bg-red-50/50' : 'border-slate-200'}`}>
                                            {/* Country Code Selector */}
                                            <div className="relative border-r border-slate-200/60 shrink-0">
                                                <div className="absolute inset-0 flex items-center pl-3 pointer-events-none">
                                                    {(() => {
                                                        const selectedPhoneCountry = countries.find(c => c.phonecode === formData.phoneCountryCode.replace('+', ''));
                                                        const FlagComponent = selectedPhoneCountry ? (flags as any)[selectedPhoneCountry.isoCode] : null;
                                                        return FlagComponent ? (
                                                            <FlagComponent className="rounded-[2px] shadow-sm" style={{ width: '20px', height: 'auto' }} />
                                                        ) : null;
                                                    })()}
                                                </div>
                                                <select
                                                    value={formData.phoneCountryCode}
                                                    onChange={(e) => handlePhoneCountryCodeChange(e.target.value)}
                                                    className="h-full bg-transparent text-xs font-semibold text-slate-700 rounded-l-xl py-2.5 pl-10 pr-7 focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    {countries.map((country) => (
                                                        <option key={country.isoCode} value={`+${country.phonecode}`} className="text-slate-900">
                                                            +{country.phonecode} ({country.isoCode})
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>

                                            {/* Phone Code Display */}
                                            <div className="hidden sm:flex items-center px-3 bg-slate-100/50 text-xs font-semibold text-slate-500 border-r border-slate-200/60 shrink-0">
                                                {formData.phoneCountryCode}
                                            </div>

                                            {/* Phone Number Input */}
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                placeholder="3001234567"
                                                maxLength={15}
                                                className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-300 rounded-r-xl"
                                            />
                                        </div>
                                        {phoneValidationError && (
                                            <p className="text-xs text-red-600 mt-1 ml-1 font-medium">{phoneValidationError}</p>
                                        )}
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
                                        toast.success('Password reset email sent!');
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
