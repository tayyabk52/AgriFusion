'use client';

import React, { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { motion } from 'framer-motion';

function DashboardContent({ children }: { children: ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            <Sidebar />
            <motion.main
                initial={false}
                animate={{
                    marginLeft: isCollapsed ? '80px' : '280px',
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 w-full overflow-x-hidden"
                style={{ minHeight: '100vh' }}
            >
                <div className="max-w-7xl mx-auto w-full">
                    <DashboardHeader />
                    {children}
                </div>
            </motion.main>
        </div>
    );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
    );
}
