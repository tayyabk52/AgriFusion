'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, Check, ChevronDown, Edit2, Phone, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { validateEmail, validatePhone, validatePassword } from '@/lib/validationUtils';
import { CropTagInput } from './CropTagInput';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import * as flags from 'country-flag-icons/react/3x2';

interface CreateFarmerFormProps {
  consultantId: string;
  onSuccess?: () => void;
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

export const CreateFarmerForm: React.FC<CreateFarmerFormProps> = ({
  consultantId,
  onSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPersonalInfoExpanded, setIsPersonalInfoExpanded] = useState(false);
  const [canEditPersonalInfo, setCanEditPersonalInfo] = useState(false);

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
    }
  };

  // Get flag component for phone input
  const selectedPhoneCountry = countries.find(c => c.phonecode === formData.phoneCountryCode.replace('+', ''));
  const FlagComponent = selectedPhoneCountry ? (flags as any)[selectedPhoneCountry.isoCode] : null;

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

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

    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    if (!formData.landSize.trim()) {
      newErrors.landSize = 'Land size is required';
    } else if (isNaN(Number(formData.landSize)) || Number(formData.landSize) <= 0) {
      newErrors.landSize = 'Please enter a valid land size';
    }

    if (formData.crops.length === 0) {
      newErrors.crops = 'Please add at least one crop';
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
    if (!validateStep1() || !validateStep2()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const fullPhone = `${formData.phoneCountryCode}${formData.phone}`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: fullPhone,
            role: 'farmer',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to retrieve farmer profile');
      }

      const { error: farmersError } = await supabase
        .from('farmers')
        .update({
          consultant_id: consultantId,
          farm_name: formData.farmName,
          district: formData.district,
          state: formData.state,
          land_size_acres: parseFloat(formData.landSize),
          current_crops: formData.crops,
        })
        .eq('profile_id', profile.id);

      if (farmersError) throw farmersError;

      const { error: statusError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', profile.id);

      if (statusError) throw statusError;

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Create farmer error:', err);
      let errorMessage = 'Failed to create farmer account. ';
      if (err.message?.includes('already registered')) {
        errorMessage += 'This email is already registered.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5  p-3 md:p-5 bg-white">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Create New Farmer Account</h3>
        <p className="text-xs text-slate-500 mt-0.5">Create a complete farmer account with farm details</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= stepNum
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
                }`}
            >
              {step > stepNum ? <Check size={16} /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded transition-all ${step > stepNum ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-slate-900 text-sm">Personal Information</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-medium text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.fullName ? 'border-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-medium text-slate-700">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="farmer@example.com"
                  className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? 'border-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Phone Input with Country Code */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-700">Phone Number *</label>
                <div className="flex gap-2 mt-1">
                  <div className="relative w-32">
                    <div className="absolute inset-0 flex items-center pl-2 pointer-events-none text-slate-900 text-sm font-medium">
                      {FlagComponent && (
                        <FlagComponent className="mr-1.5 rounded-sm" style={{ width: '20px', height: 'auto' }} />
                      )}
                      <span className="text-xs">{formData.phoneCountryCode}</span>
                    </div>
                    <select
                      value={formData.phoneCountryCode}
                      onChange={(e) => updateField('phoneCountryCode', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-transparent text-sm rounded-lg py-2 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    >
                      {countries.map((country) => (
                        <option key={country.isoCode} value={`+${country.phonecode}`} className="text-slate-900">
                          +{country.phonecode} ({country.isoCode})
                        </option>
                      ))}
                    </select>
                    <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="3001234567"
                      maxLength={10}
                      className={`w-full px-3 py-2 pl-9 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phone ? 'border-red-300' : 'border-slate-200'
                        }`}
                    />
                  </div>
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-700">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.password ? 'border-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Farm Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-slate-900 text-sm">Farm Information</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-700">Farm Name *</label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => updateField('farmName', e.target.value)}
                  placeholder="Enter farm name"
                  className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.farmName ? 'border-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.farmName && <p className="text-xs text-red-600 mt-1">{errors.farmName}</p>}
              </div>

              {/* Country Select */}
              <div>
                <label className="text-xs font-medium text-slate-700">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.country ? 'border-red-300' : 'border-slate-200'
                    }`}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>{country.name}</option>
                  ))}
                </select>
                {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
              </div>

              {/* State Select */}
              <div>
                <label className="text-xs font-medium text-slate-700">State/Province *</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={!formData.country}
                  className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${errors.state ? 'border-red-300' : 'border-slate-200'
                    }`}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.name}>{state.name}</option>
                  ))}
                </select>
                {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
              </div>

              {/* District/City */}
              <div>
                <label className="text-xs font-medium text-slate-700">District/City *</label>
                {cities.length > 0 ? (
                  <select
                    value={formData.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    disabled={!formData.state}
                    className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${errors.district ? 'border-red-300' : 'border-slate-200'
                      }`}
                  >
                    <option value="">Select District</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    placeholder="Enter district"
                    className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.district ? 'border-red-300' : 'border-slate-200'
                      }`}
                  />
                )}
                {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Land Size (acres) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.landSize}
                  onChange={(e) => updateField('landSize', e.target.value)}
                  placeholder="e.g., 10.5"
                  className={`w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.landSize ? 'border-red-300' : 'border-slate-200'
                    }`}
                />
                {errors.landSize && <p className="text-xs text-red-600 mt-1">{errors.landSize}</p>}
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-700 block mb-1">Current Crops *</label>
                <CropTagInput
                  crops={formData.crops}
                  onChange={(crops) => updateField('crops', crops)}
                />
                {errors.crops && <p className="text-xs text-red-600 mt-1">{errors.crops}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-slate-900 text-sm">Review Information</h4>

            <div className="space-y-3">
              {/* Personal Info Card */}
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-semibold text-slate-900">Personal Information</h5>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Name:</span>
                    <span className="ml-1 font-medium text-slate-900">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>
                    <span className="ml-1 font-medium text-slate-900">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>
                    <span className="ml-1 font-medium text-slate-900">{formData.phoneCountryCode}{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Farm Info Card */}
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-semibold text-slate-900">Farm Information</h5>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Farm:</span>
                    <span className="ml-1 font-medium text-slate-900">{formData.farmName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Location:</span>
                    <span className="ml-1 font-medium text-slate-900">{formData.district}, {formData.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Land:</span>
                    <span className="ml-1 font-medium text-slate-900">{formData.landSize} acres</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Crops:</span>
                    <span className="ml-1 font-medium text-slate-900">{formData.crops.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700">{errors.submit}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} pt-4 border-t border-slate-100`}>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            disabled={submitting}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            Next
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check size={16} />
                Create Account
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
