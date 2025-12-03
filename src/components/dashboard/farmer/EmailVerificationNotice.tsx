'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface EmailVerificationNoticeProps {
    email: string;
}

export function EmailVerificationNotice({ email }: EmailVerificationNoticeProps) {
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState('');

    const handleResendVerification = async () => {
        setIsResending(true);
        setResendError('');
        setResendSuccess(false);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });

            if (error) {
                setResendError(error.message);
            } else {
                setResendSuccess(true);
                setTimeout(() => setResendSuccess(false), 5000);
            }
        } catch (error: any) {
            setResendError(error.message || 'Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Mail className="text-amber-600" size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">Email Verification Required</h3>
                            <AlertCircle className="text-amber-500" size={18} />
                        </div>

                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                            We've sent a verification link to <span className="font-semibold text-slate-900">{email}</span>.
                            Please check your inbox and click the verification link to access all dashboard features.
                        </p>

                        {/* Resend Button */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleResendVerification}
                                disabled={isResending || resendSuccess}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw size={16} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : resendSuccess ? (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Email Sent!
                                    </>
                                ) : (
                                    <>
                                        <Mail size={16} />
                                        Resend Verification Email
                                    </>
                                )}
                            </button>

                            {resendError && (
                                <p className="text-sm text-red-600 font-medium">{resendError}</p>
                            )}
                        </div>

                        {/* Tips */}
                        <div className="mt-4 pt-4 border-t border-amber-200">
                            <p className="text-xs text-slate-500 mb-2 font-semibold">Tips:</p>
                            <ul className="space-y-1 text-xs text-slate-600">
                                <li className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                                    Check your spam/junk folder if you don't see the email
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                                    The verification link is valid for 24 hours
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                                    Refresh this page after verifying your email
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
