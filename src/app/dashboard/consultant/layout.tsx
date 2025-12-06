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
      <SidebarProvider>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900" style={{ overflowX: 'clip' }}>
          <Sidebar />
          <ConsultantApprovalProvider>{children}</ConsultantApprovalProvider>
        </div>
      </SidebarProvider>
    </ProfileProvider>
  );
}
