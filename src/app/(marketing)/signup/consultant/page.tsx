'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User, Mail, Phone, MapPin, Briefcase, ArrowRight, ArrowLeft,
  CheckCircle2, GraduationCap, Camera, X, Search,
  FileText, Eye, EyeOff, Lock, ChevronRight, HelpCircle, Award, Upload, ShieldCheck
} from 'lucide-react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { supabase } from '@/lib/supabaseClient';
import { uploadConsultantDocuments, validateFile } from '@/lib/storageUtils';
import { validateEmail, validatePhone, validatePassword, validateSpecialization, validateFullName, validateQualification } from '@/lib/validationUtils';
import * as flags from 'country-flag-icons/react/3x2';

/**
 * ------------------------------------------------------------------
 * ASSETS & CONFIG
 * ------------------------------------------------------------------
 */
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop";

const STEPS = [
  { id: 1, title: "Account", subtitle: "Personal Details", icon: User },
  { id: 2, title: "Professional", subtitle: "Qualifications", icon: GraduationCap },
  { id: 3, title: "Expertise", subtitle: "Specializations", icon: Award },
  { id: 4, title: "Review", subtitle: "Confirm Data", icon: FileText },
];

const SPECIALIZATION_OPTIONS = [
  "Crop Management",
  "Soil Health",
  "Irrigation Systems",
  "Pest Control",
  "Organic Farming",
  "Precision Agriculture",
  "Farm Equipment",
  "Post-Harvest Management",
  "Sustainable Farming",
  "Agro-Forestry"
];

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
        alt="Consultant Background"
        fill
        className="object-cover opacity-20 mix-blend-overlay"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-blue-900/90" />
    </div>

    <div className="relative z-10 p-8 flex flex-col h-full">
      <div className="mb-10">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white/90">
          Join as <br /> <span className="text-blue-400">Expert Consultant</span>
        </h2>
        <p className="text-xs text-slate-400 mt-2">Share your expertise and help farmers succeed.</p>
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
                <div className={`absolute left-[19px] top-10 w-0.5 h-6 ${isCompleted ? 'bg-blue-500/50' : 'bg-white/5'}`} />
              )}

              <div className={`
                                relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300
                                ${isActive ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-900/50' :
                  isCompleted ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                    'border-white/10 bg-white/5 text-slate-500'}
                            `}>
                {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>

              <div className="flex flex-col">
                <span className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-blue-400' : 'text-slate-500'}`}>
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
        <div className="flex items-center gap-2 text-blue-400/80 text-[10px] font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
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
  min?: number;
  isHighlighted?: boolean;
}

