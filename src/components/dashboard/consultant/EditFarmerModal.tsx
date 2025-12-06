'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save, User as UserIcon, Sprout, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { FarmerWithProfile } from '@/types/farmer';
import { validatePhone } from '@/lib/validationUtils';
import { CropTagInput } from './CropTagInput';
import { ConfirmationModal } from './ConfirmationModal';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import * as flags from 'country-flag-icons/react/3x2';

/**
 * Parse a full phone number (with country code) into its components
 * Uses library data to correctly identify country codes
 * @param fullPhone - Full phone number with country code (e.g., "+923084450419")
 * @param countries - List of countries from country-state-city
 * @returns { countryCode: string, phoneNumber: string }
 */
const parsePhoneNumber = (fullPhone: string, countries: ICountry[]): { countryCode: string; phoneNumber: string } => {
  if (!fullPhone) return { countryCode: '+92', phoneNumber: '' };

  // If doesn't start with +, assume no country code
  if (!fullPhone.startsWith('+')) {
    return { countryCode: '+92', phoneNumber: fullPhone.replace(/\D/g, '') };
  }

  // Try to match against all known country codes (longest match first)
  // Sort countries by phonecode length (descending) to match longest first
  const sortedCountries = [...countries].sort((a, b) => b.phonecode.length - a.phonecode.length);

  for (const country of sortedCountries) {
    const codeToMatch = `+${country.phonecode}`;
    if (fullPhone.startsWith(codeToMatch)) {
      const phoneNumber = fullPhone.substring(codeToMatch.length);
      // Ensure remaining part is all digits
      if (/^\d+$/.test(phoneNumber) && phoneNumber.length >= 7) {
        return {
          countryCode: codeToMatch,
          phoneNumber: phoneNumber
        };
      }
    }
  }

  // Fallback: Try basic regex as last resort
  const match = fullPhone.match(/^(\+\d{1,4})(\d{7,15})$/);
  if (match) {
    return {
      countryCode: match[1],
      phoneNumber: match[2]
    };
  }

  // Complete fallback: couldn't parse
  return { countryCode: '+92', phoneNumber: fullPhone.replace(/\+/g, '') };
};

/**
 * Find country by phone code from country-state-city library
 * Handles library's inconsistent phonecode formats (some have +, some don't, some have hyphens)
 * @param phoneCode - Phone code with + (e.g., "+92", "+1-684")
 * @param countries - Array of countries from library
 */
const findCountryByPhoneCode = (phoneCode: string, countries: ICountry[]): ICountry | undefined => {
  const cleanCode = phoneCode.replace(/\+/g, ''); // Remove + for comparison
  return countries.find(c => c.phonecode === cleanCode);
};

interface EditFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  farmer: FarmerWithProfile;
}

interface EditFormData {
  fullName: string;
  phone: string;
  phoneCountryCode: string;
  email: string;
  farmName: string;
  country: string;
  state: string;
  district: string;
  landSize: string;
  crops: string[];
}

interface OriginalData {
  phone: string; // Just the digits, no country code
  phoneCountryCode: string;
}

