'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, Check, ChevronDown, Edit2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { validateEmail, validatePhone, validatePassword } from '@/lib/validationUtils';
import { CropTagInput } from './CropTagInput';

interface CreateFarmerFormProps {
  consultantId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  farmName: string;
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
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [canEditPersonalInfo, setCanEditPersonalInfo] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    farmName: '',
    state: '',
    district: '',
    landSize: '',
    crops: [],
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
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
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'farmer',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');

      // 2. Wait for database trigger to create profile and farmers record
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Get the new profile ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to retrieve farmer profile');
      }

      // 4. Update farmers record with farm details and consultant link
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

      // 5. Update profile status to active
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Create New Farmer Account</h3>
        <p className="text-sm text-slate-600">
          Create a complete farmer account with farm details
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= stepNum
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > stepNum ? <Check size={20} /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div
                className={`flex-1 h-1 mx-2 rounded transition-all ${
                  step > stepNum ? 'bg-emerald-600' : 'bg-slate-200'
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
            <h4 className="font-semibold text-slate-900">Personal Information</h4>

            <div>
              <label className="text-sm font-medium text-slate-700">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="Enter full name"
                className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.fullName ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="farmer@example.com"
                className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.email ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="3001234567"
                className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.phone ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Minimum 8 characters"
                className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.password ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
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
            <h4 className="font-semibold text-slate-900">Farm Information</h4>

            <div>
              <label className="text-sm font-medium text-slate-700">Farm Name *</label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => updateField('farmName', e.target.value)}
                placeholder="Enter farm name"
                className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.farmName ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.farmName && <p className="text-xs text-red-600 mt-1">{errors.farmName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="e.g., Punjab"
                  className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.state ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">District *</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="e.g., Faisalabad"
                  className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.district ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Land Size (acres) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.landSize}
                onChange={(e) => updateField('landSize', e.target.value)}
                placeholder="e.g., 10.5"
                className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.landSize ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {errors.landSize && <p className="text-xs text-red-600 mt-1">{errors.landSize}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Current Crops *
              </label>
              <CropTagInput
                crops={formData.crops}
                onChange={(crops) => updateField('crops', crops)}
              />
              {errors.crops && <p className="text-xs text-red-600 mt-1">{errors.crops}</p>}
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
            className="space-y-6"
          >
            <h4 className="font-semibold text-slate-900">Review Information</h4>

            <div className="bg-slate-50 rounded-xl space-y-4">
              {/* Personal Information - Collapsible */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsPersonalInfoExpanded(!isPersonalInfoExpanded)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
                >
                  <h5 className="text-sm font-semibold text-slate-900">Personal Information</h5>
                  <div className="flex items-center gap-2">
                    {!isPersonalInfoExpanded && canEditPersonalInfo && (
                      <span className="text-xs text-emerald-600 font-medium">Editable</span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform ${
                        isPersonalInfoExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isPersonalInfoExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-200"
                    >
                      <div className="p-4 space-y-4">
                        {!canEditPersonalInfo ? (
                          <>
                            {/* Read-only view */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-slate-500">Full Name</p>
                                <p className="font-medium text-slate-900">{formData.fullName}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Email</p>
                                <p className="font-medium text-slate-900">{formData.email}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Phone</p>
                                <p className="font-medium text-slate-900">{formData.phone}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowEditConfirmation(true)}
                              className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium"
                            >
                              <Edit2 size={16} />
                              Edit Personal Information
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Editable view */}
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium text-slate-700">Full Name *</label>
                                <input
                                  type="text"
                                  value={formData.fullName}
                                  onChange={(e) => updateField('fullName', e.target.value)}
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-700">Email *</label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => updateField('email', e.target.value)}
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-700">Phone *</label>
                                <input
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) => updateField('phone', e.target.value)}
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setCanEditPersonalInfo(false);
                                  setIsPersonalInfoExpanded(false);
                                }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                              >
                                Done Editing
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Farm Information */}
              <div className="p-4 border border-slate-200 rounded-xl">
                <h5 className="text-sm font-semibold text-slate-900 mb-3">Farm Information</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Farm Name</p>
                    <p className="font-medium text-slate-900">{formData.farmName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">
                      {formData.district}, {formData.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Land Size</p>
                    <p className="font-medium text-slate-900">{formData.landSize} acres</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Crops</p>
                    <p className="font-medium text-slate-900">{formData.crops.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} pt-6 border-t border-slate-100`}>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            disabled={submitting}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            Next
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Check size={18} />
                Create Farmer Account
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
