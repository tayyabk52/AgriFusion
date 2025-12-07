'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    CheckCheck,
    Filter,
    Trash2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Search,
    X
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useProfile } from '@/contexts/ProfileContext';
import { Notification } from '@/types/notifications';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 50;

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export function NotificationList() {
    const { profile } = useProfile();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
    const [expandedNotificationId, setExpandedNotificationId] = useState<string | null>(null);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (profile) {
            fetchNotifications();
        }
    }, [profile, currentPage, filterCategory, filterStatus]);

    const fetchNotifications = async () => {
        if (!profile) return;

        setLoading(true);
        try {
            let query = supabase
                .from('notifications')
                .select('*', { count: 'exact' })
                .eq('recipient_id', profile.id)
                .order('created_at', { ascending: false });

            // Apply filters
            if (filterCategory !== 'all') {
                query = query.eq('category', filterCategory);
            }

            if (filterStatus === 'unread') {
                query = query.eq('is_read', false);
            } else if (filterStatus === 'read') {
                query = query.eq('is_read', true);
            }

            // Apply pagination
            const start = (currentPage - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE - 1;
            query = query.range(start, end);

            const { data, error, count } = await query;

            if (error) throw error;

            setNotifications(data || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        if (!profile) return;

        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .in('id', unreadIds);

            if (error) throw error;

            toast.success('All notifications marked as read');
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (notificationId: string) => {
        setDeletingIds(prev => new Set(prev).add(notificationId));

        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        } finally {
            setDeletingIds(prev => {
                const updated = new Set(prev);
                updated.delete(notificationId);
                return updated;
            });
        }
    };

    const handleBulkDelete = async () => {
        if (selectedNotifications.size === 0) return;

        const idsToDelete = Array.from(selectedNotifications);
        setDeletingIds(new Set(idsToDelete));

        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .in('id', idsToDelete);

            if (error) throw error;

            setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
            setSelectedNotifications(new Set());
            toast.success(`${idsToDelete.length} notifications deleted`);
        } catch (error) {
            console.error('Error deleting notifications:', error);
            toast.error('Failed to delete notifications');
        } finally {
            setDeletingIds(new Set());
        }
    };

    const toggleSelectAll = () => {
        if (selectedNotifications.size === notifications.length) {
            setSelectedNotifications(new Set());
        } else {
            setSelectedNotifications(new Set(notifications.map(n => n.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const updated = new Set(selectedNotifications);
        if (updated.has(id)) {
            updated.delete(id);
        } else {
            updated.add(id);
        }
        setSelectedNotifications(updated);
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const filteredNotifications = notifications.filter(notification => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            notification.title.toLowerCase().includes(query) ||
            notification.message?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                    <Bell className="text-emerald-600" size={32} />
                    Notifications
                </h1>
                <p className="text-slate-600">
                    {totalCount} total notifications
                    {unreadCount > 0 && ` • ${unreadCount} unread`}
                </p>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        <option value="relationship">Relationship</option>
                        <option value="profile">Profile</option>
                        <option value="farm">Farm</option>
                        <option value="security">Security</option>
                        <option value="status">Status</option>
                        <option value="system">System</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                        onClick={toggleSelectAll}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        {selectedNotifications.size === notifications.length ? 'Deselect All' : 'Select All'}
                    </button>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                            <CheckCheck size={16} />
                            Mark All Read
                        </button>
                    )}

                    {selectedNotifications.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={16} />
                            Delete Selected ({selectedNotifications.size})
                        </button>
                    )}

                    <div className="ml-auto text-sm text-slate-500">
                        Page {currentPage} of {totalPages || 1}
                    </div>
                </div>
            </div>

            {/* Notification List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <div className="text-6xl mb-4">🔔</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No notifications found</h3>
                    <p className="text-slate-600">
                        {searchQuery ? 'Try adjusting your search or filters' : "You're all caught up!"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className={`bg-white rounded-2xl border p-5 transition-all ${
                                    !notification.is_read
                                        ? `bg-gradient-to-br ${getNotificationColor(notification.type || 'system')} shadow-sm`
                                        : 'border-slate-200 hover:border-slate-300'
                                } ${deletingIds.has(notification.id) ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedNotifications.has(notification.id)}
                                        onChange={() => toggleSelect(notification.id)}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />

                                    {/* Icon */}
                                    <div className="text-3xl shrink-0">
                                        {getNotificationIcon(notification.type || 'system')}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="text-base font-bold text-slate-900 leading-tight">
                                                {notification.title}
                                            </h3>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {!notification.is_read && (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                                                )}
                                            </div>
                                        </div>

                                        <p
                                            className={`text-sm text-slate-700 leading-relaxed ${
                                                expandedNotificationId === notification.id ? '' : 'line-clamp-2'
                                            } cursor-pointer`}
                                            onClick={() => {
                                                setExpandedNotificationId(prev =>
                                                    prev === notification.id ? null : notification.id
                                                );
                                                if (!notification.is_read) {
                                                    handleMarkAsRead(notification.id);
                                                }
                                            }}
                                        >
                                            {notification.message}
                                        </p>

                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-xs text-slate-500 font-medium">
                                                {formatRelativeTime(notification.created_at)}
                                            </span>
                                            {notification.category && (
                                                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                                                    {notification.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <CheckCheck size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            disabled={deletingIds.has(notification.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            {deletingIds.has(notification.id) ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentPage === pageNum
                                            ? 'bg-emerald-600 text-white'
                                            : 'border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
