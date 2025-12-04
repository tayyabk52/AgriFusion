'use client';

import { SidebarProvider } from '@/contexts/SidebarContext';
import { ConsultantApprovalProvider } from '@/contexts/ConsultantApprovalContext';

export default function ConsultantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <ConsultantApprovalProvider>
                {children}
            </ConsultantApprovalProvider>
        </SidebarProvider>
    );
}
