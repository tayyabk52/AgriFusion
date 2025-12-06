"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingPageHeader } from "@/components/dashboard/consultant/OnboardingPageHeader";
import { OnboardingTabs } from "@/components/dashboard/consultant/OnboardingTabs";
import { LinkExistingFarmerForm } from "@/components/dashboard/consultant/LinkExistingFarmerForm";
import { CreateFarmerForm } from "@/components/dashboard/consultant/CreateFarmerForm";
import { useConsultantApproval } from "@/contexts/ConsultantApprovalContext";
import { useProfile } from "@/contexts/ProfileContext";
import { Loader2, Hourglass, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import { useSidebar } from "@/contexts/SidebarContext";

export default function FarmerNetworkPage() {
  const router = useRouter();
  const { isApproved } = useConsultantApproval();
  const { profile, isLoading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<"link" | "create">("link");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSuccess = (action: "link" | "create") => {
    setMessage({
      type: "success",
      text:
        action === "link"
          ? "Farmer linked successfully!"
          : "Farmer account created successfully!",
    });
  };

  const { isCollapsed, isTemporary } = useSidebar();

  // Loading state - checking profile loading
  if (profileLoading) {
    return (
      <main
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft:
            isCollapsed && !isTemporary ? "80px" : isTemporary ? "0" : "280px",
        }}
      >
        <div className="w-full">
          <DashboardHeader />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-600 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex-1 transition-all duration-300"
      style={{
        marginLeft:
          isCollapsed && !isTemporary ? "80px" : isTemporary ? "0" : "280px",
      }}
    >
      <div className="w-full">
        <DashboardHeader />
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full p-5 md:p-7 lg:p-9 max-w-dvw">
          <OnboardingPageHeader />
          <div className="w-full flex flex-col">
            <OnboardingTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Approval Overlay */}
            {!isApproved && (
              <div className="relative mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <Hourglass className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900">
                      Approval Pending
                    </h3>
                    <p className="text-xs text-amber-700 mt-0.5">
                      This feature will be fully available once your consultant
                      account is approved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "link" ? (
                <motion.div
                  key="link"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {profile && (
                    <LinkExistingFarmerForm
                      consultantId={profile.id}
                      onSuccess={() => handleSuccess("link")}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {profile && (
                    <CreateFarmerForm
                      consultantId={profile.id}
                      onSuccess={() => handleSuccess("create")}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
                    message.type === "success"
                      ? "bg-white border-emerald-200"
                      : "bg-white border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  ) : (
                    <AlertCircle size={18} className="text-red-600" />
                  )}
                  <p className="text-sm font-medium text-slate-900">
                    {message.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
