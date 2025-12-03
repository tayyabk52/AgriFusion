'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { AuthHeader } from '@/components/layout/AuthHeader';

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop";

export default function SignInPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            // Sign in with Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return;
            }

            if (!authData.user) {
                setError('Failed to sign in. Please try again.');
                setIsLoading(false);
                return;
            }

            // Fetch user profile to get role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role, status')
                .eq('auth_user_id', authData.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                setError('Unable to load user profile. Please try again.');
                setIsLoading(false);
                return;
            }

            // Check account status
            if (profile.status === 'suspended') {
                setError('Your account has been suspended. Please contact support.');
                await supabase.auth.signOut();
                setIsLoading(false);
                return;
            }

            if (profile.status === 'rejected') {
                setError('Your account application was rejected. Please contact support.');
                await supabase.auth.signOut();
                setIsLoading(false);
                return;
            }

            // Success message
            setSuccess('Sign in successful! Redirecting...');

            // Role-based redirection
            setTimeout(() => {
                switch (profile.role) {
                    case 'farmer':
                        router.push('/dashboard/farmer');
                        break;
                    case 'consultant':
                        router.push('/dashboard/consultant');
                        break;
                    case 'admin':
                        router.push('/dashboard/admin');
                        break;
                    default:
                        router.push('/dashboard');
                }
            }, 1000);

        } catch (error: any) {
            console.error('Sign in error:', error);
            setError(error.message || 'An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
            <AuthHeader onBack={() => router.push('/')} backLabel="Home" />

            <main className="flex-1 flex h-[calc(100vh-64px)] mt-16">
                {/* Left Side - Image & Branding */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
                    <Image
                        src={BACKGROUND_IMAGE}
                        alt="Agriculture Background"
                        fill
                        className="object-cover opacity-60 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-emerald-900/80" />

                    <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
                        <div className="mt-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-4xl font-bold leading-tight mb-4">
                                    Welcome back to <br />
                                    <span className="text-emerald-400">AgriFusion</span>
                                </h2>
                                <p className="text-slate-300 text-lg max-w-md">
                                    Access your dashboard to manage crops, connect with experts, and optimize your farming potential.
                                </p>
                            </motion.div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">
                                            <User size={16} className="text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="font-bold">Join 5,000+ Farmers</p>
                                    <p className="text-xs text-slate-400">Trust AgriFusion for their daily operations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
                    {/* Mobile Background (Subtle) */}
                    <div className="absolute inset-0 lg:hidden bg-slate-50 -z-10" />

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
                            <p className="text-slate-500">Enter your credentials to access your account.</p>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 overflow-hidden"
                                >
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-red-900">Sign In Failed</p>
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 overflow-hidden"
                                >
                                    <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-emerald-900">{success}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-1.5 group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-emerald-600 transition-colors">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-emerald-500 block pl-11 pr-4 py-3.5 transition-all outline-none placeholder:text-slate-400 font-medium group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5"
                                        placeholder="name@example.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5 group">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-emerald-600 transition-colors">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-0 focus:border-emerald-500 block pl-11 pr-12 py-3.5 transition-all outline-none placeholder:text-slate-400 font-medium group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/5"
                                        placeholder="Enter your password"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-3.5 right-3.5 text-slate-400 hover:text-emerald-500 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="emerald"
                                size="lg"
                                className="w-full shadow-xl shadow-emerald-500/20 py-6 text-base"
                                icon={isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                                iconPosition="right"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
