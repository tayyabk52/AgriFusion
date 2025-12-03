'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FarmerDashboardLayout } from '@/components/dashboard/farmer/FarmerDashboardLayout';
import Loader from '@/components/ui/Loader';

interface Profile {
    id: string;
    auth_user_id: string;
    role: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    status: string;
    is_verified: boolean;
    created_at: string;
}

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        checkAuthAndFetchProfile();
    }, []);

    const checkAuthAndFetchProfile = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/signin');
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                // Optional: Redirect to error page or signin
            } else {
                setProfile(profileData);
            }

        } catch (error) {
            console.error('Error in checkAuthAndFetchProfile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    // If we have no profile after loading, we might want to render nothing or redirect
    // But usually the router.push above handles the redirect.
    // We render the layout with default values if profile is missing to avoid crash,
    // though ideally we should have a profile here.

    return (
        <FarmerDashboardLayout
            farmerName={profile?.full_name || 'Farmer'}
            farmerEmail={profile?.email}
            avatarUrl={profile?.avatar_url || undefined}
            isVerified={profile?.is_verified}
        >
            {children}
        </FarmerDashboardLayout>
    );
}
