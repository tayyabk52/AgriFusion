'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
    id: string;
    auth_user_id: string;
    role: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    status: string;
    is_verified?: boolean;
}

interface Notification {
    id: string;
    recipient_id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface ProfileContextType {
    profile: Profile | null;
    notifications: Notification[];
    isLoading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
    children: ReactNode;
    requiredRole?: 'consultant' | 'farmer';
}

/**
 * ProfileProvider - Centralized profile and notifications management
 *
 * Benefits:
 * - Single source of truth for user data
 * - Eliminates duplicate data fetching across pages
 * - Provides refresh methods for real-time updates
 * - Handles auth checks and role-based routing
 */
export function ProfileProvider({ children, requiredRole = 'consultant' }: ProfileProviderProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfileData();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    // User signed in - refresh profile data
                    await fetchProfileData();
                } else if (event === 'SIGNED_OUT') {
                    // User signed out - clear all state
                    setProfile(null);
                    setNotifications([]);
                    router.push('/signin');
                } else if (event === 'TOKEN_REFRESHED' && session) {
                    // Token refreshed - optionally re-fetch profile
                    await fetchProfileData();
                }
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Real-time notifications subscription
    useEffect(() => {
        if (!profile) return;

        // Subscribe to new notifications for this user
        const channel = supabase
            .channel(`notifications:${profile.id}`) // Unique channel per user
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${profile.id}`,
                },
                (payload) => {
                    console.log('🔔 New notification received:', payload.new);
                    // Add new notification to the beginning of the list
                    setNotifications((prev) => [payload.new as Notification, ...prev.slice(0, 9)]);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${profile.id}`,
                },
                (payload) => {
                    console.log('📝 Notification updated:', payload.new);
                    // Update the notification in the list
                    setNotifications((prev) =>
                        prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
                    );
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${profile.id}`,
                },
                (payload) => {
                    console.log('🗑️ Notification deleted:', payload.old);
                    // Remove the notification from the list
                    setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Real-time notifications connected');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Real-time notifications connection error');
                } else if (status === 'TIMED_OUT') {
                    console.error('⏱️ Real-time notifications connection timed out');
                } else if (status === 'CLOSED') {
                    console.log('🔌 Real-time notifications connection closed');
                }
            });

        // Cleanup channel on unmount or profile change
        return () => {
            console.log('🔌 Unsubscribing from notifications channel');
            supabase.removeChannel(channel);
        };
    }, [profile]);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Check authentication
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/signin');
                return;
            }

            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

            if (profileError) {
                setError('Failed to load profile');
                setIsLoading(false);
                return;
            }

            // Verify role
            if (profileData.role !== requiredRole) {
                const redirectPath = profileData.role === 'farmer'
                    ? '/dashboard/farmer'
                    : '/dashboard/consultant';
                router.push(redirectPath);
                return;
            }

            setProfile(profileData);

            // Fetch notifications
            const { data: notificationData, error: notificationError } = await supabase
                .from('notifications')
                .select('*')
                .eq('recipient_id', profileData.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (!notificationError && notificationData) {
                setNotifications(notificationData);
            }

        } catch (err) {
            console.error('Error fetching profile data:', err);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (!profile) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profile.id)
            .single();

        if (!error && data) {
            setProfile(data);
        }
    };

    const refreshNotifications = async () => {
        if (!profile) return;

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            setNotifications(data);
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profile,
                notifications,
                isLoading,
                error,
                refreshProfile,
                refreshNotifications,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

/**
 * useProfile - Hook to access profile context
 *
 * Usage:
 * const { profile, notifications, isLoading } = useProfile();
 */
export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
