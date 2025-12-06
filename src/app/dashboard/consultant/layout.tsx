"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { ConsultantApprovalProvider } from "@/contexts/ConsultantApprovalContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { Sidebar } from "@/components/dashboard/consultant/Sidebar";

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider requiredRole="consultant">
      <ConsultantApprovalProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-slate-50 font-sans text-slate-900" style={{ overflowX: 'clip' }}>
            <Sidebar />
            {children}
          </div>
        </SidebarProvider>
      </ConsultantApprovalProvider>
    </ProfileProvider>
  );
}
