'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User, Mail, Phone, MapPin, Sprout, Ruler, ArrowRight, ArrowLeft,
  CheckCircle2, Tractor, Camera, X, Search,
  FileText, Eye, EyeOff, Lock, ChevronRight, HelpCircle
} from 'lucide-react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { supabase } from '@/lib/supabaseClient';
import * as flags from 'country-flag-icons/react/3x2';

/**
 * ------------------------------------------------------------------
 * ASSETS & CONFIG
 * ------------------------------------------------------------------
 */
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop";

const STEPS = [
  { id: 1, title: "Account", subtitle: "Personal Details", icon: User },
  { id: 2, title: "Review", subtitle: "Confirm Data", icon: FileText },
];

// Temporarily disabled steps (will be configured by consultant later)
// const DISABLED_STEPS = [
//   { id: 2, title: "Farm Profile", subtitle: "Location & Size", icon: MapPin },
//   { id: 3, title: "Crops", subtitle: "Production Info", icon: Sprout },
// ];

/**
 * ------------------------------------------------------------------
 * COMPONENT: Header Navbar
 * ------------------------------------------------------------------
 */
const HeaderNavbar = ({ onBack }: { onBack: () => void }) => (
  <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 md:px-8 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-slate-500 hover:text-slate-900 -ml-2"
        icon={<ArrowLeft size={18} />}
      >
        Back
      </Button>
      <div className="h-6 w-px bg-slate-200 hidden sm:block" />
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden">
          <Image
            src="/logo.png"
            alt="AgriFusion Logo"
            width={32}
            height={32}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <span className="font-bold text-slate-800 tracking-tight hidden sm:block">
          Agri
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Fusion
          </span>
        </span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-slate-500 hidden sm:block">Need help?</span>
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-500"
        icon={<HelpCircle size={18} />}
        onClick={() => window.location.href = '/contact'}
      >
        Support
      </Button>
    </div>
  </header>
);

/**
 * ------------------------------------------------------------------
 * COMPONENT: Step Sidebar (Compact)
 * ------------------------------------------------------------------
 */
