"use client";

import React, { useState, useEffect } from "react";
import { KPIGrid } from "@/components/dashboard/consultant/KPIGrid";
import { QuickActionsGrid } from "@/components/dashboard/consultant/QuickActionsGrid";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  MessageSquare,
  Sparkles,
  BarChart3,
  Hourglass,
  Activity,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { useConsultantApproval } from "@/contexts/ConsultantApprovalContext";
import { useProfile } from "@/contexts/ProfileContext";
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import { useSidebar } from "@/contexts/SidebarContext";

// TypeScript interfaces
interface KPIData {
  activeFarmers: number;
  openQueries: number;
  expertPending: number;
  activeWaste: number;
  newOffers: number;
}

export default function ConsultantDashboard() {
  // Use ProfileContext instead of fetching data locally
  const { profile, notifications, isLoading: profileLoading, error: profileError } = useProfile();
  const { isApproved, isPending } = useConsultantApproval();

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIData>({
    activeFarmers: 0,
    openQueries: 0,
    expertPending: 0,
    activeWaste: 0,
    newOffers: 0,
  });

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Fetch page-specific data (KPIs) only
  useEffect(() => {
    if (profile?.id) {
      fetchKPIsData();
    }
  }, [profile?.id]);

  const fetchKPIsData = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      await fetchActiveFarmersCount(profile.id);
    } catch (err) {
      // Error handling - KPIs will remain at default values
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveFarmersCount = async (profileId: string) => {
    try {
      // Fetch all farmers with their profile status and farm details
      const { data: farmers, error } = await supabase
        .from("farmers")
        .select(
          `
                    id,
                    created_at,
                    farm_name,
                    land_size_acres,
                    current_crops,
                    profiles:profile_id (
                        status
                    )
                `
        )
        .eq("consultant_id", profileId);

      // Fetch count of unassigned farmers (available to be linked)
      const { count: pendingCount, error: pendingError } = await supabase
        .from("farmers")
        .select("id", { count: "exact", head: true })
        .is("consultant_id", null);

      if (pendingError) {
        console.error("Error fetching pending count:", pendingError);
      }

      if (!error && farmers) {
        const total = farmers.length;
        // Fix TypeScript issue: profiles is an array in the response
        const active = farmers.filter((f) => {
          const profile = Array.isArray(f.profiles)
            ? f.profiles[0]
            : f.profiles;
          return profile?.status === "active";
        }).length;

        // Count farmers created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newFarmers = farmers.filter(
          (f) => new Date(f.created_at) >= thirtyDaysAgo
        ).length;

        // Calculate completion rate (farmers with complete farm details)
        const completeFarmers = farmers.filter(
          (f) =>
            f.farm_name &&
            f.land_size_acres &&
            f.current_crops &&
            f.current_crops.length > 0
        ).length;
        const completionRate =
          total > 0 ? Math.round((completeFarmers / total) * 100) : 0;

        setKpis((prev) => ({
          ...prev,
          activeFarmers: active,
          openQueries: total, // Total farmers
          expertPending: newFarmers, // New farmers this month
          activeWaste: pendingCount || 0, // Unassigned farmers available to link
          newOffers: completionRate, // Completion rate
        }));
      }
    } catch (err) {
      // Error handled silently - UI shows default values
    }
  };


  const { isCollapsed, isTemporary } = useSidebar();

  // Loading state - checking both profile and KPI loading
  if (loading || profileLoading) {
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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state - display profile loading errors
  if (profileError) {
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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{profileError}</p>
              <p className="text-slate-600 text-sm">
                Please try refreshing the page
              </p>
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
        <DashboardHeader /> {/* Welcome & Quick Actions Row */}
        <div className="flex flex-col xl:flex-row gap-8 p-4 md:p-7 lg:p-9">
          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="xl:w-1/3 pt-2"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar
                size={14}
                className="text-emerald-600"
                strokeWidth={2.5}
              />
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {formattedDate}
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              {getGreeting()},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                {profile?.full_name?.split(" ")[0] || "there"}
              </span>
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              Here&apos;s what&apos;s happening in your network today. Keep up
              the great work!
            </p>
          </motion.div>

          {/* Quick Actions */}
          <div className="xl:w-2/3 relative">
            <QuickActionsGrid />
            {!isApproved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10"
              >
                <div className="bg-white border-2 border-amber-200 rounded-xl p-4 shadow-lg max-w-xs text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Hourglass className="text-amber-600" size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    Quick Actions Disabled
                  </p>
                  <p className="text-xs text-slate-600">
                    These features will be available once your account is
                    approved
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        {/* KPI Grid */}
        <section className="p-4 md:p-7 lg:p-9">
          <KPIGrid kpis={kpis} />
        </section>
        {/* Enhanced Content Panels - Full Width Grid */}
        <div
          className={`grid grid-cols-1 ${isCollapsed ? "lg:grid-cols-2" : "lg:grid-cols-1"
            } gap-6 md:p-7 lg:p-9`}
        >
          {/* Recent Activity Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-screen md:w-auto bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <MessageSquare
                      className="text-white"
                      size={18}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Recent Activity
                  </h3>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Live
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${notification.is_read
                          ? "bg-slate-300"
                          : "bg-emerald-500"
                          } mt-2`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold">
                            {notification.title}
                          </span>
                        </p>
                        <p className="text-xs text-slate-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity size={28} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      No recent activity
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Notifications will appear here as you work
                    </p>
                  </div>
                )}
              </div>
              {notifications.length > 2 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all"
                >
                  View All Activity
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Performance Overview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-screen md:w-auto bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <BarChart3
                      className="text-white"
                      size={18}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Performance Overview
                  </h3>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  This Month
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="space-y-2.5 sm:space-y-3">
                {/* Stat Item 1 */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Users size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                        Active Farmers
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 leading-tight">In your network</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      {kpis.activeFarmers}
                    </p>
                    <div className="flex items-center justify-end gap-0.5 text-emerald-600 mt-0.5">
                      <ArrowUpRight size={12} />
                      <span className="text-[10px] sm:text-xs font-semibold">
                        +{kpis.expertPending} new
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stat Item 2 */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                        Completion Rate
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 leading-tight">Farm profiles</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      {kpis.newOffers}%
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 leading-tight">Profile data</p>
                  </div>
                </div>

                {/* Stat Item 3 */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Sparkles size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                        Available to Link
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 leading-tight">
                        Unassigned farmers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      {kpis.activeWaste}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 leading-tight">Waiting</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
