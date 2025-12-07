"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";

const QUERIES_DATA = [
  {
    id: 1,
    farmer: "Mohammad Ali",
    subject: "Pest control for wheat crop",
    status: "pending",
    priority: "high",
    time: "2 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: 2,
    farmer: "Fatima Khan",
    subject: "Irrigation schedule for rice",
    status: "answered",
    priority: "medium",
    time: "5 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 3,
    farmer: "Hassan Raza",
    subject: "Fertilizer recommendations",
    status: "pending",
    priority: "low",
    time: "1 day ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
  {
    id: 4,
    farmer: "Ayesha Malik",
    subject: "Crop rotation advice needed",
    status: "answered",
    priority: "medium",
    time: "2 days ago",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    id: 5,
    farmer: "Bilal Ahmed",
    subject: "Soil testing results interpretation",
    status: "pending",
    priority: "high",
    time: "3 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
];

// Stats configuration with explicit Tailwind classes
const STATS_CONFIG = [
  {
    label: "Total Queries",
    value: "8",
    icon: MessageSquare,
    iconClass: "text-slate-600",
    badgeClass: "bg-slate-50 text-slate-700",
  },
  {
    label: "Pending",
    value: "3",
    icon: Clock,
    iconClass: "text-amber-600",
    badgeClass: "bg-amber-50 text-amber-700",
  },
  {
    label: "Answered",
    value: "2",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "High Priority",
    value: "2",
    icon: AlertCircle,
    iconClass: "text-red-600",
    badgeClass: "bg-red-50 text-red-700",
  },
];

export default function QueriesPage() {
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
        <DashboardHeader />

        {/* Page Header */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full p-5 md:p-7 lg:p-9 max-w-dvw">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                  <MessageSquare
                    className="text-white"
                    size={24}
                    strokeWidth={2.5}
                  />
                </div>
                Farmer Queries
              </h1>
              <p className="text-slate-500">
                Respond to farmer questions and provide expert advice
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STATS_CONFIG.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon size={20} className={stat.iconClass} />
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.badgeClass}`}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Queries List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Queries
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {QUERIES_DATA.map((query, index) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={query.avatar}
                        alt={query.farmer}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {query.subject}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${query.priority === "high"
                                ? "bg-red-50 text-red-700"
                                : query.priority === "medium"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                          >
                            {query.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">
                          From{" "}
                          <span className="font-medium text-slate-700">
                            {query.farmer}
                          </span>{" "}
                          • {query.time}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${query.status === "answered"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                              }`}
                          >
                            {query.status === "answered" ? (
                              <CheckCircle2 size={12} className="mr-1.5" />
                            ) : (
                              <Clock size={12} className="mr-1.5" />
                            )}
                            {query.status === "answered"
                              ? "Answered"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                    >
                      <Send size={14} />
                      Reply
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
