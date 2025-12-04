'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/consultant/DashboardLayout';
import { OnboardingPageHeader } from '@/components/dashboard/consultant/OnboardingPageHeader';
import { OnboardingTabs } from '@/components/dashboard/consultant/OnboardingTabs';
import { CreateFarmerForm } from '@/components/dashboard/consultant/CreateFarmerForm';
import { useConsultantApproval } from '@/contexts/ConsultantApprovalContext';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateFarmerPage() {
  const router = useRouter();
  const { isApproved } = useConsultantApproval();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const checkAuthAndFetchProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/signin');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (profileError || !profileData) {
        setLoading(false);
        return;
      }

      if (profileData.role !== 'consultant') {
        router.push('/dashboard/farmer');
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setMessage({ type: 'success', text: 'Farmer account created successfully!' });
  };

  if (loading) {
    return (
      <DashboardLayout profile={null} notifications={[]}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout profile={profile} notifications={[]}>
      <OnboardingPageHeader />
      <OnboardingTabs />

      {!isApproved && (
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-lg max-w-md text-center">
              <Hourglass className="text-amber-600 w-12 h-12 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Approval Required</h3>
              <p className="text-sm text-slate-600">
                This feature will be available once your consultant account is approved.
              </p>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {profile && (
          <CreateFarmerForm
            consultantId={profile.id}
            onSuccess={handleSuccess}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              message.type === 'success'
                ? 'bg-white border-emerald-100'
                : 'bg-white border-red-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <p className="text-sm font-medium">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
