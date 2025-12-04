'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ConsultantApprovalContextType {
  isApproved: boolean;
  isPending: boolean;
  isLoading: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'suspended' | 'active' | null;
}

const ConsultantApprovalContext = createContext<ConsultantApprovalContextType>({
  isApproved: false,
  isPending: false,
  isLoading: true,
  approvalStatus: null,
});

export const useConsultantApproval = () => useContext(ConsultantApprovalContext);

export const ConsultantApprovalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | 'suspended' | 'active' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApprovalStatus();
  }, []);

  const fetchApprovalStatus = async () => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsLoading(false);
        return;
      }

      // Fetch profile status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status, role')
        .eq('auth_user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile status:', profileError);
        setIsLoading(false);
        return;
      }

      // Only set approval status if user is a consultant
      if (profile?.role === 'consultant') {
        setApprovalStatus(profile.status as any);
      }
    } catch (error) {
      console.error('Error in fetchApprovalStatus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isApproved = approvalStatus === 'active' || approvalStatus === 'approved';
  const isPending = approvalStatus === 'pending';

  return (
    <ConsultantApprovalContext.Provider
      value={{
        isApproved,
        isPending,
        isLoading,
        approvalStatus,
      }}
    >
      {children}
    </ConsultantApprovalContext.Provider>
  );
};
