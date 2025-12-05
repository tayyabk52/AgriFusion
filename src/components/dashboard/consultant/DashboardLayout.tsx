'use client';

import React, { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { ApprovalBanner } from './ApprovalBanner';
import { motion } from 'framer-motion';

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

interface DashboardLayoutProps {
    children: ReactNode;
    profile?: Profile | null;
    notifications?: Notification[];
}

function DashboardContent({ children, profile, notifications }: DashboardLayoutProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex relative w-full">
            <Sidebar />
            <motion.main
                initial={false}
                animate={{
                    marginLeft: isCollapsed ? '80px' : '280px',
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 w-full overflow-x-hidden"
                style={{ minHeight: '100vh' }}
            >
                <div className="w-full">
                    {profile && notifications ? (
                        <DashboardHeader profile={profile} notifications={notifications} />
                    ) : (
                        <DashboardHeader profile={{ id: '', full_name: 'Loading...', email: '' }} notifications={[]} />
                    )}
                    <ApprovalBanner />
                    {children}
                </div>
            </motion.main>
        </div>
    );
}

export function DashboardLayout({ children, profile, notifications }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <DashboardContent profile={profile} notifications={notifications}>{children}</DashboardContent>
        </SidebarProvider>
    );
}
