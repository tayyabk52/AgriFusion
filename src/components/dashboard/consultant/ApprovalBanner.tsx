'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { useConsultantApproval } from '@/contexts/ConsultantApprovalContext';

export const ApprovalBanner: React.FC = () => {
  const { isPending, approvalStatus, isLoading } = useConsultantApproval();

  // Don't show banner if loading or if status is approved/active
  if (isLoading || (!isPending && approvalStatus !== 'rejected')) {
    return null;
  }

  const isRejected = approvalStatus === 'rejected';
  const isPendingApproval = isPending;

  return (
    <AnimatePresence>
      {(isPendingApproval || isRejected) && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="mb-6"
        >
          <div
            className={`relative overflow-hidden rounded-2xl ${
              isRejected
                ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
                : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200'
            }`}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
            </div>

            <div className="relative p-5 flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                isRejected
                  ? 'bg-red-100 text-red-600'
                  : 'bg-amber-100 text-amber-600'
              }`}>
                {isRejected ? (
                  <AlertCircle size={24} strokeWidth={2.5} />
                ) : (
                  <Clock size={24} strokeWidth={2.5} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className={`font-bold text-base ${
                    isRejected ? 'text-red-900' : 'text-amber-900'
                  }`}>
                    {isRejected ? 'Account Rejected' : 'Pending Approval'}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    isRejected
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isRejected ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                    }`} />
                    {isRejected ? 'Action Required' : 'Under Review'}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${
                  isRejected ? 'text-red-800' : 'text-amber-800'
                }`}>
                  {isRejected ? (
                    <>
                      Your account application was rejected. Please contact{' '}
                      <span className="font-semibold">support@agrifusion.com</span> for more information.
                    </>
                  ) : (
                    <>
                      Your account is being reviewed by our admin team. You can view your dashboard, but{' '}
                      <span className="font-semibold">farmer management is temporarily disabled</span>.
                    </>
                  )}
                </p>
              </div>

              {/* Decorative element */}
              <div className="hidden md:block flex-shrink-0">
                <ShieldCheck className={`${
                  isRejected ? 'text-red-200' : 'text-amber-200'
                }`} size={40} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
