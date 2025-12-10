'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, Check, ChevronDown, Edit2, Phone, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { validateEmail, validatePhone, validatePassword, validateFullName } from '@/lib/validationUtils';
import { CropTagInput } from './CropTagInput';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import * as flags from 'country-flag-icons/react/3x2';
import { toast } from 'sonner';
import { NotificationService } from '@/lib/notifications/NotificationService';
import { BaseNotification } from '@/types/notifications';

interface CreateFarmerFormProps {
  consultantId: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onCancel?: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
  farmName: string;
  country: string;
  state: string;
  district: string;
  landSize: string;
  crops: string[];
}

// Helper: Find country by phone code
const findCountryByPhoneCode = (phoneCode: string, countries: ICountry[]): ICountry | undefined => {
  const cleanCode = phoneCode.replace(/\+/g, '');
  return countries.find(c => c.phonecode === cleanCode);
};

// Helper: Parse phone number with country code (for future use if needed)
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

export const CreateFarmerForm: React.FC<CreateFarmerFormProps> = ({
  consultantId,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Country-State-City state
  const [countries] = useState<ICountry[]>(() => Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    phoneCountryCode: '+92',
    password: '',
    farmName: '',
    country: '',
    state: '',
    district: '',
    landSize: '',
    crops: [],
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle country change
  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      setCities([]);
      setFormData(prev => ({ ...prev, country: countryName, state: '', district: '' }));
      // Clear country error when selected
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
      // Clear state error when selected
      if (errors.state) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.state;
          return newErrors;
        });
      }
    }
  };

  // Handle phone country code change - auto-assign country
  const handlePhoneCountryCodeChange = (newCountryCode: string) => {
    const selectedCountry = findCountryByPhoneCode(newCountryCode, countries);

    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      setCities([]);

      setFormData(prev => ({
        ...prev,
        phoneCountryCode: newCountryCode,
        country: selectedCountry.name,
        state: '',
        district: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, phoneCountryCode: newCountryCode }));
    }
  };

  // Get flag component for phone input
  const selectedPhoneCountry = countries.find(c => c.phonecode === formData.phoneCountryCode.replace('+', ''));
  const FlagComponent = selectedPhoneCountry ? (flags as any)[selectedPhoneCountry.isoCode] : null;

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name Validation
    const nameValidation = validateFullName(formData.fullName);
    if (!nameValidation.valid) {
      newErrors.fullName = nameValidation.error || 'Invalid full name';
    } else if (formData.fullName.trim().length > 255) {
      newErrors.fullName = 'Full name cannot exceed 255 characters';
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 255) {
      newErrors.email = 'Email cannot exceed 255 characters';
    }

    // Phone Validation with country-specific rules
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only digits';
    } else if (formData.phone.length < 7 || formData.phone.length > 15) {
      newErrors.phone = 'Phone number must be between 7 and 15 digits';
    } else if (formData.phoneCountryCode === '+92' && formData.phone.length !== 10) {
      newErrors.phone = 'Pakistani phone numbers must be exactly 10 digits';
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Farm Name Validation
    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required';
    } else if (formData.farmName.trim().length < 2) {
      newErrors.farmName = 'Farm name must be at least 2 characters';
    } else if (formData.farmName.trim().length > 255) {
      newErrors.farmName = 'Farm name cannot exceed 255 characters';
    } else if (!/^[A-Za-zÀ-ÿ0-9\s\-'\.&()]+$/.test(formData.farmName.trim())) {
      newErrors.farmName = 'Farm name contains invalid characters';
    } else if (/\s{2,}/.test(formData.farmName.trim())) {
      newErrors.farmName = 'Avoid multiple consecutive spaces';
    }

    // Country Validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // State Validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (formData.state.trim().length > 100) {
      newErrors.state = 'State name cannot exceed 100 characters';
    }

    // District Validation
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    } else if (formData.district.trim().length > 100) {
      newErrors.district = 'District name cannot exceed 100 characters';
    }

    // Land Size Validation
    if (!formData.landSize.trim()) {
      newErrors.landSize = 'Land size is required';
    } else {
      const landSize = parseFloat(formData.landSize);
      if (isNaN(landSize) || landSize <= 0) {
        newErrors.landSize = 'Please enter a valid land size';
      } else if (landSize > 999999.99) {
        newErrors.landSize = 'Land size cannot exceed 999,999.99 acres';
      } else if (!/^\d+(\.\d{1,2})?$/.test(formData.landSize)) {
        newErrors.landSize = 'Land size can have at most 2 decimal places';
      }
    }

    // Crops Validation
    if (formData.crops.length === 0) {
      newErrors.crops = 'Please add at least one crop';
    } else if (formData.crops.some(c => !c.trim())) {
      newErrors.crops = 'Crop names cannot be empty';
    } else if (formData.crops.some(c => c.trim().length < 2)) {
      newErrors.crops = 'Crop names must be at least 2 characters';
    } else if (formData.crops.some(c => c.trim().length > 100)) {
      newErrors.crops = 'Crop names cannot exceed 100 characters';
    } else if (formData.crops.some(c => !/^[A-Za-zÀ-ÿ\s\-'&()]+$/.test(c.trim()))) {
      newErrors.crops = 'Crop names can only contain letters, spaces, hyphens, apostrophes, and parentheses';
    } else if (formData.crops.some(c => /\s{2,}/.test(c.trim()))) {
      newErrors.crops = 'Crop names cannot have multiple consecutive spaces';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) {
      setErrors({ submit: 'Please fix all validation errors before submitting' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      // Sanitize inputs by trimming whitespace
      const sanitizedFullName = formData.fullName.trim();
      const sanitizedEmail = formData.email.trim().toLowerCase();
      const sanitizedFarmName = formData.farmName.trim();
      const sanitizedState = formData.state.trim();
      const sanitizedDistrict = formData.district.trim();
      const sanitizedCrops = formData.crops.map(c => c.trim()).filter(c => c.length > 0);

      const fullPhone = `${formData.phoneCountryCode}${formData.phone}`;

      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          data: {
            full_name: sanitizedFullName,
            phone: fullPhone,
            role: 'farmer',
          },
        },
      });

      if (authError) {
        // Handle specific auth errors
        if (authError.message?.includes('already registered') || authError.message?.includes('already been registered')) {
          throw new Error('This email address is already registered. Please use a different email.');
        } else if (authError.message?.includes('invalid email')) {
          throw new Error('Invalid email address format.');
        } else {
          throw new Error(authError.message || 'Failed to create authentication account.');
        }
      }

      if (!authData.user) {
        throw new Error('Failed to create user account. Please try again.');
      }

      // Check if user already exists (Supabase returns user with empty identities for existing emails)
      // This is a security feature to prevent email enumeration
      if (authData.user.identities && authData.user.identities.length === 0) {
        throw new Error('This email address is already registered. Please use a different email.');
      }

      // Wait for profile to be created by trigger
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Retrieve created profile with retry logic
      let profile = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (!profile && retryCount < maxRetries) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('auth_user_id', authData.user.id)
          .single();

        if (profileData) {
          profile = profileData;
          break;
        }

        if (profileError && profileError.code === 'PGRST116') {
          // Row not found - wait and retry
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        } else if (profileError) {
          // Other error - check if email already exists
          throw new Error('This email address may already be registered. Please try a different email.');
        }
      }

      if (!profile) {
        throw new Error('Account setup is taking longer than expected. Please try again or contact support.');
      }

      // Update farmer details
      const { error: farmersError } = await supabase
        .from('farmers')
        .update({
          consultant_id: consultantId,
          farm_name: sanitizedFarmName,
          district: sanitizedDistrict,
          state: sanitizedState,
          land_size_acres: parseFloat(formData.landSize),
          current_crops: sanitizedCrops,
        })
        .eq('profile_id', profile.id);

      if (farmersError) {
        throw new Error(`Failed to update farm details: ${farmersError.message}`);
      }

      // Set profile as active
      const { error: statusError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', profile.id);

      if (statusError) {
        throw new Error(`Failed to activate account: ${statusError.message}`);
      }

      // Send notifications to both farmer and consultant
      try {
        const notificationService = new NotificationService(supabase);

        // Get consultant name
        const { data: consultantProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', consultantId)
          .single();

        const notifications: BaseNotification[] = [
          // Notify consultant of new farmer creation
          {
            recipient_id: consultantId,
            type: 'farmer_created',
            category: 'relationship',
            priority: 'normal',
            title: 'Farmer Account Created',
            message: `New farmer account for ${sanitizedFullName} has been created successfully`,
            action_url: '/dashboard/consultant/farmers',
            metadata: { farmer_id: profile.id },
          },
          // Notify farmer of account activation
          {
            recipient_id: profile.id,
            type: 'account_activated',
            category: 'status',
            priority: 'high',
            title: 'Account Activated',
            message: 'Your account is now active. You can log in and start using AgriFusion.',
            action_url: '/dashboard/farmer',
          },
          // Notify farmer of farm setup
          {
            recipient_id: profile.id,
            type: 'farm_setup',
            category: 'farm',
            priority: 'normal',
            title: 'Farm Profile Configured',
            message: `Your farm details have been set up: ${sanitizedFarmName} - ${formData.landSize} acres`,
            action_url: '/dashboard/farmer/farm',
            metadata: {
              farm_name: sanitizedFarmName,
              land_size: parseFloat(formData.landSize),
              crops: sanitizedCrops
            },
          },
          // Notify farmer of consultant assignment
          {
            recipient_id: profile.id,
            type: 'consultant_assigned',
            category: 'relationship',
            priority: 'high',
            title: 'Consultant Assigned',
            message: `${consultantProfile?.full_name || 'Your consultant'} has been assigned as your agricultural consultant`,
            action_url: '/dashboard/farmer/consultant',
            metadata: { consultant_id: consultantId },
          },
        ];

        await notificationService.createMany(notifications);
        toast.success('Farmer account created successfully!');
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
        // Don't fail the farmer creation if notifications fail
        toast.success('Farmer account created successfully!');
      }

      // Success! Reset form for adding another farmer
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        phoneCountryCode: '+92',
        password: '',
        farmName: '',
        country: '',
        state: '',
        district: '',
        landSize: '',
        crops: [],
      });
      setStep(1);
      setStates([]);
      setCities([]);
      setErrors({});
      setSubmitting(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Create farmer error:', err);
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
      setErrors({ submit: errorMessage });

      // Also call onError callback if provided
      if (onError) {
        onError(errorMessage);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
      {/* Compact Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Create New Farmer Account</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Complete farmer account with farm details</p>
      </div>

      {/* Slim Progress Bar */}
      <div className="flex items-center gap-1.5 mb-5">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center flex-1 gap-1.5">
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-500 ease-out ${step >= stepNum ? 'bg-emerald-500' : 'bg-slate-100'
                }`}
            />
            {stepNum < 3 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors duration-300 ${step > stepNum ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300'
                }`}>
                {step > stepNum ? <Check size={10} strokeWidth={3} /> : null}
              </span>
            )}
          </div>
        ))}
        <span className="text-[10px] font-semibold text-slate-400 ml-1 tracking-wide uppercase">Step {step}/3</span>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Personal Information
            </h4>

            {/* 3-column grid on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Full Name */}
              <div className="group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 placeholder:text-slate-300 hover:bg-slate-100 ${errors.fullName ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10' : ''
                    }`}
                />
                {errors.fullName && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="farmer@example.com"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 placeholder:text-slate-300 hover:bg-slate-100 ${errors.email ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10' : ''
                    }`}
                />
                {errors.email && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 placeholder:text-slate-300 hover:bg-slate-100 ${errors.password ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10' : ''
                    }`}
                />
                {errors.password && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.password}</p>}
              </div>

              {/* Phone Input - Merged Input Group */}
              <div className="md:col-span-3 group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Phone Number *</label>
                <div className={`flex w-full rounded-xl bg-slate-50 transition-all duration-200 hover:bg-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 border border-transparent ${errors.phone ? 'border-red-300 bg-red-50/50' : ''}`}>
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
                      className="h-full bg-transparent text-xs font-semibold text-slate-700 rounded-l-xl py-2 pl-10 pr-7 focus:outline-none appearance-none cursor-pointer"
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
                    onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 15))}
                    placeholder="3001234567"
                    maxLength={15}
                    className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-300 rounded-r-xl"
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.phone}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Farm Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Farm Information
            </h4>

            {/* 3-column grid on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Farm Name - Full width */}
              <div className="md:col-span-2 group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Farm Name *</label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => updateField('farmName', e.target.value)}
                  placeholder="Enter farm name"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 placeholder:text-slate-300 hover:bg-slate-100 ${errors.farmName ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10' : ''
                    }`}
                />
                {errors.farmName && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.farmName}</p>}
              </div>

              {/* Land Size */}
              <div className="group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Land Size (acres) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.landSize}
                  onChange={(e) => updateField('landSize', e.target.value)}
                  placeholder="e.g., 10.5"
                  className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 placeholder:text-slate-300 hover:bg-slate-100 ${errors.landSize ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10' : ''
                    }`}
                />
                {errors.landSize && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.landSize}</p>}
              </div>

              {/* Country Select */}
              <div className="group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Country *</label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 appearance-none cursor-pointer hover:bg-slate-100 ${errors.country ? 'border-red-300 bg-red-50/50' : ''
                      }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.country && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.country}</p>}
              </div>

              {/* State Select */}
              <div className="group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">State/Province *</label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    disabled={!formData.country}
                    className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 appearance-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-100 ${errors.state ? 'border-red-300 bg-red-50/50' : ''
                      }`}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.state && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.state}</p>}
              </div>

              {/* District/City */}
              <div className="group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">District/City *</label>
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    disabled={!formData.state}
                    className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 appearance-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-100 ${errors.district ? 'border-red-300 bg-red-50/50' : ''
                      }`}
                  >
                    <option value="">Select District</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.district && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.district}</p>}
              </div>

              {/* Crops - Full width */}
              <div className="md:col-span-3 group">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-1 block group-focus-within:text-emerald-600 transition-colors">Current Crops *</label>
                <CropTagInput
                  crops={formData.crops}
                  onChange={(crops) => updateField('crops', crops)}
                />
                {errors.crops && <p className="text-[10px] text-red-600 mt-1 ml-1 font-medium">{errors.crops}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Review Information
            </h4>

            {/* Two cards side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Personal Info Card */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1 bg-white rounded-md shadow-sm text-emerald-600">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    Personal Information
                  </h5>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md"
                  >
                    <Edit2 size={10} /> Edit
                  </button>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80 last:border-0">
                    <span className="text-slate-500 font-medium">Name</span>
                    <span className="font-semibold text-slate-800">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80 last:border-0">
                    <span className="text-slate-500 font-medium">Email</span>
                    <span className="font-semibold text-slate-800 truncate ml-2">{formData.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80 last:border-0">
                    <span className="text-slate-500 font-medium">Phone</span>
                    <span className="font-semibold text-slate-800">{formData.phoneCountryCode}{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Farm Info Card */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1 bg-white rounded-md shadow-sm text-emerald-600">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    Farm Information
                  </h5>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[10px] text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md"
                  >
                    <Edit2 size={10} /> Edit
                  </button>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80 last:border-0">
                    <span className="text-slate-500 font-medium">Farm</span>
                    <span className="font-semibold text-slate-800">{formData.farmName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80 last:border-0">
                    <span className="text-slate-500 font-medium">Location</span>
                    <span className="font-semibold text-slate-800">{formData.district}, {formData.state}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80 last:border-0">
                    <span className="text-slate-500 font-medium">Land</span>
                    <span className="font-semibold text-slate-800">{formData.landSize} acres</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/80 last:border-0">
                    <span className="text-slate-500 font-medium">Crops</span>
                    <span className="font-semibold text-slate-800 truncate ml-2">{formData.crops.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <p className="text-[11px] font-medium text-red-700">{errors.submit}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons - Compact */}
      <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} pt-4 mt-4 border-t border-slate-100`}>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            disabled={submitting}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm hover:shadow"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
          >
            Next
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check size={14} strokeWidth={3} />
                Create Account
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
