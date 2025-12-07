'use client';

import React from 'react';
import { NotificationList } from '@/components/notifications/NotificationList';
import { DashboardHeader } from '@/components/dashboard/consultant/DashboardHeader';
import { useSidebar } from '@/contexts/SidebarContext';

export default function ConsultantNotificationsPage() {
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
                <div className="px-4 sm:px-6 md:px-8 py-6">
                    <NotificationList />
                </div>
            </div>
        </main>
    );
}
