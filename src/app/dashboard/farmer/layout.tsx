'use client';

import React from 'react';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { FarmerDashboardLayout } from '@/components/dashboard/farmer/FarmerDashboardLayout';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProfileProvider requiredRole="farmer">
            <SidebarProvider>
                <FarmerDashboardLayoutWrapper>
                    {children}
                </FarmerDashboardLayoutWrapper>
            </SidebarProvider>
        </ProfileProvider>
    );
}

function FarmerDashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <FarmerDashboardLayout>
            {children}
        </FarmerDashboardLayout>
    );
}
