'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        // Basic validation
        if (!email) {
            setError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setIsLoading(false);

        } catch (error: any) {
            console.error('Password reset error:', error);
            setError(error.message || 'An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

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
                            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                            <p className="text-emerald-50 text-sm">We'll send you a reset link</p>
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

                                {/* Instructions */}
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email Field */}
                                    <div className="relative group">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Email Address <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-emerald-500 block pl-11 pr-4 py-3.5 transition-all outline-none placeholder:text-slate-400 font-medium group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5"
                                                placeholder="your@email.com"
                                                required
                                                disabled={isLoading}
                                            />
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
                                        {isLoading ? 'Sending...' : 'Send Reset Link'}
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
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                    We've sent a password reset link to <span className="font-semibold text-slate-900">{email}</span>.
                                    Please check your inbox and follow the instructions.
                                </p>
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
                                    <p className="text-xs text-blue-700 font-semibold mb-2">Tips:</p>
                                    <ul className="space-y-1 text-xs text-blue-600 text-left">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                            Check your spam folder if you don't see the email
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                            The reset link expires in 1 hour
                                        </li>
                                    </ul>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/signin')}
                                    className="w-full"
                                >
                                    Back to Sign In
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
