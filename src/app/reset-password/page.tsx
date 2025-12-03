'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true);

    useEffect(() => {
        // Check if we have a valid session (from email link)
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    setError('Invalid or expired reset link. Please request a new one.');
                    setValidToken(false);
                } else {
                    setValidToken(true);
                }
            } catch (err) {
                console.error('Session check error:', err);
                setError('Failed to verify reset link.');
                setValidToken(false);
            } finally {
                setCheckingToken(false);
            }
        };

        checkSession();
    }, []);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate passwords
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                setError(updateError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setIsLoading(false);

            // Redirect to signin after 3 seconds
            setTimeout(() => {
                router.push('/signin');
            }, 3000);

        } catch (error: any) {
            console.error('Password reset error:', error);
            setError(error.message || 'An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    // Show loading state while checking token
    if (checkingToken) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    // Show error if token is invalid
    if (!validToken) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-red-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Invalid Reset Link</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {error || 'This password reset link is invalid or has expired.'}
                    </p>
                    <Button
                        variant="emerald"
                        onClick={() => router.push('/forgot-password')}
                        className="w-full"
                    >
                        Request New Reset Link
                    </Button>
                    <div className="mt-4">
                        <Link
                            href="/signin"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Sign In
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={BACKGROUND_IMAGE}
                    alt="Agriculture Background"
                    fill
                    className="object-cover opacity-10"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="AgriFusion Logo"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-contain"
                                    priority
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                            <p className="text-emerald-50 text-sm">Create a new secure password</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {!success ? (
                            <>
                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                                        >
                                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-red-900 mb-1">Error</p>
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Password Requirements */}
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-xs font-bold text-blue-900 mb-2">Password Requirements:</p>
                                    <ul className="space-y-1 text-xs text-blue-700">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                            At least 8 characters long
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                            One uppercase letter (A-Z)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                            One lowercase letter (a-z)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                            One number (0-9)
                                        </li>
                                    </ul>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* New Password Field */}
                                    <div className="relative group">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            New Password <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-emerald-500 block pl-11 pr-12 py-3.5 transition-all outline-none placeholder:text-slate-400 font-medium group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5"
                                                placeholder="Enter new password"
                                                required
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="relative group">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Confirm Password <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-emerald-500 block pl-11 pr-12 py-3.5 transition-all outline-none placeholder:text-slate-400 font-medium group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5"
                                                placeholder="Confirm new password"
                                                required
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="emerald"
                                        size="lg"
                                        className="w-full shadow-xl shadow-emerald-500/20"
                                        icon={isLoading ? <Loader2 className="animate-spin" size={20} /> : undefined}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            /* Success State */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Password Reset Successful!</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                    Your password has been successfully updated. You can now sign in with your new password.
                                </p>
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
                                    <p className="text-xs text-blue-700">
                                        Redirecting you to sign in page in 3 seconds...
                                    </p>
                                </div>
                                <Button
                                    variant="emerald"
                                    onClick={() => router.push('/signin')}
                                    className="w-full"
                                >
                                    Sign In Now
                                </Button>
                            </motion.div>
                        )}

                        {/* Back to Sign In Link */}
                        {!success && (
                            <div className="mt-6 text-center">
                                <Link
                                    href="/signin"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Blob Animation Styles */}
            <style jsx global>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -20px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(20px, 20px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 10s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
