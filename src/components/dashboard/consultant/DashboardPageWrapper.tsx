'use client';

import React from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { DashboardHeader } from './DashboardHeader';

interface DashboardPageWrapperProps {
    children: React.ReactNode;
    /** Add padding to the content area. Defaults to true. */
    withPadding?: boolean;
    /** Custom className for the content container */
    contentClassName?: string;
}

/**
 * Shared wrapper component for all consultant dashboard pages.
 * Handles sidebar margin logic and includes the DashboardHeader.
 */
export function DashboardPageWrapper({
    children,
    withPadding = true,
    contentClassName = '',
}: DashboardPageWrapperProps) {
    const { isCollapsed, isTemporary } = useSidebar();

    return (
        <main
            className="flex-1 transition-all duration-300"
            style={{
                marginLeft: isCollapsed && !isTemporary ? '80px' : isTemporary ? '0' : '280px',
            }}
        >
            <div className="w-full">
                <DashboardHeader />
                <div
                    className={`${withPadding ? 'flex flex-col gap-4 md:gap-6 lg:gap-8 w-full p-5 md:p-7 lg:p-9 max-w-dvw' : ''
                        } ${contentClassName}`}
                >
                    {children}
                </div>
            </div>
        </main>
    );
}
