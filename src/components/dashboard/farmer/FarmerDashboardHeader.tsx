'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, LogOut, Settings, BadgeCheck, Bell, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useProfile } from '@/contexts/ProfileContext';

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'query': return '💬';
        case 'farmer': return '👤';
        case 'consultant': return '👨‍🌾';
        case 'relationship': return '🤝';
        case 'farm': return '🌾';
        case 'security': return '🔒';
        case 'status': return '✅';
        case 'system': return '⚙️';
        default: return '🔔';
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'query': return 'from-blue-50 to-blue-100 border-blue-200';
        case 'farmer': return 'from-emerald-50 to-emerald-100 border-emerald-200';
        case 'consultant': return 'from-purple-50 to-purple-100 border-purple-200';
        case 'relationship': return 'from-violet-50 to-violet-100 border-violet-200';
        case 'farm': return 'from-green-50 to-green-100 border-green-200';
        case 'security': return 'from-red-50 to-red-100 border-red-200';
        case 'status': return 'from-teal-50 to-teal-100 border-teal-200';
        case 'system': return 'from-slate-50 to-slate-100 border-slate-200';
        default: return 'from-purple-50 to-purple-100 border-purple-200';
    }
};

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const FarmerDashboardHeader = () => {
    const router = useRouter();
    const { profile, notifications, isLoading, refreshNotifications } = useProfile();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [expandedNotificationId, setExpandedNotificationId] = useState<string | null>(null);
    const [markingRead, setMarkingRead] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const unreadCount = useMemo(
        () => notifications.filter(n => !n.is_read).length,
        [notifications]
    );

    // Get latest 2 notifications
    const latestNotifications = useMemo(
        () => notifications.slice(0, 2),
        [notifications]
    );

    const isVerified = !isLoading && profile?.is_verified;

    // Use default values while loading
    const displayProfile = profile || {
        id: '',
        full_name: 'Loading...',
        email: '',
        avatar_url: null,
    };

    // Click outside to close notifications
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
                setExpandedNotificationId(null);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationsOpen]);

    // Mark all notifications as read
    const handleMarkAllRead = async () => {
        if (!profile || markingRead || unreadCount === 0) return;

        setMarkingRead(true);
        try {
            const unreadIds = notifications
                .filter(n => !n.is_read)
                .map(n => n.id);

            const { error } = await supabase
                .from('notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .in('id', unreadIds);

            if (!error) {
                await refreshNotifications();
            }
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        } finally {
            setMarkingRead(false);
        }
    };

    // Mark single notification as read
    const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
        // Toggle expand
        setExpandedNotificationId(prev => prev === notificationId ? null : notificationId);

        // Mark as read if not already
        if (!isRead) {
            try {
                await supabase
                    .from('notifications')
                    .update({
                        is_read: true,
                        read_at: new Date().toISOString()
                    })
                    .eq('id', notificationId);

                await refreshNotifications();
            } catch (err) {
                console.error('Error marking notification as read:', err);
            }
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 mb-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                {/* Left: Welcome Message */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Welcome back, {displayProfile.full_name.split(' ')[0]}
                        <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
                    </h1>
                    <p className="text-sm text-slate-500 hidden sm:block font-medium">
                        Here's what's happening on your farm today.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <motion.button
                            onClick={() => {
                                setIsNotificationsOpen(!isNotificationsOpen);
                                if (!isNotificationsOpen) setExpandedNotificationId(null);
                            }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                            aria-expanded={isNotificationsOpen}
                            className={`relative p-2.5 rounded-xl transition-all border shadow-sm ${isNotificationsOpen
                                ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                : 'text-slate-500 hover:text-emerald-600 bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-200'
                                }`}
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

                        {/* Notification Dropdown */}
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50"
                                    style={{ maxHeight: '80vh' }}
                                >
                                    {/* Header */}
                                    <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 px-5 py-4 z-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                                                <p className="text-xs text-slate-600 mt-0.5">
                                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                                </p>
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    disabled={markingRead}
                                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
                                                >
                                                    <CheckCheck size={14} />
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notification List */}
                                    <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                                        {latestNotifications.length === 0 ? (
                                            <div className="px-5 py-12 text-center">
                                                <div className="text-5xl mb-3">🔔</div>
                                                <p className="text-sm font-semibold text-slate-900 mb-1">All caught up!</p>
                                                <p className="text-xs text-slate-500">No new notifications</p>
                                            </div>
                                        ) : (
                                            <div className="p-3 space-y-2">
                                                {latestNotifications.map((notification) => (
                                                    <motion.div
                                                        key={notification.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`rounded-xl border p-3 cursor-pointer transition-all ${!notification.is_read
                                                            ? `bg-gradient-to-br ${getNotificationColor(notification.type || 'system')} shadow-sm`
                                                            : 'bg-white border-slate-200 hover:bg-slate-50'
                                                            }`}
                                                        onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="text-2xl shrink-0">
                                                                {getNotificationIcon(notification.type || 'system')}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                                                        {notification.title}
                                                                    </h4>
                                                                    {!notification.is_read && (
                                                                        <span className="shrink-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                                                                    )}
                                                                </div>
                                                                <p className={`text-xs text-slate-600 leading-relaxed ${expandedNotificationId === notification.id ? '' : 'line-clamp-2'
                                                                    }`}>
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                                                    {formatRelativeTime(notification.created_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* View All */}
                                        {latestNotifications.length > 0 && (
                                            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-3 border-t border-slate-100">
                                                <button
                                                    onClick={() => router.push('/dashboard/farmer/notifications')}
                                                    className="w-full text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors"
                                                >
                                                    View all notifications
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

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
                            className={`flex items-center gap-3 pl-1 pr-2 py-1 rounded-full transition-all border ${isProfileMenuOpen
                                ? 'bg-white border-slate-200 shadow-sm ring-1 ring-slate-900/5'
                                : 'hover:bg-slate-50/80 border-transparent hover:border-slate-200/60'
                                }`}
                        >
                            <div className="text-right hidden md:block mr-1">
                                <div className="flex items-center justify-end gap-1.5">
                                    <p className="text-sm font-semibold text-slate-800 leading-tight tracking-tight">{displayProfile.full_name}</p>
                                    {isVerified && <BadgeCheck size={16} className="text-emerald-500" fill="currentColor" stroke="white" />}
                                </div>
                            </div>
                            <div className="relative">
                                {displayProfile.avatar_url ? (
                                    <img
                                        src={displayProfile.avatar_url}
                                        alt="Profile"
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                                    />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
                                        {displayProfile.full_name.charAt(0).toUpperCase()}
                                    </div>
                                )}
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
                                        <p className="text-sm font-bold text-slate-900 truncate">{displayProfile.full_name}</p>
                                        <p className="text-xs text-slate-500 truncate">{displayProfile.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => router.push('/dashboard/farmer/settings')}
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
                                            onClick={async () => {
                                                await supabase.auth.signOut();
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
