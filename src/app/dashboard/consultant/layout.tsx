'use client';

import { SidebarProvider } from '@/contexts/SidebarContext';

export default function ConsultantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SidebarProvider>{children}</SidebarProvider>;
}
