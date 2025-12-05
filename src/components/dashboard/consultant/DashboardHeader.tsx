'use client';

import React, { useState } from 'react';
import { ChevronDown, LogOut, Settings, BadgeCheck, Bell, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
}

interface Notification {
    id: string;
    is_read: boolean;
}

interface DashboardHeaderProps {
    profile?: Profile;
    notifications?: Notification[];
}

const defaultProfile: Profile = {
    id: '',
    full_name: 'Loading...',
    email: '',
};

export const DashboardHeader = ({ profile = defaultProfile, notifications = [] }: DashboardHeaderProps) => {
    const router = useRouter();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.is_read).length;
    const isVerified = profile.full_name !== 'Loading...';

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300 -mr-4 sm:-mr-6 md:-mr-8 pr-4 sm:pr-6 md:pr-8 pl-4 sm:pl-6 md:pl-8">
            <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">

                {/* Left: Welcome Message */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-transparent sm:text-slate-900 flex items-center gap-2">
                        Welcome back, {profile.full_name.split(' ')[0]}
                        <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
                    </h1>
                    <p className="text-sm text-slate-500 hidden sm:block font-medium">
                        Here&apos;s what&apos;s happening with your farmers today.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 pr-5">
                    {/* Notifications */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2.5 text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50 rounded-xl transition-all border border-slate-200 hover:border-emerald-200 shadow-sm"
                    >
                        <Bell className="h-5 w-5" strokeWidth={2} />
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-[10px] font-bold rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white ring-2 ring-white shadow-lg"
                            >
                                {unreadCount}
                            </motion.span>
                        )}
                    </motion.button>

                    {/* Profile Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsProfileMenuOpen(true)}
                        onMouseLeave={() => setIsProfileMenuOpen(false)}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className={`flex items-center gap-3 pl-1 pr-2 py-1 rounded-full transition-all ${isProfileMenuOpen
                                ? 'p-2'
                                : 'p-2'
                                }`}
                        >
                            <div className="text-right hidden md:block mr-1">
                                <div className="flex items-center justify-end gap-1.5">
                                    <p className="text-sm font-semibold text-slate-800 leading-tight tracking-tight">{profile.full_name}</p>
                                    {isVerified && <BadgeCheck size={16} className="text-emerald-500" fill="currentColor" stroke="white" />}
                                </div>
                                <p className="text-xs text-emerald-600 font-medium">Verified Consultant</p>
                            </div>
                            <div className="relative">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="Profile"
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                                    />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
                                        {profile.full_name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                            <motion.div
                                animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="hidden sm:block opacity-50"
                            >
                                <ChevronDown size={14} />
                            </motion.div>
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-1 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 ring-1 ring-slate-900/5"
                                >
                                    <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                                        <p className="text-sm font-bold text-slate-900 truncate">{profile.full_name}</p>
                                        <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => router.push('/dashboard/consultant/settings')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group"
                                        >
                                            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                                <Settings size={16} />
                                            </div>
                                            <span className="font-medium">Settings</span>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-slate-100">
                                        <button
                                            onClick={() => {
                                                router.push('/signin');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                                        >
                                            <div className="p-1.5 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
                                                <LogOut size={16} />
                                            </div>
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};