const InputField = ({ label, icon: Icon, type = "text", placeholder, value, onChange, required, half, name, maxLength, min, isHighlighted }: InputFieldProps) => {
  const isFilled = value && value.length > 0;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative group ${half ? 'col-span-1' : 'col-span-2'}`}>
      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 transition-colors ${isHighlighted ? 'text-red-500 animate-pulse' : 'text-slate-500 group-focus-within:text-blue-600'}`}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className={`absolute top-3 left-3.5 transition-colors ${isHighlighted ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`}>
          <Icon size={16} />
        </div>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          maxLength={maxLength}
          min={min}
          className={`
            w-full bg-slate-50/50 border text-slate-900 text-sm rounded-xl
            focus:ring-0 block pl-10 ${type === 'password' ? 'pr-10' : 'pr-4'} py-2.5
            transition-all outline-none placeholder:text-slate-400 font-medium
            ${isHighlighted
              ? 'border-red-400 ring-2 ring-red-400/50 bg-red-50/30 animate-shake'
              : `border-slate-200 focus:border-blue-500 group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-blue-500/5 ${isFilled ? 'border-slate-300 bg-white' : ''}`
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
            className="absolute top-3 right-3 text-slate-400 hover:text-blue-500 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {/* Active Border Bottom Accent */}
        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
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
  isHighlighted?: boolean;
  disabled?: boolean;
}

const SelectField = ({ label, icon: Icon, placeholder, value, onChange, required, half, name, options, isHighlighted, disabled }: SelectFieldProps) => {
  const isFilled = value && value.length > 0;

  return (
    <div className={`relative group ${half ? 'col-span-1' : 'col-span-2'}`}>
      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 transition-colors ${isHighlighted ? 'text-red-500 animate-pulse' : 'text-slate-500 group-focus-within:text-blue-600'}`}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className={`absolute top-3 left-3.5 transition-colors z-10 pointer-events-none ${isHighlighted ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'}`}>
          <Icon size={16} />
        </div>
        <select
          name={name}
          className={`
            premium-select w-full bg-slate-50/50 border text-slate-900 text-sm rounded-xl
            focus:ring-0 block pl-10 pr-10 py-2.5
            transition-all outline-none font-medium appearance-none
            ${isHighlighted
              ? 'border-red-400 ring-2 ring-red-400/50 bg-red-50/30 animate-shake'
              : `border-slate-200 focus:border-blue-500 group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-blue-500/5 ${isFilled ? 'border-slate-300 bg-white text-slate-900' : 'text-slate-400'}`
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer hover:border-slate-300 hover:bg-white/80'}
          `}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        >
          <option value="" disabled className="text-slate-400 bg-slate-50">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-slate-900 bg-white py-3 px-4 hover:bg-blue-50 checked:bg-blue-100 checked:text-blue-700 font-medium"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute top-3 right-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <ChevronRight size={16} className="rotate-90 group-focus-within:rotate-[270deg] transition-transform" />
        </div>
        {/* Active Border Bottom Accent */}
        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
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
      <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 transition-colors ${isHighlighted ? 'text-red-500 animate-pulse' : 'text-slate-500 group-focus-within:text-blue-600'
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
              focus:ring-0 focus:border-blue-500 block pl-10 pr-8 py-2.5
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
          <div className={`absolute top-3 left-3.5 transition-colors ${isHighlighted ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'
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
                : `border-slate-200 focus:border-blue-500 group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-blue-500/5 ${isFilled ? 'border-slate-300 bg-white' : ''}`
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
          <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
        </div>
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
export default function ConsultantRegistration() {
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
    confirmPassword: '',
    qualification: '',
    experience_years: '',
    country: '',
    state: '',
    district: '',
    service_country: '',
    service_state: '',
    service_district: '',
    specialization_areas: [] as string[],
  });

  const [documents, setDocuments] = useState<{
    educational: File | null;
    professional: File | null;
    experience: File | null;
    government: File | null;
  }>({
    educational: null,
    professional: null,
    experience: null,
    government: null,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [specializationInput, setSpecializationInput] = useState('');
  const [specializationError, setSpecializationError] = useState<string>('');
  const [countries] = useState<ICountry[]>(() => Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [serviceStates, setServiceStates] = useState<IState[]>([]);
  const [serviceCities, setServiceCities] = useState<ICity[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setValidationErrors(['Please upload a JPG, PNG, or GIF image for your profile photo']);
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setValidationErrors(['Profile photo must be smaller than 2MB']);
      return;
    }

    // Store the file and create preview
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));

    // Clear any previous validation errors
    setValidationErrors([]);
  };

  const handleAddSpecialization = (specialization: string) => {
    const trimmed = specialization.trim();

    // Clear previous error
    setSpecializationError('');

    // Check if empty
    if (!trimmed) {
      setSpecializationInput('');
      return;
    }

    // Validate specialization format
    const validation = validateSpecialization(trimmed);
    if (!validation.valid) {
      setSpecializationError(validation.error || 'Invalid specialization');
      return;
    }

    // Check for duplicates
    if (formData.specialization_areas.includes(trimmed)) {
      setSpecializationError('This specialization has already been added');
      return;
    }

    // Add to list
    setFormData({
      ...formData,
      specialization_areas: [...formData.specialization_areas, trimmed]
    });
    setSpecializationInput('');
    setSpecializationError('');
  };

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specialization_areas: formData.specialization_areas.filter(s => s !== spec)
    });
  };

  // Handle personal location changes
  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      setCities([]);
      setFormData(prev => ({ ...prev, country: countryName, state: '', district: '' }));
    }
  };

  const handleStateChange = (stateName: string) => {
    const selectedCountry = countries.find(c => c.name === formData.country);
    const selectedState = states.find(s => s.name === stateName);
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
      setCities(stateCities);
      setFormData(prev => ({ ...prev, state: stateName, district: '' }));
    }
  };

  // Handle service location changes
  const handleServiceCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setServiceStates(countryStates);
      setServiceCities([]);
      setFormData(prev => ({ ...prev, service_country: countryName, service_state: '', service_district: '' }));
    }
  };

  const handleServiceStateChange = (stateName: string) => {
    const selectedCountry = countries.find(c => c.name === formData.service_country);
    const selectedState = serviceStates.find(s => s.name === stateName);
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
      setServiceCities(stateCities);
      setFormData(prev => ({ ...prev, service_state: stateName, service_district: '' }));
    }
  };

  const handleDocumentChange = (docType: 'educational' | 'professional' | 'experience' | 'government', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setValidationErrors([validation.error || 'Invalid file']);
        return;
      }
      setDocuments(prev => ({ ...prev, [docType]: file }));
      // Clear validation errors when a valid file is selected
      setValidationErrors([]);
    }
  };

  const removeDocument = (docType: 'educational' | 'professional' | 'experience' | 'government') => {
    setDocuments(prev => ({ ...prev, [docType]: null }));
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      return null;
    }
  };

  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());

  const validateCurrentStep = () => {
    const errors: string[] = [];
    const fieldsToHighlight = new Set<string>();

    if (currentStep === 1) {
      // Full Name Validation
      const nameValidation = validateFullName(formData.full_name);
      if (!nameValidation.valid) {
        errors.push(nameValidation.error || 'Invalid full name');
        fieldsToHighlight.add('full_name');
      }

      // Email Validation
      if (!formData.email.trim()) {
        errors.push('Email address is required');
        fieldsToHighlight.add('email');
      } else if (!validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
        fieldsToHighlight.add('email');
      }

      // Phone Validation
      if (!formData.phone.trim()) {
        errors.push('Phone number is required');
        fieldsToHighlight.add('phone');
      } else if (!validatePhone(formData.phone)) {
        errors.push('Phone number must be exactly 10 digits');
        fieldsToHighlight.add('phone');
      }

      // Password Validation
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
        fieldsToHighlight.add('password');
      }

      // Confirm Password Validation
      if (!formData.confirmPassword.trim()) {
        errors.push('Please confirm your password');
        fieldsToHighlight.add('confirmPassword');
      } else if (formData.password !== formData.confirmPassword) {
        errors.push('Passwords do not match');
        fieldsToHighlight.add('password');
        fieldsToHighlight.add('confirmPassword');
      }
    } else if (currentStep === 2) {
      // Qualification Validation
      const qualificationValidation = validateQualification(formData.qualification);
      if (!qualificationValidation.valid) {
        errors.push(qualificationValidation.error || 'Invalid qualification');
        fieldsToHighlight.add('qualification');
      }

      // Experience Years Validation
      if (!formData.experience_years.trim()) {
        errors.push('Years of experience is required');
        fieldsToHighlight.add('experience_years');
      } else {
        const experienceYears = parseInt(formData.experience_years);
        if (isNaN(experienceYears) || experienceYears < 0) {
          errors.push('Years of experience must be 0 or greater');
          fieldsToHighlight.add('experience_years');
        }
      }

      // Personal Location Validation
      if (!formData.country.trim()) {
        errors.push('Country is required');
        fieldsToHighlight.add('country');
      } else {
        // Only validate state if country is selected
        if (!formData.state.trim()) {
          errors.push('State/Province is required');
          fieldsToHighlight.add('state');
        } else {
          // Only validate district if state is selected
          if (!formData.district.trim()) {
            errors.push('District/City is required');
            fieldsToHighlight.add('district');
          }
        }
      }

      // Document validation - Educational and Government are required
      if (!documents.educational) {
        errors.push('Educational certificate is required');
      }
      if (!documents.government) {
        errors.push('Government ID is required');
      }
    } else if (currentStep === 3) {
      // Validate Expertise step
      if (formData.specialization_areas.length === 0) {
        errors.push('Please add at least one specialization area');
        fieldsToHighlight.add('specialization_areas');
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
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSubmit = async () => {
    setIsLoading(true);
    setValidationErrors([]);

    try {
      // PRE-CHECK: Verify email is not already in use
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingProfile) {
        setValidationErrors([
          'This email is already registered.',
          'Please sign in instead, or use a different email address.'
        ]);
        setIsLoading(false);
        return;
      }

      // STEP 1: Create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: 'consultant',
            phone: `${formData.phoneCountryCode}${formData.phone}`,
            qualification: formData.qualification,
            experience_years: parseInt(formData.experience_years),
            specialization_areas: formData.specialization_areas,
          }
        }
      });

      if (authError) {
        console.error('Auth Error:', authError);
        // Provide friendlier error messages
        if (authError.message.includes('already registered')) {
          setValidationErrors(['This email is already registered. Please sign in or use a different email.']);
        } else {
          setValidationErrors([authError.message]);
        }
        return;
      }

      if (!authData.user) {
        setValidationErrors(['Failed to create user account. Please try again.']);
        return;
      }

      console.log('User registered successfully:', authData.user.id);

      // STEP 2: Wait for database trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 2000));

      // STEP 3: Verify profile was created
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', authData.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile check error:', profileError);
      }

      if (!profileCheck) {
        setValidationErrors([
          'Registration incomplete. Please contact support with this information:',
          `User ID: ${authData.user.id}`,
          'Error: Database trigger may not be configured.'
        ]);
        return;
      }

      // STEP 4: Upload files to server (bypasses RLS)
      console.log('Uploading files to server...');
      const uploadFormData = new FormData();
      uploadFormData.append('profile_id', profileCheck.id);
      uploadFormData.append('user_id', authData.user.id);

      // Add avatar if exists
      if (avatarFile) {
        uploadFormData.append('avatar', avatarFile);
      }

      // Add documents
      if (documents.educational) uploadFormData.append('educational', documents.educational);
      if (documents.professional) uploadFormData.append('professional', documents.professional);
      if (documents.experience) uploadFormData.append('experience', documents.experience);
      if (documents.government) uploadFormData.append('government', documents.government);

      const uploadResponse = await fetch('/api/consultant/upload-files', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        console.error('File upload error:', uploadResult);
        setValidationErrors([
          uploadResult.error || 'Failed to upload files. Please try again.'
        ]);
        return;
      }

      const avatarUrl = uploadResult.data.avatar_url;
      const uploadedUrls = uploadResult.data.document_urls;

      console.log('✓ Files uploaded successfully');

      // STEP 5: Complete registration via API route
      // This uses supabaseAdmin to bypass RLS policies
      // Note: We use authData.user.id as a basic identifier since no session with email confirmation
      const registrationResponse = await fetch('/api/consultant/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send user ID for server-side validation
          'X-User-ID': authData.user.id,
        },
        body: JSON.stringify({
          avatar_url: avatarUrl,
          country: formData.country || null,
          state: formData.state || null,
          district: formData.district || null,
          service_country: formData.service_country || null,
          service_state: formData.service_state || null,
          service_district: formData.service_district || null,
          document_urls: uploadedUrls,
        }),
      });

      const registrationResult = await registrationResponse.json();

      if (!registrationResponse.ok) {
        console.error('Registration completion error:', registrationResult);
        setValidationErrors([
          registrationResult.error || 'Failed to complete registration. Please contact support.'
        ]);
        return;
      }

      // Success - move to success screen
      nextStep();

    } catch (error: any) {
      console.error('Registration Error:', error);
      const errorMessage = error.message || 'An unexpected error occurred during registration';
      setValidationErrors([errorMessage]);
    } finally {
      // Always stop loading, whether success or failure
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
          <label className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-blue-500 transition-colors shadow-lg border-2 border-white">
            <Camera size={12} />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
          <p className="text-xs text-slate-500 mt-1">Upload a professional photo to build trust with farmers.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Full Name" name="full_name" icon={User} placeholder="e.g. Dr. John Smith" value={formData.full_name} onChange={handleChange} required isHighlighted={highlightedFields.has('full_name')} />
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
        <InputField label="Email Address" name="email" icon={Mail} type="email" placeholder="john@consultant.com" value={formData.email} onChange={handleChange} required half isHighlighted={highlightedFields.has('email')} />
        <InputField label="Create Password" name="password" icon={Lock} type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required half isHighlighted={highlightedFields.has('password')} />
        <InputField label="Confirm Password" name="confirmPassword" icon={Lock} type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required half isHighlighted={highlightedFields.has('confirmPassword')} />
      </div>
    </motion.div>
  );

  const renderProfessionalStep = () => {
    const countryOptions = countries.map(c => ({ value: c.name, label: c.name }));
    const stateOptions = states.map(s => ({ value: s.name, label: s.name }));
    const cityOptions = cities.map(c => ({ value: c.name, label: c.name }));

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Highest Qualification"
            name="qualification"
            icon={GraduationCap}
            placeholder="e.g. MSc in Agriculture"
            value={formData.qualification}
            onChange={handleChange}
            required
            isHighlighted={highlightedFields.has('qualification')}
          />
          <InputField
            label="Years of Experience"
            name="experience_years"
            icon={Award}
            type="number"
            placeholder="e.g. 10"
            value={formData.experience_years}
            onChange={handleChange}
            required
            half
            min={0}
            isHighlighted={highlightedFields.has('experience_years')}
          />
        </div>

        {/* Personal Location Section */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
            Personal Location
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Country"
              name="country"
              icon={MapPin}
              placeholder="Select Country"
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              required
              half
              options={countryOptions}
              isHighlighted={highlightedFields.has('country')}
            />
            <SelectField
              label="State/Province"
              name="state"
              icon={MapPin}
              placeholder="Select State"
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              required
              half
              options={stateOptions}
              disabled={!formData.country}
              isHighlighted={highlightedFields.has('state')}
            />
            <SelectField
              label="District/City"
              name="district"
              icon={MapPin}
              placeholder="Select District"
              value={formData.district}
              onChange={handleChange}
              required
              half
              options={cityOptions}
              disabled={!formData.state}
              isHighlighted={highlightedFields.has('district')}
            />
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Supporting Documents
          </label>

          <div className="space-y-3">
            {/* Educational Certificate */}
            <div className="relative group">
              <input
                type="file"
                id="edu-certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleDocumentChange('educational', e)}
              />
              <label
                htmlFor="edu-certificate"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group-hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <GraduationCap size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    Educational Certificate *
                    {documents.educational && (
                      <span className="ml-2 text-xs text-emerald-600">✓ Uploaded</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {documents.educational ? documents.educational.name : 'Degree/Diploma in Agriculture (PDF, JPG, PNG)'}
                  </p>
                </div>
                {documents.educational ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeDocument('educational');
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                )}
              </label>
            </div>

            {/* Professional License */}
            <div className="relative group">
              <input
                type="file"
                id="prof-license"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleDocumentChange('professional', e)}
              />
              <label
                htmlFor="prof-license"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group-hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    Professional License
                    {documents.professional && (
                      <span className="ml-2 text-xs text-emerald-600">✓ Uploaded</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {documents.professional ? documents.professional.name : 'Valid agricultural consultant license (if applicable)'}
                  </p>
                </div>
                {documents.professional ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeDocument('professional');
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                )}
              </label>
            </div>

            {/* Experience Certificate */}
            <div className="relative group">
              <input
                type="file"
                id="exp-certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleDocumentChange('experience', e)}
              />
              <label
                htmlFor="exp-certificate"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group-hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Award size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    Experience Certificate
                    {documents.experience && (
                      <span className="ml-2 text-xs text-emerald-600">✓ Uploaded</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {documents.experience ? documents.experience.name : 'Work experience letters from employers/clients'}
                  </p>
                </div>
                {documents.experience ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeDocument('experience');
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                )}
              </label>
            </div>

            {/* Government ID */}
            <div className="relative group">
              <input
                type="file"
                id="govt-id"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleDocumentChange('government', e)}
              />
              <label
                htmlFor="govt-id"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group-hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    Government ID *
                    {documents.government && (
                      <span className="ml-2 text-xs text-emerald-600">✓ Uploaded</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {documents.government ? documents.government.name : 'Passport, National ID'}
                  </p>
                </div>
                {documents.government ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeDocument('government');
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                )}
              </label>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-blue-600">Note:</span> All documents will be verified by our admin team. Maximum file size: 5MB per document.
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderExpertiseStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Specialization Areas */}
      <div className={`bg-white rounded-xl p-5 shadow-sm transition-all ${highlightedFields.has('specialization_areas')
        ? 'border-2 border-red-400 ring-2 ring-red-400/50 bg-red-50/30 animate-shake'
        : 'border border-slate-200'
        }`}>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-3 transition-colors ${highlightedFields.has('specialization_areas') ? 'text-red-500 animate-pulse' : 'text-slate-500'
          }`}>
          Specialization Areas *
        </label>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {formData.specialization_areas.map((spec, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 shadow-sm animate-scale-in">
              {spec}
              <button onClick={() => removeSpecialization(spec)} className="text-blue-400 hover:text-red-500 transition-colors" type="button">
                <X size={14} />
              </button>
            </span>
          ))}
          {formData.specialization_areas.length === 0 && (
            <span className="text-sm text-slate-400 italic py-1.5">No specializations added yet...</span>
          )}
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2 font-medium">Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATION_OPTIONS.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => handleAddSpecialization(spec)}
                disabled={formData.specialization_areas.includes(spec)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${formData.specialization_areas.includes(spec)
                  ? 'bg-blue-50 text-blue-400 border-blue-200 cursor-not-allowed opacity-50'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <input
            id="specialization-input"
            type="text"
            className={`w-full bg-slate-50 border text-slate-900 text-sm rounded-xl focus:ring-0 block pl-10 p-3 transition-all outline-none font-medium ${
              specializationError
                ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                : 'border-slate-200 focus:border-blue-500'
            }`}
            placeholder="Or type custom specialization & press Enter"
            value={specializationInput}
            onChange={(e) => {
              setSpecializationInput(e.target.value);
              setSpecializationError(''); // Clear error when typing
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSpecialization(specializationInput);
              }
            }}
          />
          <div className={`absolute left-3 top-3 transition-colors ${
            specializationError ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-500'
          }`}>
            <Search size={18} />
          </div>
          {specializationError && (
            <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium">
              {specializationError}
            </p>
          )}
        </div>
      </div>

      {/* Service Location Section */}
      <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Service Location
        </h3>
        <p className="text-xs text-slate-500 mb-4">Where do you provide your consultation services?</p>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Service Country"
            name="service_country"
            icon={MapPin}
            placeholder="Select Service Country"
            value={formData.service_country}
            onChange={(e) => handleServiceCountryChange(e.target.value)}
            half
            options={countries.map(c => ({ value: c.name, label: c.name }))}
          />
          <SelectField
            label="Service State/Province"
            name="service_state"
            icon={MapPin}
            placeholder="Select Service State"
            value={formData.service_state}
            onChange={(e) => handleServiceStateChange(e.target.value)}
            half
            options={serviceStates.map(s => ({ value: s.name, label: s.name }))}
            disabled={!formData.service_country}
          />
          <SelectField
            label="Service District/City"
            name="service_district"
            icon={MapPin}
            placeholder="Select Service District"
            value={formData.service_district}
            onChange={handleChange}
            half
            options={serviceCities.map(c => ({ value: c.name, label: c.name }))}
            disabled={!formData.service_state}
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 h-fit">
          <Briefcase size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-1">Expert Matching</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            AgriFusion uses your specializations and service areas to connect you with farmers who need your expertise.
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
            <User size={14} className="text-blue-500" /> Account
          </h4>
          <button onClick={() => goToStep(1)} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded transition-colors" type="button">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ReviewField label="Full Name" value={formData.full_name} />
          <ReviewField label="Email" value={formData.email} />
          <ReviewField label="Phone" value={formData.phone} />
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap size={14} className="text-blue-500" /> Professional
          </h4>
          <button onClick={() => goToStep(2)} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded transition-colors" type="button">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ReviewField label="Qualification" value={formData.qualification} />
          <ReviewField label="Experience" value={formData.experience_years ? `${formData.experience_years} Years` : ''} />
          <div className="col-span-2">
            <ReviewField
              label="Personal Location"
              value={[formData.district, formData.state, formData.country].filter(Boolean).join(', ')}
            />
          </div>
        </div>
      </div>

      {/* Expertise */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Award size={14} className="text-blue-500" /> Expertise
          </h4>
          <button onClick={() => goToStep(3)} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded transition-colors" type="button">
            Edit
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Specializations</span>
            <div className="flex flex-wrap gap-2">
              {formData.specialization_areas.length > 0 ? (
                formData.specialization_areas.map((s, i) => (
                  <span key={i} className="inline-block px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-md">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400 italic">None listed</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Service Location</span>
            <div className="flex items-center gap-2">
              {[formData.service_district, formData.service_state, formData.service_country].filter(Boolean).length > 0 ? (
                <span className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-md">
                  {[formData.service_district, formData.service_state, formData.service_country].filter(Boolean).join(', ')}
                </span>
              ) : (
                <span className="text-sm text-slate-400 italic">Not provided</span>
              )}
            </div>
          </div>
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
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle2 size={40} className="text-blue-600" />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-2">Registration Complete!</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-8 leading-relaxed">
        Welcome to AgriFusion, <span className="font-bold text-slate-900">{formData.full_name}</span>.
        Your consultant application has been submitted for admin review. You'll be notified once approved.
      </p>

      <Button
        variant="premium"
        size="lg"
        onClick={() => router.push('/signin')}
        className="w-full max-w-xs shadow-xl shadow-blue-500/20"
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
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <HeaderNavbar onBack={handleBackToSignup} />

        <main className="pt-16 h-screen flex overflow-hidden">
          {/* Fixed Sidebar for Desktop */}
          <StepSidebar currentStep={currentStep > 4 ? 4 : currentStep} />

          {/* Scrollable Content Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
              <div className="max-w-2xl mx-auto w-full">
                {/* Mobile Step Indicator */}
                {currentStep < 5 && (
                  <div className="lg:hidden mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{STEPS[currentStep - 1].title}</h2>
                      <p className="text-xs text-slate-500">{STEPS[currentStep - 1].subtitle}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                      {currentStep}/4
                    </div>
                  </div>
                )}

                {/* Desktop Header */}
                {currentStep < 5 && (
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
                  {currentStep === 2 && renderProfessionalStep()}
                  {currentStep === 3 && renderExpertiseStep()}
                  {currentStep === 4 && renderReviewStep()}
                  {currentStep === 5 && renderSuccess()}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Actions */}
            {currentStep < 5 && (
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
                    variant="premium"
                    rounded="full"
                    onClick={currentStep === 4 ? handleSubmit : nextStep}
                    className="px-8"
                    icon={<ArrowRight size={18} />}
                    iconPosition="right"
                  >
                    {currentStep === 4 ? 'Submit Application' : 'Continue'}
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
