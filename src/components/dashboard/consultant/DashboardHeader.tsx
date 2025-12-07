'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, Settings, BadgeCheck, Bell, Clock, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/lib/supabaseClient';

// Helper to format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

// Notification type icon/color mapping
const getNotificationStyle = (type: string) => {
    switch (type) {
        case 'query':
            return { bg: 'bg-blue-100', text: 'text-blue-600', icon: '💬' };
        case 'farmer':
            return { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: '👤' };
        case 'waste':
            return { bg: 'bg-amber-100', text: 'text-amber-600', icon: '♻️' };
        case 'system':
            return { bg: 'bg-slate-100', text: 'text-slate-600', icon: '⚙️' };
        default:
            return { bg: 'bg-purple-100', text: 'text-purple-600', icon: '🔔' };
    }
};

export const DashboardHeader = () => {
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

    const isVerified = !isLoading && profile !== null;

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
        <header
            className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300 -mr-4 sm:-mr-6 md:-mr-8 pr-4 sm:pr-6 md:pr-8 pl-4 sm:pl-6 md:pl-8"
            style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
            }}
        >
            <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">

                {/* Left: Welcome Message */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-transparent sm:text-slate-900 flex items-center gap-2">
                        Welcome back, {displayProfile.full_name.split(' ')[0]}
                        <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
                    </h1>
                    <p className="text-sm text-slate-500 hidden sm:block font-medium">
                        Here&apos;s what&apos;s happening with your farmers today.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 pr-5">
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
                            className={`relative p-2.5 rounded-xl transition-all border shadow-sm will-change-transform ${isNotificationsOpen
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

                        {/* Notification Dropdown - Responsive positioning */}
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="fixed inset-x-4 xs:inset-x-6 sm:inset-x-auto sm:absolute sm:right-0 top-[76px] sm:top-auto sm:mt-2 w-[calc(100%-2rem)] xs:w-[calc(100%-3rem)] sm:w-80 md:w-96 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 ring-1 ring-slate-900/5 max-h-[calc(100vh-100px)] sm:max-h-[70vh] flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-4 w-4 text-slate-500" />
                                            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                                                    {unreadCount} new
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    disabled={markingRead}
                                                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                                                >
                                                    {markingRead ? 'Marking...' : 'Mark all read'}
                                                </button>
                                            )}
                                            {/* Close button for mobile */}
                                            <button
                                                onClick={() => setIsNotificationsOpen(false)}
                                                className="sm:hidden p-1 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <X size={16} className="text-slate-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notifications List */}
                                    <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
                                        {latestNotifications.length === 0 ? (
                                            <div className="py-10 text-center">
                                                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <CheckCircle2 className="h-7 w-7 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-600">All caught up!</p>
                                                <p className="text-xs text-slate-400 mt-1">No new notifications</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100">
                                                {latestNotifications.map((notification, index) => {
                                                    const style = getNotificationStyle(notification.type);
                                                    const isExpanded = expandedNotificationId === notification.id;

                                                    return (
                                                        <motion.div
                                                            key={notification.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                                                            className={`p-4 transition-colors cursor-pointer active:bg-slate-100 ${!notification.is_read ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <div className="flex gap-3">
                                                                {/* Icon */}
                                                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center text-lg`}>
                                                                    {style.icon}
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <p className={`text-sm font-semibold ${!notification.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                                            {notification.title}
                                                                        </p>
                                                                        {!notification.is_read && (
                                                                            <span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                                                                        )}
                                                                    </div>

                                                                    {/* Message - expandable */}
                                                                    <AnimatePresence mode="wait">
                                                                        <motion.p
                                                                            key={isExpanded ? 'expanded' : 'collapsed'}
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}
                                                                            transition={{ duration: 0.15 }}
                                                                            className={`text-xs text-slate-500 mt-0.5 ${isExpanded ? '' : 'line-clamp-2'
                                                                                }`}
                                                                        >
                                                                            {notification.message}
                                                                        </motion.p>
                                                                    </AnimatePresence>

                                                                    {/* Footer: Time + expand hint */}
                                                                    <div className="flex items-center justify-between mt-2">
                                                                        <div className="flex items-center gap-1">
                                                                            <Clock className="h-3 w-3 text-slate-400" />
                                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                                                {formatRelativeTime(notification.created_at)}
                                                                            </span>
                                                                        </div>
                                                                        {notification.message && notification.message.length > 80 && (
                                                                            <span className="text-[10px] text-emerald-600 font-medium">
                                                                                {isExpanded ? 'Show less' : 'Read more'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    {latestNotifications.length > 0 && (
                                        <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    setIsNotificationsOpen(false);
                                                    // Navigate to notifications page if exists
                                                }}
                                                className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"
                                            >
                                                View all notifications
                                            </button>
                                        </div>
                                    )}
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
                        <button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            aria-label="Profile menu"
                            aria-expanded={isProfileMenuOpen}
                            className="flex items-center gap-3 pl-1 pr-2 py-1 p-2 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] will-change-transform"
                        >
                            <div className="text-right hidden md:block mr-1">
                                <div className="flex items-center justify-end gap-1.5">
                                    <p className="text-sm font-semibold text-slate-800 leading-tight tracking-tight">{displayProfile.full_name}</p>
                                    {isVerified && <BadgeCheck size={16} className="text-emerald-500" fill="currentColor" stroke="white" />}
                                </div>
                                <p className="text-xs text-emerald-600 font-medium">Verified Consultant</p>
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
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                            <div className={`hidden sm:block opacity-50 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                                <ChevronDown size={14} />
                            </div>
                        </button>

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
                                            onClick={() => router.push('/dashboard/consultant/settings')}
                                            aria-label="Go to settings"
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
                                            aria-label="Logout from account"
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
