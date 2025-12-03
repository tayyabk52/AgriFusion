'use client';

import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { FarmerSidebar } from './FarmerSidebar';
import { FarmerDashboardHeader } from './FarmerDashboardHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface FarmerDashboardLayoutProps {
    children: ReactNode;
    farmerName?: string;
    farmerEmail?: string;
    avatarUrl?: string;
    isVerified?: boolean;
}

export function FarmerDashboardLayout({
    children,
    farmerName = 'Farmer',
    farmerEmail,
    avatarUrl,
    isVerified = false
}: FarmerDashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            <ProgressBar />
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
                <FarmerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

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
                        <FarmerDashboardHeader
                            farmerName={farmerName}
                            farmerEmail={farmerEmail}
                            avatarUrl={avatarUrl}
                            isVerified={isVerified}
                        />
                        {children}
                    </div>
                </motion.main>
            </div>
        </>
    );
}