export const EditFarmerModal: React.FC<EditFarmerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  farmer,
}) => {
  const [formData, setFormData] = useState<EditFormData>({
    fullName: '',
    phone: '',
    phoneCountryCode: '+92', // Default to Pakistan
    email: '',
    farmName: '',
    country: '',
    state: '',
    district: '',
    landSize: '',
    crops: [],
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<OriginalData>({ phone: '', phoneCountryCode: '+92' });
  const [phoneEditConfirmed, setPhoneEditConfirmed] = useState(false);
  const [showPhoneConfirmModal, setShowPhoneConfirmModal] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingPhoneValue, setPendingPhoneValue] = useState('');
  const [pendingCountryCode, setPendingCountryCode] = useState('');

  // Country/State/City data
  const [countries] = useState<ICountry[]>(() => Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    if (isOpen && farmer) {
      const profile = farmer.profiles;
      const phoneValue = profile?.phone || '';

      // Parse phone number using new robust parser
      const { countryCode, phoneNumber } = parsePhoneNumber(phoneValue, countries);

      // Determine country for state/district loading
      // Country is inferred from phone code (not stored in database)
      let countryName = '';
      const stateName = farmer.state || '';
      let selectedCountry: ICountry | undefined;

      if (countryCode) {
        // Auto-infer country from phone code
        selectedCountry = findCountryByPhoneCode(countryCode, countries);
        if (selectedCountry) {
          countryName = selectedCountry.name;
        }
      }

      // Load states based on country
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(countryStates);

        // Load cities based on state
        if (stateName) {
          const selectedState = countryStates.find(s => s.name === stateName);
          if (selectedState) {
            const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
            setCities(stateCities);
          }
        }
      }

      setFormData({
        fullName: profile?.full_name || '',
        phone: phoneNumber,
        phoneCountryCode: countryCode,
        email: profile?.email || '',
        farmName: farmer.farm_name || '',
        country: countryName,
        state: stateName,
        district: farmer.district || '',
        landSize: farmer.land_size_acres?.toString() || '',
        crops: farmer.current_crops || [],
      });
      // Store original phone WITHOUT country code for comparison
      setOriginalData({ phone: phoneNumber, phoneCountryCode: countryCode });
      setHasChanges(false);
      setErrors({});
      setPhoneEditConfirmed(false);
    }
  }, [isOpen, farmer, countries]);

  const updateField = (field: keyof EditFormData, value: any) => {
    // Special handling for phone number changes
    // Compare just the digits, and also check if country code changed
    const phoneChanged = field === 'phone' && value !== originalData.phone;
    const countryCodeChanged = formData.phoneCountryCode !== originalData.phoneCountryCode;

    if (phoneChanged && !phoneEditConfirmed && value !== '') {
      setPendingPhoneValue(value);
      setShowPhoneConfirmModal(true);
      return;
    }

    // If country code changed, also require confirmation if phone exists
    if (countryCodeChanged && originalData.phone && !phoneEditConfirmed) {
      // Country code change affects the full phone number
      setPhoneEditConfirmed(false);
    }

    // Handle country change - load states
    if (field === 'country') {
      const selectedCountry = countries.find(c => c.name === value);
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(countryStates);
      } else {
        setStates([]);
      }
      setCities([]);
      setFormData((prev) => ({ ...prev, country: value, state: '', district: '' }));
      setHasChanges(true);
      return;
    }

    // Handle state change - load cities
    if (field === 'state') {
      const selectedCountry = countries.find(c => c.name === formData.country);
      const selectedState = states.find(s => s.name === value);
      if (selectedCountry && selectedState) {
        const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
        setCities(stateCities);
      } else {
        setCities([]);
      }
      setFormData((prev) => ({ ...prev, state: value, district: '' }));
      setHasChanges(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhoneConfirm = () => {
    setPhoneEditConfirmed(true);

    // Apply pending changes
    if (pendingPhoneValue) {
      setFormData((prev) => ({ ...prev, phone: pendingPhoneValue }));
    }

    if (pendingCountryCode) {
      // Auto-assign country when phone code changes
      const selectedCountry = findCountryByPhoneCode(pendingCountryCode, countries);
      if (selectedCountry) {
        // Load states for the new country
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(countryStates);
        setCities([]);

        setFormData(prev => ({
          ...prev,
          phoneCountryCode: pendingCountryCode,
          country: selectedCountry.name,
          state: '', // Reset state and district
          district: ''
        }));
      } else {
        setFormData(prev => ({ ...prev, phoneCountryCode: pendingCountryCode }));
      }
    }

    setHasChanges(true);
    setShowPhoneConfirmModal(false);
    setPendingPhoneValue('');
    setPendingCountryCode('');
  };

  const handlePhoneCancel = () => {
    setShowPhoneConfirmModal(false);
    setPendingPhoneValue('');
    setPendingCountryCode('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 255) {
      newErrors.fullName = 'Full name cannot exceed 255 characters';
    }

    // Phone Validation
    if (formData.phone) {
      // Check if phone contains only digits
      if (!/^\d+$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must contain only digits';
      }
      // Check length (most countries use 7-15 digits)
      else if (formData.phone.length < 7 || formData.phone.length > 15) {
        newErrors.phone = 'Phone number must be between 7 and 15 digits';
      }
      // For specific validation (e.g., Pakistan = 10 digits)
      // You can add country-specific rules here
      else if (formData.phoneCountryCode === '+92' && formData.phone.length !== 10) {
        newErrors.phone = 'Pakistani phone numbers must be exactly 10 digits (e.g., 3001234567)';
      }
    }

    // Phone Country Code Validation
    if (!formData.phoneCountryCode) {
      newErrors.phone = 'Country code is required';
    }

    // Farm Name Validation
    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required';
    } else if (formData.farmName.length > 255) {
      newErrors.farmName = 'Farm name cannot exceed 255 characters';
    }

    // Country Validation (optional but helps load states)
    if (!formData.country) {
      newErrors.country = 'Please select a country to enable state/district selection';
    }

    // State Validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (formData.state.length > 100) {
      newErrors.state = 'State name cannot exceed 100 characters';
    }

    // District Validation
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    } else if (formData.district.length > 100) {
      newErrors.district = 'District name cannot exceed 100 characters';
    }

    // Land Size Validation
    if (formData.landSize) {
      const landSizeNum = Number(formData.landSize);
      if (isNaN(landSizeNum)) {
        newErrors.landSize = 'Land size must be a valid number';
      } else if (landSizeNum <= 0) {
        newErrors.landSize = 'Land size must be greater than 0';
      } else if (landSizeNum > 999999.99) {
        newErrors.landSize = 'Land size cannot exceed 999,999.99 acres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    setErrors({});

    try {
      const profile = farmer.profiles;

      // Update both tables in parallel
      const updates = await Promise.all([
        // Update profile
        supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            phone: formData.phone ? `${formData.phoneCountryCode}${formData.phone}` : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id),

        // Update farmers
        // NOTE: country is kept in form state for UI (to load states/districts)
        // but NOT saved to database as the column doesn't exist in schema
        supabase
          .from('farmers')
          .update({
            farm_name: formData.farmName,
            district: formData.district,
            state: formData.state,
            land_size_acres: formData.landSize ? parseFloat(formData.landSize) : null,
            current_crops: formData.crops,
            updated_at: new Date().toISOString(),
          })
          .eq('id', farmer.id),
      ]);

      // Check for errors
      const [profileResult, farmerResult] = updates;

      if (profileResult.error) throw profileResult.error;
      if (farmerResult.error) throw farmerResult.error;

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Update error:', err);
      setErrors({ submit: err.message || 'Failed to update farmer details. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowUnsavedChangesModal(true);
      return;
    }
    onClose();
  };

  const handleUnsavedChangesConfirm = () => {
    setShowUnsavedChangesModal(false);
    onClose();
  };

  const handleUnsavedChangesCancel = () => {
    setShowUnsavedChangesModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="edit-farmer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-slate-900">Edit Farmer Details</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <UserIcon size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.fullName ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <div className="flex gap-2 mt-1">
                    {/* Country Code Dropdown */}
                    <div className="relative w-1/3 min-w-[140px]">
                      {/* Display overlay showing selected country code and flag */}
                      {(() => {
                        const selectedCountry = findCountryByPhoneCode(formData.phoneCountryCode, countries);
                        const FlagComponent = selectedCountry ? (flags as any)[selectedCountry.isoCode] : null;
                        return (
                          <div className="absolute inset-0 flex items-center pl-3 z-30 pointer-events-none text-slate-900 text-sm font-medium">
                            {FlagComponent && (
                              <FlagComponent
                                className="mr-2 rounded-sm"
                                style={{ width: '24px', height: 'auto' }}
                              />
                            )}
                            <span>{formData.phoneCountryCode}</span>
                          </div>
                        );
                      })()}
                      <select
                        value={formData.phoneCountryCode}
                        onChange={(e) => {
                          const newCountryCode = e.target.value;

                          // Check if country code changed - require confirmation
                          const countryCodeChanged = newCountryCode !== originalData.phoneCountryCode;
                          if (countryCodeChanged && originalData.phone && !phoneEditConfirmed) {
                            // Store pending country code and show confirmation modal
                            setPendingCountryCode(newCountryCode);
                            setShowPhoneConfirmModal(true);
                            return;
                          }

                          // Auto-assign country when phone code changes
                          const selectedCountry = findCountryByPhoneCode(newCountryCode, countries);
                          if (selectedCountry) {
                            // Load states for the new country
                            const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
                            setStates(countryStates);
                            setCities([]);

                            setFormData(prev => ({
                              ...prev,
                              phoneCountryCode: newCountryCode,
                              country: selectedCountry.name,
                              state: '', // Reset state and district
                              district: ''
                            }));
                          } else {
                            setFormData(prev => ({ ...prev, phoneCountryCode: newCountryCode }));
                          }

                          setHasChanges(true);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-transparent text-sm rounded-xl focus:ring-0 focus:border-emerald-500 pl-10 pr-8 py-3 transition-all outline-none font-medium appearance-none relative z-20"
                        style={{ color: 'transparent' }}
                      >
                        {countries.map((country) => {
                          // Use library format: +{phonecode}
                          const phoneCodeValue = `+${country.phonecode}`;
                          return (
                            <option key={country.isoCode} value={phoneCodeValue} className="text-slate-900">
                              {country.flag} {phoneCodeValue} ({country.isoCode})
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute top-3.5 right-2 pointer-events-none text-slate-400 z-20">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="flex-1">
                      <input
                        type="tel"
                        value={formData.phone}
                        maxLength={15}
                        onChange={(e) => {
                          // Strip non-digits like signup page does
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          updateField('phone', digitsOnly);
                        }}
                        placeholder="3001234567"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          errors.phone ? 'border-red-300' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  <p className="text-xs text-slate-500 mt-1">
                    Enter digits only (7-15 digits). Phone changes require confirmation for security.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl mt-1 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Email cannot be changed for security reasons
                </p>
              </div>
            </div>

            {/* Farm Information Section */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Sprout size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Farm Information</h3>
              </div>

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
                {errors.farmName && (
                  <p className="text-xs text-red-600 mt-1">{errors.farmName}</p>
                )}
              </div>

              {/* Country Dropdown */}
              <div>
                <label className="text-sm font-medium text-slate-700">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.country ? 'border-red-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
                <p className="text-xs text-slate-500 mt-1">
                  Country is auto-selected based on phone code. Required for state/district selection.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State Dropdown */}
                <div>
                  <label className="text-sm font-medium text-slate-700">State / Province *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    disabled={!formData.country}
                    className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${
                      errors.state ? 'border-red-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
                  {!formData.country && (
                    <p className="text-xs text-slate-500 mt-1">Select country first</p>
                  )}
                </div>

                {/* District Dropdown or Text Input */}
                <div>
                  <label className="text-sm font-medium text-slate-700">District / City *</label>
                  {cities.length > 0 ? (
                    <select
                      value={formData.district}
                      onChange={(e) => updateField('district', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.district ? 'border-red-300' : 'border-slate-200'
                      }`}
                    >
                      <option value="">Select District/City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.district}
                      maxLength={100}
                      onChange={(e) => updateField('district', e.target.value)}
                      placeholder="Enter District/City"
                      disabled={!formData.state}
                      className={`w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${
                        errors.district ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                  )}
                  {errors.district && (
                    <p className="text-xs text-red-600 mt-1">{errors.district}</p>
                  )}
                  {!formData.state && (
                    <p className="text-xs text-slate-500 mt-1">Select state first</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Land Size (acres)</label>
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
                {errors.landSize && (
                  <p className="text-xs text-red-600 mt-1">{errors.landSize}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Current Crops
                </label>
                <CropTagInput
                  crops={formData.crops}
                  onChange={(crops) => updateField('crops', crops)}
                />
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-end gap-3">
            <button
              onClick={handleClose}
              disabled={saving}
              className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
      </AnimatePresence>

      {/* Phone Number Confirmation Modal */}
      <ConfirmationModal
        isOpen={showPhoneConfirmModal}
        onClose={handlePhoneCancel}
        onConfirm={handlePhoneConfirm}
        title="Confirm Phone Number Change"
        message="Are you sure you want to change the farmer's phone number? This is a sensitive field and should only be modified if necessary."
        confirmText="Yes, Change Phone"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmationModal
        isOpen={showUnsavedChangesModal}
        onClose={handleUnsavedChangesCancel}
        onConfirm={handleUnsavedChangesConfirm}
        title="Discard Unsaved Changes?"
        message="You have unsaved changes that will be lost if you close this form. Are you sure you want to continue?"
        confirmText="Yes, Discard Changes"
        cancelText="Continue Editing"
        variant="warning"
      />
    </>
  );
};
