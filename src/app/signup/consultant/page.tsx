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
      <Button variant="ghost" size="sm" className="text-slate-500" icon={<HelpCircle size={18} />}>
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
}

const InputField = ({ label, icon: Icon, type = "text", placeholder, value, onChange, required, half, name, maxLength, min }: InputFieldProps) => {
  const isFilled = value && value.length > 0;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative group ${half ? 'col-span-1' : 'col-span-2'}`}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 group-focus-within:text-blue-600 transition-colors">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute top-3 left-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={16} />
        </div>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          maxLength={maxLength}
          min={min}
          className={`
            w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-xl
            focus:ring-0 focus:border-blue-500 block pl-10 ${type === 'password' ? 'pr-10' : 'pr-4'} py-2.5
            transition-all outline-none placeholder:text-slate-400 font-medium
            group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-blue-500/5
            ${isFilled ? 'border-slate-300 bg-white' : ''}
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
}

const SelectField = ({ label, icon: Icon, placeholder, value, onChange, required, half, name, options }: SelectFieldProps) => {
  const isFilled = value && value.length > 0;

  return (
    <div className={`relative group ${half ? 'col-span-1' : 'col-span-2'}`}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1 group-focus-within:text-blue-600 transition-colors">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute top-3 left-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10 pointer-events-none">
          <Icon size={16} />
        </div>
        <select
          name={name}
          className={`
            premium-select w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-xl
            focus:ring-0 focus:border-blue-500 block pl-10 pr-10 py-2.5
            transition-all outline-none font-medium appearance-none
            group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-blue-500/5
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
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    experience_years: '',
    country: '',
    specialization_areas: [] as string[],
    service_areas: [] as string[],
  });

  const [specializationInput, setSpecializationInput] = useState('');
  const [serviceAreaInput, setServiceAreaInput] = useState('');
  const [countries] = useState<ICountry[]>(() => Country.getAllCountries());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialization = (specialization: string) => {
    if (specialization.trim() !== '' && !formData.specialization_areas.includes(specialization.trim())) {
      setFormData({
        ...formData,
        specialization_areas: [...formData.specialization_areas, specialization.trim()]
      });
    }
    setSpecializationInput('');
  };

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specialization_areas: formData.specialization_areas.filter(s => s !== spec)
    });
  };

  const handleAddServiceArea = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && serviceAreaInput.trim() !== '') {
      e.preventDefault();
      if (!formData.service_areas.includes(serviceAreaInput.trim())) {
        setFormData({
          ...formData,
          service_areas: [...formData.service_areas, serviceAreaInput.trim()]
        });
      }
      setServiceAreaInput('');
    }
  };

  const removeServiceArea = (area: string) => {
    setFormData({
      ...formData,
      service_areas: formData.service_areas.filter(a => a !== area)
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSubmit = async () => {
    // Show loader
    setIsLoading(true);

    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In real app: Call API to create auth user + profile + consultant record
    console.log("Submitting Final Data:", formData);

    setIsLoading(false);
    nextStep(); // Move to Success (Step 5)
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
        <InputField label="Full Name" name="full_name" icon={User} placeholder="e.g. Dr. John Smith" value={formData.full_name} onChange={handleChange} required />
        <InputField label="Phone Number" name="phone" icon={Phone} type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required half maxLength={10} />
        <InputField label="Email Address" name="email" icon={Mail} type="email" placeholder="john@consultant.com" value={formData.email} onChange={handleChange} required half />
        <InputField label="Create Password" name="password" icon={Lock} type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
      </div>
    </motion.div>
  );

  const renderProfessionalStep = () => {
    const countryOptions = countries.map(c => ({ value: c.name, label: c.name }));

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="grid grid-cols-2 gap-4"
      >
        <InputField
          label="Highest Qualification"
          name="qualification"
          icon={GraduationCap}
          placeholder="e.g. MSc in Agriculture"
          value={formData.qualification}
          onChange={handleChange}
          required
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
        />
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
                onChange={(e) => {
                  // Handle file upload
                }}
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
                    Educational Certificate
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Degree/Diploma in Agriculture (PDF, JPG, PNG)</p>
                </div>
                <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </label>
            </div>

            {/* Professional License */}
            <div className="relative group">
              <input
                type="file"
                id="prof-license"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  // Handle file upload
                }}
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
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Valid agricultural consultant license (if applicable)</p>
                </div>
                <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </label>
            </div>

            {/* Experience Certificate */}
            <div className="relative group">
              <input
                type="file"
                id="exp-certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  // Handle file upload
                }}
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
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Work experience letters from employers/clients</p>
                </div>
                <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </label>
            </div>

            {/* Government ID */}
            <div className="relative group">
              <input
                type="file"
                id="govt-id"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  // Handle file upload
                }}
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
                    Government ID
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Passport, National ID, or Aadhaar Card</p>
                </div>
                <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  formData.specialization_areas.includes(spec)
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
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-blue-500 block pl-10 p-3 transition-all outline-none font-medium"
            placeholder="Or type custom specialization & press Enter"
            value={specializationInput}
            onChange={(e) => setSpecializationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSpecialization(specializationInput);
              }
            }}
          />
          <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500">
            <Search size={18} />
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Service Areas (Districts/Cities)
        </label>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {formData.service_areas.map((area, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 shadow-sm animate-scale-in">
              {area}
              <button onClick={() => removeServiceArea(area)} className="text-emerald-400 hover:text-red-500 transition-colors" type="button">
                <X size={14} />
              </button>
            </span>
          ))}
          {formData.service_areas.length === 0 && (
            <span className="text-sm text-slate-400 italic py-1.5">No service areas added yet...</span>
          )}
        </div>

        <div className="relative group">
          <input
            id="service-area-input"
            type="text"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-blue-500 block pl-10 p-3 transition-all outline-none font-medium"
            placeholder="Type district/city name & press Enter"
            value={serviceAreaInput}
            onChange={(e) => setServiceAreaInput(e.target.value)}
            onKeyDown={handleAddServiceArea}
          />
          <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500">
            <MapPin size={18} />
          </div>
          <div className="absolute right-3 top-2 px-2 py-1 bg-white rounded text-[10px] font-bold text-slate-400 uppercase tracking-wide border border-slate-200 shadow-sm">
            Enter
          </div>
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
            <ReviewField label="Country" value={formData.country} />
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Service Areas</span>
            <div className="flex flex-wrap gap-2">
              {formData.service_areas.length > 0 ? (
                formData.service_areas.map((a, i) => (
                  <span key={i} className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-md">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400 italic">None listed</span>
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
        Your consultant profile is pending admin approval.
      </p>

      <Button
        variant="premium"
        size="lg"
        onClick={() => router.push('/dashboard/consultant')}
        className="w-full max-w-xs shadow-xl shadow-blue-500/20"
        icon={<ArrowRight size={18} />}
        iconPosition="right"
      >
        Go to Dashboard
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
