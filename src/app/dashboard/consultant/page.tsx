"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/consultant/DashboardLayout";
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
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import { useSidebar } from "@/contexts/SidebarContext";

// TypeScript interfaces
interface Profile {
  id: string;
  auth_user_id: string;
  role: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  status: string;
}

interface ConsultantData {
  id: string;
  profile_id: string;
  qualification: string;
  specialization_areas: string[];
  experience_years: number;
}

interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface KPIData {
  activeFarmers: number;
  openQueries: number;
  expertPending: number;
  activeWaste: number;
  newOffers: number;
}

export default function ConsultantDashboard() {
  const router = useRouter();
  const { isApproved, isPending } = useConsultantApproval();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [consultantData, setConsultantData] = useState<ConsultantData | null>(
    null
  );
  const [kpis, setKpis] = useState<KPIData>({
    activeFarmers: 0,
    openQueries: 0,
    expertPending: 0,
    activeWaste: 0,
    newOffers: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  // Data fetching
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check authentication
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/signin");
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError) {
        setError("Failed to load profile");
        setLoading(false);
        return;
      }

      // Verify consultant role
      if (profileData.role !== "consultant") {
        router.push("/dashboard/farmer");
        return;
      }

      setProfile(profileData);

      // Fetch consultant data
      const { data: consultantData, error: consultantError } = await supabase
        .from("consultants")
        .select("*")
        .eq("profile_id", profileData.id)
        .single();

      if (!consultantError && consultantData) {
        setConsultantData(consultantData);
      }

      // Fetch KPIs and notifications in parallel
      await Promise.all([
        fetchActiveFarmersCount(profileData.id),
        fetchNotifications(profileData.id),
      ]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("An unexpected error occurred");
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
      console.error("Error fetching farmer count:", err);
    }
  };

  const fetchNotifications = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", profileId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout profile={null} notifications={[]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout profile={null} notifications={[]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchDashboardData()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { isCollapsed, isTemporary } = useSidebar();
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
        <section className=" md:p-7 lg:p-9">
          <KPIGrid kpis={kpis} />
        </section>
        {/* Enhanced Content Panels - Full Width Grid */}
        <div
          className={`grid grid-cols-1 ${
            isCollapsed ? "lg:grid-cols-2" : "lg:grid-cols-1"
          } gap-6 md:p-7 lg:p-9`}
        >
          {/* Recent Activity Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-screen md:w-auto bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <MessageSquare
                      className="text-white"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Activity
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-white px-3 py-1.5 rounded-full">
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
                        className={`w-2 h-2 rounded-full ${
                          notification.is_read
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
            <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <BarChart3
                      className="text-white"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Performance Overview
                  </h3>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-white px-3 py-1.5 rounded-full">
                  This Month
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {/* Stat Item 1 */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Active Farmers
                      </p>
                      <p className="text-xs text-slate-500">In your network</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {kpis.activeFarmers}
                    </p>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ArrowUpRight size={14} />
                      <span className="text-xs font-semibold">
                        +{kpis.expertPending} new
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stat Item 2 */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Completion Rate
                      </p>
                      <p className="text-xs text-slate-500">Farm profiles</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {kpis.newOffers}%
                    </p>
                    <p className="text-xs text-slate-500">Profile data</p>
                  </div>
                </div>

                {/* Stat Item 3 */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Sparkles size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Available to Link
                      </p>
                      <p className="text-xs text-slate-500">
                        Unassigned farmers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {kpis.activeWaste}
                    </p>
                    <p className="text-xs text-slate-500">Waiting</p>
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
