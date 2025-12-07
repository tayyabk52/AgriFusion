"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import { Settings, User, Bell, Lock, Save, Loader2, Upload, ChevronDown, MapPin, Briefcase, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import { useProfile } from "@/contexts/ProfileContext";
import { supabase } from "@/lib/supabaseClient";
import { TagInput } from "@/components/dashboard/consultant/TagInput";
import { Country, State, City, IState, ICity } from 'country-state-city';
import * as flags from 'country-flag-icons/react/3x2';

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

// Compact input component
const FormInput = ({ label, error, children, className = "" }: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// Section card component
const SectionCard = ({
  icon: Icon,
  title,
  children,
  iconGradient = "from-emerald-500 to-teal-600"
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconGradient?: string;
}) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div className={`bg-gradient-to-r ${iconGradient} px-4 py-2.5 flex items-center gap-2.5`}>
      <Icon className="text-white" size={16} strokeWidth={2.5} />
      <h3 className="text-sm font-bold text-white">{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  const { isCollapsed, isTemporary } = useSidebar();
  const { refreshProfile: refreshGlobalProfile } = useProfile();

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

  // Location dropdowns
  const countries = Country.getAllCountries();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [serviceStates, setServiceStates] = useState<IState[]>([]);
  const [serviceCities, setServiceCities] = useState<ICity[]>([]);

  // Get flag component for selected country
  const selectedCountry = countries.find(c => `+${c.phonecode}` === formData.phoneCountryCode);
  const FlagComponent = selectedCountry ? (flags as any)[selectedCountry.isoCode] : null;

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
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile API Error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to load profile (${response.status})`);
      }

      const { data } = await response.json();
      const { countryCode, phoneNumber } = parsePhoneNumber(data.phone);

      // Initialize locations
      const consultantCountry = data.consultant.country || '';
      const consultantState = data.consultant.state || '';
      const serviceCountry = data.consultant.service_country || '';
      const serviceState = data.consultant.service_state || '';

      if (consultantCountry) {
        const countryObj = countries.find(c => c.name === consultantCountry);
        if (countryObj) {
          const countryStates = State.getStatesOfCountry(countryObj.isoCode);
          setStates(countryStates);
          if (consultantState) {
            const stateObj = countryStates.find(s => s.name === consultantState);
            if (stateObj) {
              setCities(City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode));
            }
          }
        }
      }

      if (serviceCountry) {
        const countryObj = countries.find(c => c.name === serviceCountry);
        if (countryObj) {
          const countryStates = State.getStatesOfCountry(countryObj.isoCode);
          setServiceStates(countryStates);
          if (serviceState) {
            const stateObj = countryStates.find(s => s.name === serviceState);
            if (stateObj) {
              setServiceCities(City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode));
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
        district: data.consultant.district || '',
        service_country: serviceCountry,
        service_state: serviceState,
        service_district: data.consultant.service_district || '',
      });

      setAvatarPreview(data.avatar_url || '');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load profile';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const handleCountryChange = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    if (country) {
      setStates(State.getStatesOfCountry(country.isoCode));
      setCities([]);
      setFormData(prev => ({ ...prev, country: countryName, state: '', district: '' }));
    }
  };

  const handleStateChange = (stateName: string) => {
    const country = countries.find(c => c.name === formData.country);
    if (country) {
      const state = states.find(s => s.name === stateName);
      if (state) {
        setCities(City.getCitiesOfState(country.isoCode, state.isoCode));
      }
    }
    setFormData(prev => ({ ...prev, state: stateName, district: '' }));
  };

  const handleServiceCountryChange = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    if (country) {
      setServiceStates(State.getStatesOfCountry(country.isoCode));
      setServiceCities([]);
      setFormData(prev => ({ ...prev, service_country: countryName, service_state: '', service_district: '' }));
    }
  };

  const handleServiceStateChange = (stateName: string) => {
    const country = countries.find(c => c.name === formData.service_country);
    if (country) {
      const state = serviceStates.find(s => s.name === stateName);
      if (state) {
        setServiceCities(City.getCitiesOfState(country.isoCode, state.isoCode));
      }
    }
    setFormData(prev => ({ ...prev, service_state: stateName, service_district: '' }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'File size must be less than 2MB' }));
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;

    setUploadingAvatar(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return publicUrl;
    } catch (error: unknown) {
      setErrors(prev => ({ ...prev, avatar: 'Failed to upload avatar' }));
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (formData.specialization_areas.length === 0) newErrors.specialization_areas = 'At least one specialization is required';
    if (formData.experience_years < 0 || formData.experience_years > 100) newErrors.experience_years = 'Invalid experience years';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district) newErrors.district = 'District is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(session.user.id);
        if (uploadedUrl) avatarUrl = uploadedUrl;
      }

      const requestBody = {
        full_name: formData.full_name,
        email: formData.email, // Required by API
        phone: formData.phoneNumber ? `${formData.phoneCountryCode}${formData.phoneNumber}` : null,
        avatar_url: avatarUrl,
        qualification: formData.qualification,
        specialization_areas: formData.specialization_areas,
        experience_years: formData.experience_years,
        country: formData.country,
        state: formData.state,
        district: formData.district,
        service_country: formData.service_country || null,
        service_state: formData.service_state || null,
        service_district: formData.service_district || null,
      };
      console.log('Sending profile update:', requestBody);

      const response = await fetch('/api/consultant/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('API Response:', response.status, result);

      if (!response.ok) {
        if (result.errors) {
          console.log('Validation errors:', result.errors);
          setErrors(result.errors);
        }
        throw new Error(result.error || 'Failed to update profile');
      }

      setSuccessMessage('Settings saved successfully!');
      setAvatarFile(null);
      setTimeout(() => setSuccessMessage(''), 4000);

      await fetchProfile();
      await refreshGlobalProfile();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100 hover:border-slate-300'
    }`;

  const selectClass = (hasError: boolean, disabled: boolean = false) =>
    `${inputClass(hasError)} appearance-none bg-slate-50 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100'}`;

  if (loading) {
    return (
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isCollapsed && !isTemporary ? "80px" : isTemporary ? "0" : "280px" }}
      >
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading settings...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex-1 transition-all duration-300"
      style={{ marginLeft: isCollapsed && !isTemporary ? "80px" : isTemporary ? "0" : "280px" }}
    >
      <div className="w-full">
        <DashboardHeader />

        <div className="p-4 md:p-6 max-w-5xl mx-auto">
          {/* Compact Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Settings</h1>
                <p className="text-xs text-slate-500">Manage your profile and preferences</p>
              </div>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>

          {/* Status Messages */}
          <AnimatePresence>
            {(successMessage || errorMessage) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${successMessage ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${successMessage ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {successMessage || errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1 space-y-4">
              {/* Avatar Card */}
              <SectionCard icon={User} title="Profile Photo">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src={avatarPreview || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
                    >
                      {uploadingAvatar ? (
                        <Loader2 size={12} className="text-white animate-spin" />
                      ) : (
                        <Upload size={12} className="text-white" />
                      )}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-500">JPG, PNG or GIF • Max 2MB</p>
                  {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>}
                </div>
              </SectionCard>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Profile Completion</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Basic Info</span>
                    <span className="text-emerald-400">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Professional</span>
                    <span className="text-emerald-400">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Location</span>
                    <span className="text-emerald-400">✓</span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right Column - Forms */}
            <div className="lg:col-span-2 space-y-4">
              {/* Personal Information */}
              <SectionCard icon={User} title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput label="Full Name *" error={errors.full_name}>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      className={inputClass(!!errors.full_name)}
                      placeholder="John Doe"
                    />
                  </FormInput>

                  <FormInput label="Email Address">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className={`${inputClass(false)} bg-slate-100 cursor-not-allowed`}
                    />
                  </FormInput>

                  <FormInput label="Phone Number" error={errors.phone} className="sm:col-span-2">
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-400">
                      <div className="relative border-r border-slate-200 bg-slate-50 shrink-0">
                        <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                          {FlagComponent && <FlagComponent className="rounded-[2px]" style={{ width: '18px' }} />}
                        </div>
                        <select
                          value={formData.phoneCountryCode}
                          onChange={(e) => updateField('phoneCountryCode', e.target.value)}
                          className="h-full bg-transparent text-xs font-semibold text-slate-700 py-2 pl-8 pr-6 appearance-none cursor-pointer focus:outline-none"
                        >
                          {countries.map((c) => (
                            <option key={c.isoCode} value={`+${c.phonecode}`}>+{c.phonecode}</option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 15))}
                        placeholder="3001234567"
                        className="flex-1 px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </FormInput>
                </div>
              </SectionCard>

              {/* Professional Details */}
              <SectionCard icon={Briefcase} title="Professional Details" iconGradient="from-blue-500 to-indigo-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput label="Qualification *" error={errors.qualification}>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => updateField('qualification', e.target.value)}
                      className={inputClass(!!errors.qualification)}
                      placeholder="MSc Agriculture"
                    />
                  </FormInput>

                  <FormInput label="Experience (Years) *" error={errors.experience_years}>
                    <input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => updateField('experience_years', parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className={inputClass(!!errors.experience_years)}
                    />
                  </FormInput>

                  <FormInput label="Specialization Areas *" error={errors.specialization_areas} className="sm:col-span-2">
                    <TagInput
                      tags={formData.specialization_areas}
                      onChange={(tags) => updateField('specialization_areas', tags)}
                      placeholder="Type and press Enter..."
                      suggestions={SPECIALIZATION_SUGGESTIONS}
                      error={errors.specialization_areas}
                    />
                  </FormInput>
                </div>
              </SectionCard>

              {/* Location */}
              <SectionCard icon={MapPin} title="Your Location" iconGradient="from-rose-500 to-pink-600">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormInput label="Country *" error={errors.country}>
                    <div className="relative">
                      <select
                        value={formData.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className={selectClass(!!errors.country)}
                      >
                        <option value="">Select</option>
                        {countries.map((c) => <option key={c.isoCode} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormInput>

                  <FormInput label="State/Province *" error={errors.state}>
                    <div className="relative">
                      <select
                        value={formData.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        disabled={!formData.country}
                        className={selectClass(!!errors.state, !formData.country)}
                      >
                        <option value="">Select</option>
                        {states.map((s) => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormInput>

                  <FormInput label="District/City *" error={errors.district}>
                    <div className="relative">
                      <select
                        value={formData.district}
                        onChange={(e) => updateField('district', e.target.value)}
                        disabled={!formData.state}
                        className={selectClass(!!errors.district, !formData.state)}
                      >
                        <option value="">Select</option>
                        {cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormInput>
                </div>
              </SectionCard>

              {/* Service Location */}
              <SectionCard icon={Globe} title="Service Location (Optional)" iconGradient="from-violet-500 to-purple-600">
                <p className="text-xs text-slate-500 mb-3">Where you provide consultation services</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormInput label="Country">
                    <div className="relative">
                      <select
                        value={formData.service_country}
                        onChange={(e) => handleServiceCountryChange(e.target.value)}
                        className={selectClass(false)}
                      >
                        <option value="">Select</option>
                        {countries.map((c) => <option key={c.isoCode} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormInput>

                  <FormInput label="State/Province">
                    <div className="relative">
                      <select
                        value={formData.service_state}
                        onChange={(e) => handleServiceStateChange(e.target.value)}
                        disabled={!formData.service_country}
                        className={selectClass(false, !formData.service_country)}
                      >
                        <option value="">Select</option>
                        {serviceStates.map((s) => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormInput>

                  <FormInput label="District/City">
                    <div className="relative">
                      <select
                        value={formData.service_district}
                        onChange={(e) => updateField('service_district', e.target.value)}
                        disabled={!formData.service_state}
                        className={selectClass(false, !formData.service_state)}
                      >
                        <option value="">Select</option>
                        {serviceCities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormInput>
                </div>
              </SectionCard>

              {/* Notification Preferences */}
              <SectionCard icon={Bell} title="Notifications" iconGradient="from-amber-500 to-orange-600">
                <div className="space-y-2.5">
                  {[
                    { label: "Email Notifications", desc: "Account activity updates" },
                    { label: "New Query Alerts", desc: "When farmers submit queries" },
                    { label: "Waste Record Updates", desc: "Marketplace activity" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-emerald-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500" />
                      </label>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
