'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save, User as UserIcon, Sprout } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { FarmerWithProfile } from '@/types/farmer';
import { validatePhone } from '@/lib/validationUtils';
import { CropTagInput } from './CropTagInput';
import { ConfirmationModal } from './ConfirmationModal';

interface EditFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  farmer: FarmerWithProfile;
}

interface EditFormData {
  fullName: string;
  phone: string;
  email: string;
  farmName: string;
  state: string;
  district: string;
  landSize: string;
  crops: string[];
}

interface OriginalData {
  phone: string;
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
    email: '',
    farmName: '',
    state: '',
    district: '',
    landSize: '',
    crops: [],
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<OriginalData>({ phone: '' });
  const [phoneEditConfirmed, setPhoneEditConfirmed] = useState(false);
  const [showPhoneConfirmModal, setShowPhoneConfirmModal] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingPhoneValue, setPendingPhoneValue] = useState('');

  useEffect(() => {
    if (isOpen && farmer) {
      const profile = farmer.profiles;
      const phoneValue = profile?.phone || '';
      setFormData({
        fullName: profile?.full_name || '',
        phone: phoneValue,
        email: profile?.email || '',
        farmName: farmer.farm_name || '',
        state: farmer.state || '',
        district: farmer.district || '',
        landSize: farmer.land_size_acres?.toString() || '',
        crops: farmer.current_crops || [],
      });
      setOriginalData({ phone: phoneValue });
      setHasChanges(false);
      setErrors({});
      setPhoneEditConfirmed(false);
    }
  }, [isOpen, farmer]);

  const updateField = (field: keyof EditFormData, value: any) => {
    // Special handling for phone number changes
    if (field === 'phone' && value !== originalData.phone && !phoneEditConfirmed) {
      setPendingPhoneValue(value);
      setShowPhoneConfirmModal(true);
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
    setFormData((prev) => ({ ...prev, phone: pendingPhoneValue }));
    setHasChanges(true);
    setShowPhoneConfirmModal(false);
    setPendingPhoneValue('');
  };

  const handlePhoneCancel = () => {
    setShowPhoneConfirmModal(false);
    setPendingPhoneValue('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    if (formData.landSize && (isNaN(Number(formData.landSize)) || Number(formData.landSize) <= 0)) {
      newErrors.landSize = 'Please enter a valid land size';
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
            phone: formData.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id),

        // Update farmers
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
                  <p className="text-xs text-slate-500 mt-1">
                    Phone number changes require confirmation for security
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {errors.district && (
                    <p className="text-xs text-red-600 mt-1">{errors.district}</p>
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
