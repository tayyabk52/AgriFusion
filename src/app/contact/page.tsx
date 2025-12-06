'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

// Validation functions
const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.length > 255) return 'Name must be less than 255 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return null;
};

const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    if (email.length > 255) return 'Email must be less than 255 characters';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
};

const validateMessage = (message: string): string | null => {
    if (!message.trim()) return 'Message is required';
    if (message.trim().length < 10) return 'Message must be at least 10 characters';
    if (message.length > 5000) return 'Message must be less than 5000 characters';
    return null;
};

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        // Validate all fields
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const messageError = validateMessage(formData.message);

        // Set validation errors
        setValidationErrors({
            name: nameError || '',
            email: emailError || '',
            message: messageError || ''
        });

        // If any validation errors, don't submit
        if (nameError || emailError || messageError) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Call our API route which will extract IP and user agent server-side
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    message: formData.message.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit contact form');
            }

            // Success
            setIsSubmitted(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
                setValidationErrors({ name: '', email: '', message: '' });
            }, 3000);

        } catch (error: any) {
            console.error('Contact form submission error:', error);
            setSubmitError(
                error.message || 'Failed to submit your message. Please try again later.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error for this field when user starts typing
        if (validationErrors[name as keyof typeof validationErrors]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear submit error when user makes changes
        if (submitError) {
            setSubmitError(null);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as any
            }
        }
    };

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section with Animations */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 pb-32 px-6 overflow-hidden bg-white">
                {/* Floating Decorative Elements */}
                <motion.div
                    animate={floatingAnimation}
                    className="absolute top-32 right-[10%] w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl pointer-events-none"
                />
                <motion.div
                    animate={{
                        ...floatingAnimation,
                        transition: { ...floatingAnimation.transition, delay: 1 }
                    }}
                    className="absolute bottom-32 left-[10%] w-80 h-80 bg-gradient-to-tr from-slate-100/50 to-slate-200/50 rounded-full blur-3xl pointer-events-none"
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl w-full relative z-10"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-6 shadow-lg shadow-emerald-200">
                            <Mail className="w-10 h-10 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Touch</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                            Have a question or want to learn more about AgriFusion? We&apos;d love to hear from you.
                        </p>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-10 relative overflow-hidden"
                    >
                        {/* Success Overlay */}
                        {isSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-3xl"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                <p className="text-slate-600">We&apos;ll get back to you soon.</p>
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            {/* Name Input */}
                            <motion.div variants={itemVariants} className="relative">
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${validationErrors.name
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                                        } focus:ring-4 outline-none transition-all duration-300 text-slate-900 placeholder-slate-400`}
                                    placeholder="John Doe"
                                />
                                {validationErrors.name && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle size={14} />
                                        {validationErrors.name}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Email Input */}
                            <motion.div variants={itemVariants} className="relative">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${validationErrors.email
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                                        } focus:ring-4 outline-none transition-all duration-300 text-slate-900 placeholder-slate-400`}
                                    placeholder="john@example.com"
                                />
                                {validationErrors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle size={14} />
                                        {validationErrors.email}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Message Textarea */}
                            <motion.div variants={itemVariants} className="relative">
                                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${validationErrors.message
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                                        } focus:ring-4 outline-none transition-all duration-300 text-slate-900 placeholder-slate-400 resize-none`}
                                    placeholder="Tell us how we can help you..."
                                />
                                {validationErrors.message && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                    >
                                        <AlertCircle size={14} />
                                        {validationErrors.message}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Submit Error Banner */}
                            {submitError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
                                >
                                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-semibold text-red-900 mb-1">Submission Failed</p>
                                        <p className="text-sm text-red-700">{submitError}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <motion.div variants={itemVariants}>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </div>

                        {/* Decorative Corner Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-bl-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-100/20 to-transparent rounded-tr-full pointer-events-none" />
                    </motion.form>

                    {/* Additional Info */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-slate-500">
                            We typically respond within 24 hours
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
