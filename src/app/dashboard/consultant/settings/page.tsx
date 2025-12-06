"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import { Settings, User, Bell, Lock, Save, Loader2, Upload, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import { supabase } from "@/lib/supabaseClient";
import { TagInput } from "@/components/dashboard/consultant/TagInput";
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import * as flags from 'country-flag-icons/react/3x2';

const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
];

const SPECIALIZATION_SUGGESTIONS = [
  'Crop Management',
  'Soil Health',
  'Pest Control',
  'Irrigation Systems',
  'Organic Farming',
  'Livestock Management',
  'Agricultural Technology',
  'Sustainable Farming',
];

// Helper: Parse phone number with country code
const parsePhoneNumber = (fullPhone: string): { countryCode: string; phoneNumber: string } => {
  if (!fullPhone) return { countryCode: '+92', phoneNumber: '' };
  if (!fullPhone.startsWith('+')) {
    return { countryCode: '+92', phoneNumber: fullPhone };
  }

  const countries = Country.getAllCountries();
  const sortedCountries = [...countries].sort((a, b) => b.phonecode.length - a.phonecode.length);

  for (const country of sortedCountries) {
    const codeToMatch = `+${country.phonecode}`;
    if (fullPhone.startsWith(codeToMatch)) {
      const phoneNumber = fullPhone.substring(codeToMatch.length);
      if (/^\d+$/.test(phoneNumber) && phoneNumber.length >= 7) {
        return { countryCode: codeToMatch, phoneNumber };
      }
    }
  }

  const match = fullPhone.match(/^(\+\d{1,4})(\d{7,15})$/);
  if (match) {
    return { countryCode: match[1], phoneNumber: match[2] };
  }

  return { countryCode: '+92', phoneNumber: fullPhone.replace(/\+/g, '') };
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { isCollapsed, isTemporary } = useSidebar();

  // Form data state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phoneCountryCode: '+92',
    phoneNumber: '',
    avatar_url: '',
    qualification: '',
    specialization_areas: [] as string[],
    experience_years: 0,
    country: '',
    state: '',
    district: '',
    service_country: '',
    service_state: '',
    service_district: '',
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Personal location dropdowns
  const countries = Country.getAllCountries();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Service location dropdowns
  const [serviceStates, setServiceStates] = useState<IState[]>([]);
  const [serviceCities, setServiceCities] = useState<ICity[]>([]);

  // Get flag component for selected country
  const selectedCountry = countries.find(c => `+${c.phonecode}` === formData.phoneCountryCode);
  const FlagComponent = selectedCountry ? (flags as any)[selectedCountry.isoCode] : null;

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setErrors({});
    setErrorMessage('');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setErrorMessage('Please sign in to continue');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/consultant/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load profile');
      }

      const { data } = await response.json();

      const { countryCode, phoneNumber } = parsePhoneNumber(data.phone);

      // Set up personal location dropdowns
      const consultantCountry = data.consultant.country || '';
      const consultantState = data.consultant.state || '';
      const consultantDistrict = data.consultant.district || '';

      // Initialize personal location states if country exists
      if (consultantCountry) {
        const selectedCountry = countries.find(c => c.name === consultantCountry);
        if (selectedCountry) {
          const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
          setStates(countryStates);

          // Initialize cities if state exists
          if (consultantState) {
            const selectedState = countryStates.find(s => s.name === consultantState);
            if (selectedState) {
              const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
              setCities(stateCities);
            }
          }
        }
      }

      // Set up service location dropdowns
      const serviceCountry = data.consultant.service_country || '';
      const serviceState = data.consultant.service_state || '';
      const serviceDistrict = data.consultant.service_district || '';

      // Initialize service location states if country exists
      if (serviceCountry) {
        const selectedServiceCountry = countries.find(c => c.name === serviceCountry);
        if (selectedServiceCountry) {
          const serviceCountryStates = State.getStatesOfCountry(selectedServiceCountry.isoCode);
          setServiceStates(serviceCountryStates);

          // Initialize service cities if state exists
          if (serviceState) {
            const selectedServiceState = serviceCountryStates.find(s => s.name === serviceState);
            if (selectedServiceState) {
              const serviceStateCities = City.getCitiesOfState(selectedServiceCountry.isoCode, selectedServiceState.isoCode);
              setServiceCities(serviceStateCities);
            }
          }
        }
      }

      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phoneCountryCode: countryCode,
        phoneNumber: phoneNumber,
        avatar_url: data.avatar_url || '',
        qualification: data.consultant.qualification || '',
        specialization_areas: data.consultant.specialization_areas || [],
        experience_years: data.consultant.experience_years || 0,
        country: consultantCountry,
        state: consultantState,
        district: consultantDistrict,
        service_country: serviceCountry,
        service_state: serviceState,
        service_district: serviceDistrict,
      });

      setAvatarPreview(data.avatar_url || '');

    } catch (error: any) {
      console.error('Fetch profile error:', error);
      setErrorMessage(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhoneCountryCodeChange = (newCode: string) => {
    setFormData(prev => ({ ...prev, phoneCountryCode: newCode }));
  };

  // Handle country change
  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      setCities([]);
      setFormData(prev => ({ ...prev, country: countryName, state: '', district: '' }));

      if (errors.country) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.country;
          return newErrors;
        });
      }
    }
  };

  // Handle state change
  const handleStateChange = (stateName: string) => {
    const selectedCountry = countries.find(c => c.name === formData.country);
    const selectedState = states.find(s => s.name === stateName);
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
      setCities(stateCities);
      setFormData(prev => ({ ...prev, state: stateName, district: '' }));

      if (errors.state) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.state;
          return newErrors;
        });
      }
    }
  };

  // Handle service country change
  const handleServiceCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setServiceStates(countryStates);
      setServiceCities([]);
      setFormData(prev => ({ ...prev, service_country: countryName, service_state: '', service_district: '' }));

      if (errors.service_country) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.service_country;
          return newErrors;
        });
      }
    }
  };

  // Handle service state change
  const handleServiceStateChange = (stateName: string) => {
    const selectedCountry = countries.find(c => c.name === formData.service_country);
    const selectedState = serviceStates.find(s => s.name === stateName);
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
      setServiceCities(stateCities);
      setFormData(prev => ({ ...prev, service_state: stateName, service_district: '' }));

      if (errors.service_state) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.service_state;
          return newErrors;
        });
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: 'Please upload a JPG, PNG, or GIF image' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image must be smaller than 2MB' }));
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));

    if (errors.avatar) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.avatar;
        return newErrors;
      });
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return formData.avatar_url;

    setUploadingAvatar(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

      // Delete old avatar if exists and is from our storage
      if (formData.avatar_url && formData.avatar_url.includes('avatars')) {
        const oldPath = formData.avatar_url.split('/avatars/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      setErrors(prev => ({ ...prev, avatar: 'Failed to upload avatar' }));
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // 1. Upload avatar if changed
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (!uploadedUrl) {
          setSaving(false);
          return;
        }
        avatarUrl = uploadedUrl;
      }

      // 2. Get session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Please sign in to continue');
      }

      // 3. Prepare request body
      const fullPhone = formData.phoneNumber
        ? `${formData.phoneCountryCode}${formData.phoneNumber}`
        : '';

      const requestBody = {
        full_name: formData.full_name,
        email: formData.email,
        phone: fullPhone,
        avatar_url: avatarUrl,
        qualification: formData.qualification,
        specialization_areas: formData.specialization_areas,
        experience_years: formData.experience_years,
        country: formData.country,
        state: formData.state,
        district: formData.district,
        service_country: formData.service_country,
        service_state: formData.service_state,
        service_district: formData.service_district,
      };

      // 4. Call API
      const response = await fetch('/api/consultant/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        }
        throw new Error(result.error || 'Failed to update profile');
      }

      // 5. Success
      setSuccessMessage('Profile updated successfully!');
      setAvatarFile(null);

      setTimeout(() => setSuccessMessage(''), 5000);

      await fetchProfile();

    } catch (error: any) {
      console.error('Save error:', error);
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main
      className="flex-1 transition-all duration-300"
      style={{
        marginLeft:
          isCollapsed && !isTemporary ? "80px" : isTemporary ? "0" : "280px",
      }}
    >
      <div className="w-full">
        <DashboardHeader />

        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full p-5 md:p-7 lg:p-9 max-w-dvw">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                <Settings className="text-white" size={24} strokeWidth={2.5} />
              </div>
              Settings
            </h1>
            <p className="text-slate-500">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <p className="text-sm font-medium text-emerald-700">
                    {successMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <p className="text-sm font-medium text-red-700">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-2">
                {SETTINGS_TABS.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon
                      size={20}
                      strokeWidth={activeTab === tab.id ? 2.5 : 2}
                    />
                    <span className="text-sm">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-8">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">Loading profile...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {activeTab === "profile" && (
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6">
                          Profile Information
                        </h2>

                        {/* Avatar Section */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                            <img
                              src={avatarPreview || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"}
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div>
                              <label htmlFor="avatar-upload">
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
                                >
                                  {uploadingAvatar ? (
                                    <>
                                      <Loader2 size={16} className="animate-spin" />
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={16} />
                                      Change Photo
                                    </>
                                  )}
                                </motion.div>
                              </label>
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={handleAvatarChange}
                                className="hidden"
                              />
                              <p className="text-xs text-slate-500 mt-2">
                                JPG, PNG or GIF. Max size 2MB
                              </p>
                              {errors.avatar && (
                                <p className="text-xs text-red-600 mt-1 font-medium">
                                  {errors.avatar}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Personal Information Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => updateField('full_name', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  errors.full_name
                                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                                }`}
                              />
                              {errors.full_name && (
                                <p className="text-xs text-red-600 mt-1 font-medium">
                                  {errors.full_name}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-600 cursor-not-allowed"
                              />
                              <p className="text-xs text-slate-500 mt-1">
                                Email cannot be changed for security reasons
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number
                              </label>
                              <div className={`flex w-full rounded-xl transition-all ${
                                errors.phone ? 'border border-red-300 bg-red-50/50' : 'border border-slate-200'
                              }`}>
                                {/* Country Code Selector */}
                                <div className="relative border-r border-slate-200/60 shrink-0">
                                  <div className="absolute inset-0 flex items-center pl-3 pointer-events-none">
                                    {FlagComponent && (
                                      <FlagComponent className="rounded-[2px] shadow-sm" style={{ width: '20px', height: 'auto' }} />
                                    )}
                                  </div>
                                  <select
                                    value={formData.phoneCountryCode}
                                    onChange={(e) => handlePhoneCountryCodeChange(e.target.value)}
                                    className="h-full bg-transparent text-xs font-semibold text-slate-700 rounded-l-xl py-3 pl-10 pr-7 focus:outline-none appearance-none cursor-pointer"
                                  >
                                    {countries.map((country) => (
                                      <option key={country.isoCode} value={`+${country.phonecode}`}>
                                        +{country.phonecode}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Phone Number Input */}
                                <input
                                  type="tel"
                                  value={formData.phoneNumber}
                                  onChange={(e) => updateField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 15))}
                                  placeholder="3001234567"
                                  maxLength={15}
                                  className="flex-1 min-w-0 px-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-300 rounded-r-xl"
                                />
                              </div>
                              {errors.phone && (
                                <p className="text-xs text-red-600 mt-1 font-medium">
                                  {errors.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Professional Information Section */}
                          <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                              Professional Details
                            </h3>

                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Qualification *
                                </label>
                                <input
                                  type="text"
                                  value={formData.qualification}
                                  onChange={(e) => updateField('qualification', e.target.value)}
                                  placeholder="e.g., MSc Agriculture"
                                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.qualification
                                      ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                      : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                                  }`}
                                />
                                {errors.qualification && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.qualification}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Specialization Areas *
                                </label>
                                <TagInput
                                  tags={formData.specialization_areas}
                                  onChange={(tags) => updateField('specialization_areas', tags)}
                                  placeholder="Type specialization and press Enter..."
                                  suggestions={SPECIALIZATION_SUGGESTIONS}
                                  error={errors.specialization_areas}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Years of Experience *
                                </label>
                                <input
                                  type="number"
                                  value={formData.experience_years}
                                  onChange={(e) => updateField('experience_years', parseInt(e.target.value) || 0)}
                                  min={0}
                                  max={100}
                                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.experience_years
                                      ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                      : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                                  }`}
                                />
                                {errors.experience_years && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.experience_years}
                                  </p>
                                )}
                              </div>

                              {/* Country Dropdown */}
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Country *
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.country}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none ${
                                      errors.country
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                  >
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                      <option key={country.isoCode} value={country.name}>
                                        {country.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.country && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.country}
                                  </p>
                                )}
                              </div>

                              {/* State Dropdown */}
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  State/Province *
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.state}
                                    onChange={(e) => handleStateChange(e.target.value)}
                                    disabled={!formData.country}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
                                      errors.state
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                  >
                                    <option value="">Select State</option>
                                    {states.map((state) => (
                                      <option key={state.isoCode} value={state.name}>
                                        {state.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.state && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.state}
                                  </p>
                                )}
                              </div>

                              {/* District Dropdown */}
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  District/City *
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.district}
                                    onChange={(e) => updateField('district', e.target.value)}
                                    disabled={!formData.state}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
                                      errors.district
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                  >
                                    <option value="">Select District</option>
                                    {cities.map((city) => (
                                      <option key={city.name} value={city.name}>
                                        {city.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.district && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.district}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Service Location Section */}
                          <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                              Service Location
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                              Where do you provide your consultation services? (This can be different from your personal location)
                            </p>

                            <div className="space-y-6">
                              {/* Service Country Dropdown */}
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Service Country
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.service_country}
                                    onChange={(e) => handleServiceCountryChange(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none ${
                                      errors.service_country
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                  >
                                    <option value="">Select Service Country</option>
                                    {countries.map((country) => (
                                      <option key={country.isoCode} value={country.name}>
                                        {country.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.service_country && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.service_country}
                                  </p>
                                )}
                              </div>

                              {/* Service State Dropdown */}
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Service State/Province
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.service_state}
                                    onChange={(e) => handleServiceStateChange(e.target.value)}
                                    disabled={!formData.service_country}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
                                      errors.service_state
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                  >
                                    <option value="">Select Service State</option>
                                    {serviceStates.map((state) => (
                                      <option key={state.isoCode} value={state.name}>
                                        {state.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.service_state && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.service_state}
                                  </p>
                                )}
                              </div>

                              {/* Service District Dropdown */}
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Service District/City
                                </label>
                                <div className="relative">
                                  <select
                                    value={formData.service_district}
                                    onChange={(e) => updateField('service_district', e.target.value)}
                                    disabled={!formData.service_state}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
                                      errors.service_district
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                  >
                                    <option value="">Select Service District</option>
                                    {serviceCities.map((city) => (
                                      <option key={city.name} value={city.name}>
                                        {city.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.service_district && (
                                  <p className="text-xs text-red-600 mt-1 font-medium">
                                    {errors.service_district}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "notifications" && (
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6">
                          Notification Preferences
                        </h2>
                        <div className="space-y-6">
                          {[
                            {
                              label: "Email Notifications",
                              desc: "Receive email updates about your account activity",
                            },
                            {
                              label: "New Query Alerts",
                              desc: "Get notified when farmers submit new queries",
                            },
                            {
                              label: "Waste Record Updates",
                              desc: "Updates on waste records and marketplace activity",
                            },
                            {
                              label: "Expert Recommendations",
                              desc: "Notifications when expert consultations are recommended",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                            >
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {item.label}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {item.desc}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  defaultChecked
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-teal-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "security" && (
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6">
                          Security Settings
                        </h2>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save Button */}
                    {activeTab === "profile" && (
                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <motion.button
                          onClick={handleSave}
                          disabled={saving || loading}
                          whileHover={saving || loading ? {} : { scale: 1.02 }}
                          whileTap={saving || loading ? {} : { scale: 0.98 }}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <Loader2 size={20} className="animate-spin" strokeWidth={2.5} />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Save size={20} strokeWidth={2.5} />
                              Save Changes
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