const StepSidebar = ({ currentStep }: { currentStep: number }) => (
  <div className="hidden lg:flex flex-col w-72 bg-slate-900 text-white relative overflow-hidden h-full border-r border-slate-800">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <Image
        src={BACKGROUND_IMAGE}
        alt="Farm Background"
        fill
        className="object-cover opacity-20 mix-blend-overlay"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-emerald-900/90" />
    </div>

    <div className="relative z-10 p-8 flex flex-col h-full">
      <div className="mb-10">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white/90">
          Partner with <br /> <span className="text-emerald-400">AgriFusion</span>
        </h2>
        <p className="text-xs text-slate-400 mt-2">Complete these steps to set up your digital farm profile.</p>
      </div>

      {/* Steps */}
      <div className="space-y-6 flex-1">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative flex items-center gap-4 group">
              {/* Line */}
              {idx !== STEPS.length - 1 && (
                <div className={`absolute left-[19px] top-10 w-0.5 h-6 ${isCompleted ? 'bg-emerald-500/50' : 'bg-white/5'}`} />
              )}

              <div className={`
                                relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300
                                ${isActive ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-900/50' :
                  isCompleted ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                    'border-white/10 bg-white/5 text-slate-500'}
                            `}>
                {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>

              <div className="flex flex-col">
                <span className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {step.title}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{step.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Quote */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Secure Registration
        </div>
      </div>
    </div>
  </div>
);

/**
 * ------------------------------------------------------------------
 * COMPONENT: Premium Input Field
 * ------------------------------------------------------------------
 */
interface InputFieldProps {
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  half?: boolean;
  name: string;
  maxLength?: number;
  isHighlighted?: boolean;
}

const InputField = ({ label, icon: Icon, type = "text", placeholder, value, onChange, required, half, name, maxLength, isHighlighted }: InputFieldProps) => {
  const isFilled = value && value.length > 0;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative group ${half ? 'col-span-1' : 'col-span-2'}`}>
      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 transition-colors ${isHighlighted ? 'text-red-500 animate-pulse' : 'text-slate-500 group-focus-within:text-emerald-600'
        }`}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className={`absolute top-3 left-3.5 transition-colors ${isHighlighted ? 'text-red-500' : 'text-slate-400 group-focus-within:text-emerald-500'
          }`}>
          <Icon size={16} />
        </div>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          maxLength={maxLength}
          className={`
            w-full bg-slate-50/50 border text-slate-900 text-sm rounded-xl
            focus:ring-0 block pl-10 ${type === 'password' ? 'pr-10' : 'pr-4'} py-2.5
            transition-all outline-none placeholder:text-slate-400 font-medium
            ${isHighlighted
              ? 'border-red-400 ring-2 ring-red-400/50 bg-red-50/30 animate-shake'
              : `border-slate-200 focus:border-emerald-500 group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5 ${isFilled ? 'border-slate-300 bg-white' : ''}`
            }
          `}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-3 right-3 text-slate-400 hover:text-emerald-500 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {/* Active Border Bottom Accent */}
        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * COMPONENT: Phone Input Field
 * ------------------------------------------------------------------
 */
interface PhoneInputProps {
  label: string;
  icon: React.ElementType;
  placeholder: string;
  value: string;
  countryCode: string;
  onCountryChange: (code: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  half?: boolean;
  name: string;
  isHighlighted?: boolean;
}

const PhoneInput = ({ label, icon: Icon, placeholder, value, countryCode, onCountryChange, onChange, required, half, name, isHighlighted }: PhoneInputProps) => {
  const isFilled = value && value.length > 0;
  const countries = Country.getAllCountries();
  const selectedCountry = countries.find(c => c.phonecode === countryCode.replace('+', ''));

  // Dynamically get the flag component
  const FlagComponent = selectedCountry ? (flags as any)[selectedCountry.isoCode] : null;

  return (
    <div className={`relative group ${half ? 'col-span-1' : 'col-span-2'}`}>
      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 transition-colors ${isHighlighted ? 'text-red-500 animate-pulse' : 'text-slate-500 group-focus-within:text-emerald-600'
        }`}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative flex gap-2">
        {/* Country Code Dropdown */}
        <div className="relative w-1/3 min-w-[140px]">
          <div className="absolute inset-0 flex items-center pl-3 z-10 pointer-events-none text-slate-900 text-sm font-medium">
            {FlagComponent && (
              <FlagComponent
                className="mr-2 rounded-sm"
                style={{ width: '24px', height: 'auto' }}
              />
            )}
            <span>{countryCode}</span>
          </div>
          <select
            value={countryCode}
            onChange={(e) => onCountryChange(e.target.value)}
            className={`
              w-full bg-slate-50/50 border text-transparent text-sm rounded-xl
              focus:ring-0 focus:border-emerald-500 block pl-10 pr-8 py-2.5
              transition-all outline-none font-medium appearance-none relative z-20
              ${isHighlighted ? 'border-red-400 bg-red-50/30' : 'border-slate-200'}
            `}
            style={{ color: 'transparent' }}
          >
            {countries.map((country) => (
              <option key={country.isoCode} value={`+${country.phonecode}`} className="text-slate-900">
                {country.flag} +{country.phonecode} ({country.isoCode})
              </option>
            ))}
          </select>
          <div className="absolute top-3 right-2 pointer-events-none text-slate-400 z-20">
            <ChevronRight size={14} className="rotate-90" />
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <div className={`absolute top-3 left-3.5 transition-colors ${isHighlighted ? 'text-red-500' : 'text-slate-400 group-focus-within:text-emerald-500'
            }`}>
            <Icon size={16} />
          </div>
          <input
            type="tel"
            name={name}
            maxLength={10}
            className={`
              w-full bg-slate-50/50 border text-slate-900 text-sm rounded-xl
              focus:ring-0 block pl-10 pr-4 py-2.5
              transition-all outline-none placeholder:text-slate-400 font-medium
              ${isHighlighted
                ? 'border-red-400 ring-2 ring-red-400/50 bg-red-50/30 animate-shake'
                : `border-slate-200 focus:border-emerald-500 group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5 ${isFilled ? 'border-slate-300 bg-white' : ''}`
              }
            `}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              onChange({ ...e, target: { ...e.target, name, value: val } });
            }}
            required={required}
          />
          {/* Active Border Bottom Accent */}
          <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
        </div>
      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * COMPONENT: Select Field
 * ------------------------------------------------------------------
 */
interface SelectFieldProps {
  label: string;
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  half?: boolean;
  name: string;
  options: { value: string; label: string; }[];
}

const SelectField = ({ label, icon: Icon, placeholder, value, onChange, required, half, name, options }: SelectFieldProps) => {
  const isFilled = value && value.length > 0;

  return (
    <div className={`relative group ${half ? 'col-span-1' : 'col-span-2'}`}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 group-focus-within:text-emerald-600 transition-colors">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute top-3 left-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10 pointer-events-none">
          <Icon size={16} />
        </div>
        <select
          name={name}
          className={`
            premium-select w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-xl
            focus:ring-0 focus:border-emerald-500 block pl-10 pr-10 py-2.5
            transition-all outline-none font-medium appearance-none
            group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5
            ${isFilled ? 'border-slate-300 bg-white text-slate-900' : 'text-slate-400'}
            cursor-pointer hover:border-slate-300 hover:bg-white/80
          `}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="" disabled className="text-slate-400 bg-slate-50">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-slate-900 bg-white py-3 px-4 hover:bg-emerald-50 checked:bg-emerald-100 checked:text-emerald-700 font-medium"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute top-3 right-3 pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <ChevronRight size={16} className="rotate-90 group-focus-within:rotate-[270deg] transition-transform" />
        </div>
        {/* Active Border Bottom Accent */}
        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * COMPONENT: Review Field (Read-Only)
 * ------------------------------------------------------------------
 */
const ReviewField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
    <span className="text-sm font-semibold text-slate-900 break-words">{value || "Not provided"}</span>
  </div>
);

/**
 * ------------------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------------------
 */
export default function FarmerRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    phoneCountryCode: '+92', // Default to Pakistan
    password: '',
    farm_name: '',
    country: '',
    state: '',
    district: '',
    land_size_acres: '',
    current_crops: [] as string[],
  });

  const [cropInput, setCropInput] = useState('');
  const [countries] = useState<ICountry[]>(() => Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Handle country selection for dynamic state loading
    if (name === 'country') {
      const selectedCountry = countries.find(c => c.name === value);
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(countryStates);
      } else {
        setStates([]);
      }
      setFormData(prev => ({ ...prev, country: value, state: '', district: '' })); // Reset state and district
      setCities([]);
    }

    // Handle state selection for dynamic city loading
    if (name === 'state') {
      const selectedCountry = countries.find(c => c.name === formData.country);
      const selectedState = states.find(s => s.name === value);
      if (selectedCountry && selectedState) {
        const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
        setCities(stateCities);
      } else {
        setCities([]);
      }
      setFormData(prev => ({ ...prev, state: value, district: '' })); // Reset district when state changes
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file object for upload
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCrop = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cropInput.trim() !== '') {
      e.preventDefault();
      if (!formData.current_crops.includes(cropInput.trim())) {
        setFormData({
          ...formData,
          current_crops: [...formData.current_crops, cropInput.trim()]
        });
      }
      setCropInput('');
    }
  };

  const removeCrop = (crop: string) => {
    setFormData({
      ...formData,
      current_crops: formData.current_crops.filter(c => c !== crop)
    });
  };

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());

  const validateCurrentStep = () => {
    const errors: string[] = [];
    const fieldsToHighlight = new Set<string>();

    if (currentStep === 1) {
      // Validate Account step
      if (!formData.full_name.trim()) {
        errors.push('Full name is required');
        fieldsToHighlight.add('full_name');
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        errors.push('Email address is required');
        fieldsToHighlight.add('email');
      } else if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
        fieldsToHighlight.add('email');
      }

      // Phone Validation
      if (!formData.phone.trim()) {
        errors.push('Phone number is required');
        fieldsToHighlight.add('phone');
      } else if (formData.phone.length !== 10) {
        errors.push('Phone number must be exactly 10 digits');
        fieldsToHighlight.add('phone');
      }

      // Password Validation
      if (!formData.password.trim()) {
        errors.push('Password is required');
        fieldsToHighlight.add('password');
      } else if (formData.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
        fieldsToHighlight.add('password');
      }
    }

    if (fieldsToHighlight.size > 0) {
      setHighlightedFields(fieldsToHighlight);
      setTimeout(() => setHighlightedFields(new Set()), 2000);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }
    setValidationErrors([]);
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSubmit = async () => {
    setIsLoading(true);
    setValidationErrors([]);

    try {
      // Step 1: Create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: 'farmer',
            phone: `${formData.phoneCountryCode}${formData.phone}`,
          }
        }
      });

      if (authError) {
        console.error('Auth Error:', authError);
        setValidationErrors([authError.message]);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setValidationErrors(['Failed to create user account. Please try again.']);
        setIsLoading(false);
        return;
      }

      console.log('User registered successfully:', authData.user.id);

      // Wait for database trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify profile was created
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', authData.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile check error:', profileError);
      }

      if (!profileCheck) {
        // Profile wasn't created - show helpful error
        setValidationErrors([
          'Registration incomplete. Please contact support with this information:',
          `User ID: ${authData.user.id}`,
          'Error: Database trigger may not be configured. See EMERGENCY_FIX.sql'
        ]);
        setIsLoading(false);
        return;
      }

      // STEP 2: Upload avatar if provided
      if (avatarFile) {
        console.log('Uploading avatar to server...');
        const uploadFormData = new FormData();
        uploadFormData.append('profile_id', profileCheck.id);
        uploadFormData.append('user_id', authData.user.id);
        uploadFormData.append('avatar', avatarFile);

        const uploadResponse = await fetch('/api/farmer/upload-avatar', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.error('Avatar upload error:', uploadResult);
          setValidationErrors([
            uploadResult.error || 'Failed to upload avatar. Please try again.'
          ]);
          setIsLoading(false);
          return;
        }

        console.log('✓ Avatar uploaded successfully');
      }

      // Profile exists - proceed to success
      setIsLoading(false);
      nextStep();

    } catch (error: any) {
      console.error('Registration Error:', error);
      const errorMessage = error.message || 'An unexpected error occurred during registration';

      if (errorMessage.includes('JWT') || errorMessage.includes('sub claim')) {
        setValidationErrors([
          'Registration failed: Database not properly configured.',
          'Please ask administrator to run EMERGENCY_FIX.sql in Supabase.',
          'Technical details: Profile creation trigger not working.'
        ]);
      } else {
        setValidationErrors([errorMessage]);
      }

      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    router.push('/signup');
  };

  // ---------------- STEP CONTENT RENDERERS ---------------- //

  const renderAccountStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="relative group cursor-pointer shrink-0">
          <div className={`
            w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md
            ${avatarPreview ? 'bg-white' : 'bg-slate-200 flex items-center justify-center'}
          `}>
            {avatarPreview ? (
              <Image src={avatarPreview} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-slate-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-emerald-500 transition-colors shadow-lg border-2 border-white">
            <Camera size={12} />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
          <p className="text-xs text-slate-500 mt-1">Upload a clear photo to help buyers recognize you.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Full Name" name="full_name" icon={User} placeholder="e.g. John Doe" value={formData.full_name} onChange={handleChange} required isHighlighted={highlightedFields.has('full_name')} />
        <PhoneInput
          label="Phone Number"
          name="phone"
          icon={Phone}
          placeholder="312 1234567"
          value={formData.phone}
          countryCode={formData.phoneCountryCode}
          onCountryChange={(code) => setFormData(prev => ({ ...prev, phoneCountryCode: code }))}
          onChange={handleChange}
          required
          half
          isHighlighted={highlightedFields.has('phone')}
        />
        <InputField label="Email Address" name="email" icon={Mail} type="email" placeholder="john@farm.com" value={formData.email} onChange={handleChange} required half isHighlighted={highlightedFields.has('email')} />
        <InputField label="Create Password" name="password" icon={Lock} type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required isHighlighted={highlightedFields.has('password')} />
      </div>
    </motion.div>
  );

  const renderFarmStep = () => {
    const countryOptions = countries.map(c => ({ value: c.name, label: c.name }));
    const stateOptions = states.map(s => ({ value: s.name, label: s.name }));
    const cityOptions = cities.map(c => ({ value: c.name, label: c.name }));

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="grid grid-cols-2 gap-4"
      >
        <InputField label="Farm Name" name="farm_name" icon={Tractor} placeholder="e.g. Green Valley Acres" value={formData.farm_name} onChange={handleChange} required />
        <SelectField
          label="Country"
          name="country"
          icon={MapPin}
          placeholder="Select Country"
          value={formData.country}
          onChange={handleChange}
          required
          half
          options={countryOptions}
        />
        <SelectField
          label="State / Province"
          name="state"
          icon={MapPin}
          placeholder="Select State"
          value={formData.state}
          onChange={handleChange}
          required
          half
          options={stateOptions}
        />
        {cities.length > 0 ? (
          <SelectField
            label="District / City"
            name="district"
            icon={MapPin}
            placeholder="Select District/City"
            value={formData.district}
            onChange={handleChange}
            required
            half
            options={cityOptions}
          />
        ) : (
          <InputField label="District / City" name="district" icon={MapPin} placeholder="Enter District/City" value={formData.district} onChange={handleChange} required half />
        )}
        <InputField label="Land Size (Acres)" name="land_size_acres" icon={Ruler} type="number" placeholder="e.g. 50.5" value={formData.land_size_acres} onChange={handleChange} required half />
      </motion.div>
    );
  };

  const renderCropStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Current Crops
        </label>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {formData.current_crops.map((crop, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 shadow-sm animate-scale-in">
              {crop}
              <button onClick={() => removeCrop(crop)} className="text-emerald-400 hover:text-red-500 transition-colors" type="button">
                <X size={14} />
              </button>
            </span>
          ))}
          {formData.current_crops.length === 0 && (
            <span className="text-sm text-slate-400 italic py-1.5">No crops added yet...</span>
          )}
        </div>

        <div className="relative group">
          <input
            id="crop-input"
            type="text"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-emerald-500 block pl-10 p-3 transition-all outline-none font-medium"
            placeholder="Type crop name & press Enter"
            value={cropInput}
            onChange={(e) => setCropInput(e.target.value)}
            onKeyDown={handleAddCrop}
          />
          <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-emerald-500">
            <Search size={18} />
          </div>
          <div className="absolute right-3 top-2 px-2 py-1 bg-white rounded text-[10px] font-bold text-slate-400 uppercase tracking-wide border border-slate-200 shadow-sm">
            Enter
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 h-fit">
          <Sprout size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-1">AI Optimization</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            AgriFusion uses your location and current crop data to suggest the most profitable intercropping patterns. Ensure this data is accurate.
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderReviewStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      {/* Profile Summary */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <User size={14} className="text-emerald-500" /> Account
          </h4>
          <button onClick={() => goToStep(1)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded transition-colors" type="button">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ReviewField label="Full Name" value={formData.full_name} />
          <ReviewField label="Email" value={formData.email} />
          <ReviewField label="Phone" value={formData.phone} />
        </div>
      </div>

      {/* Farm Details */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Tractor size={14} className="text-emerald-500" /> Farm Profile
          </h4>
          <button onClick={() => goToStep(2)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded transition-colors" type="button">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ReviewField label="Farm Name" value={formData.farm_name} />
          <ReviewField label="Land Size" value={formData.land_size_acres ? `${formData.land_size_acres} Acres` : ''} />
          <div className="col-span-2">
            <ReviewField label="Location" value={formData.district && formData.state && formData.country ? `${formData.district}, ${formData.state}, ${formData.country}` : ''} />
          </div>
        </div>
      </div>

      {/* Production */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Sprout size={14} className="text-emerald-500" /> Crops
          </h4>
          <button onClick={() => goToStep(3)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded transition-colors" type="button">
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.current_crops.length > 0 ? (
            formData.current_crops.map((c, i) => (
              <span key={i} className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-md">
                {c}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400 italic">None listed</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center h-full py-8"
    >
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle2 size={40} className="text-emerald-600" />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-2">Registration Complete!</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-8 leading-relaxed">
        Welcome to AgriFusion, <span className="font-bold text-slate-900">{formData.full_name}</span>.
        Your farm profile has been created successfully.
      </p>

      <Button
        variant="premium"
        size="lg"
        onClick={() => router.push('/signin')}
        className="w-full max-w-xs shadow-xl shadow-emerald-500/20"
        icon={<ArrowRight size={18} />}
        iconPosition="right"
      >
        Go to Login
      </Button>
    </motion.div>
  );

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <HeaderNavbar onBack={handleBackToSignup} />

        <main className="pt-16 h-screen flex overflow-hidden">
          {/* Fixed Sidebar for Desktop */}
          <StepSidebar currentStep={currentStep > 2 ? 2 : currentStep} />

          {/* Scrollable Content Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
              <div className="max-w-2xl mx-auto w-full">
                {/* Mobile Step Indicator */}
                {currentStep < 3 && (
                  <div className="lg:hidden mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{STEPS[currentStep - 1].title}</h2>
                      <p className="text-xs text-slate-500">{STEPS[currentStep - 1].subtitle}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
                      {currentStep}/2
                    </div>
                  </div>
                )}

                {/* Desktop Header */}
                {currentStep < 3 && (
                  <div className="hidden lg:block mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">{STEPS[currentStep - 1].title}</h1>
                    <p className="text-sm text-slate-500 mt-1">Please provide your details below.</p>
                  </div>
                )}

                {/* Validation Errors */}
                <AnimatePresence>
                  {validationErrors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-red-900 mb-1">Please complete the following:</h3>
                          <ul className="space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && renderAccountStep()}
                  {currentStep === 2 && renderReviewStep()}
                  {currentStep === 3 && renderSuccess()}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Actions */}
            {currentStep < 3 && (
              <div className="p-4 sm:p-6 border-t border-slate-200 bg-white/80 backdrop-blur-sm z-10">
                <div className="max-w-2xl mx-auto w-full flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}
                  >
                    Back
                  </Button>

                  <Button
                    variant="emerald"
                    rounded="full"
                    onClick={currentStep === 2 ? handleSubmit : nextStep}
                    className="px-8"
                    icon={<ArrowRight size={18} />}
                    iconPosition="right"
                  >
                    {currentStep === 2 ? 'Submit Application' : 'Continue'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
