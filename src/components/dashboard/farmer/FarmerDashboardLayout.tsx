"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { FarmerSidebar } from "./FarmerSidebar";
import { FarmerDashboardHeader } from "./FarmerDashboardHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useSidebar } from "@/contexts/SidebarContext";

interface FarmerDashboardLayoutProps {
  children: ReactNode;
}

export function FarmerDashboardLayout({
  children,
}: FarmerDashboardLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <ProgressBar />
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
        <FarmerSidebar />

        <motion.main
          initial={false}
          animate={{
            marginLeft: isCollapsed ? "80px" : "280px",
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 w-full overflow-x-hidden"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-full">
            <FarmerDashboardHeader />
            {children}
          </div>
        </motion.main>
      </div>
    </>
  );
}
