"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { ConsultantApprovalProvider } from "@/contexts/ConsultantApprovalContext";
import { Sidebar } from "@/components/dashboard/consultant/Sidebar";

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-x-hidden">
        <Sidebar />
        <ConsultantApprovalProvider>{children}</ConsultantApprovalProvider>
      </div>
    </SidebarProvider>
  );
}
