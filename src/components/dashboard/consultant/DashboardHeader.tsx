'use client';

import React, { useState } from 'react';
import { Search, Bell, SlidersHorizontal, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <header className="bg-transparent mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
                            placeholder="Search farmers, farms, waste, queries..."
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-emerald-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-all"
                            >
                                <SlidersHorizontal size={18} />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-3 text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50 rounded-xl transition-all border border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-md"
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
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="flex items-center gap-3 pl-4 pr-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-emerald-200 transition-all shadow-sm hover:shadow-md"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">{profile.full_name}</p>
                                <p className="text-xs text-emerald-600 font-semibold">
                                    Verified Consultant
                                </p>
                            </div>
                            <div className="relative">
                                <img
                                    src={profile.avatar_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full object-cover border-2 border-emerald-100 shadow-sm"
                                />
                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                            <motion.div
                                animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={16} className="text-slate-400" />
                            </motion.div>
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isProfileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl shadow-slate-900/10 overflow-hidden z-50"
                                >
                                    <div className="p-3 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                                        <p className="text-sm font-bold text-slate-900">{profile.full_name}</p>
                                        <p className="text-xs text-slate-600">{profile.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-all group">
                                            <User size={18} className="text-slate-400 group-hover:text-emerald-600" />
                                            <span className="group-hover:text-slate-900 font-medium">My Profile</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-all group">
                                            <Settings size={18} className="text-slate-400 group-hover:text-emerald-600" />
                                            <span className="group-hover:text-slate-900 font-medium">Settings</span>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-slate-100">
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all group">
                                            <LogOut size={18} className="text-red-500" />
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
