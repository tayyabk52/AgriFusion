"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  HelpCircle,
  Hourglass,
  Recycle,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

interface KPIData {
  activeFarmers: number;
  openQueries: number;
  expertPending: number;
  activeWaste: number;
  newOffers: number;
}

interface KPIGridProps {
  kpis: KPIData;
}

export const KPIGrid = ({ kpis }: KPIGridProps) => {
  const { isCollapsed } = useSidebar();

  const KPI_DATA = useMemo(() => [
    {
      id: "active-farmers",
      label: "Active Farmers",
      value: kpis.activeFarmers.toString(),
      change: "+0",
      trend: "up",
      icon: Users,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
    },
    {
      id: "total-farmers",
      label: "Total Farmers",
      value: kpis.openQueries.toString(),
      change: "0",
      trend: "up",
      icon: Users,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
    },
    {
      id: "new-farmers",
      label: "New This Month",
      value: kpis.expertPending.toString(),
      change: "0",
      trend: "up",
      icon: TrendingUp,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100",
    },
    {
      id: "pending-approval",
      label: "Available to Link",
      value: kpis.activeWaste.toString(),
      change: "0",
      trend: "up",
      icon: Hourglass,
      gradient: "from-teal-500 to-cyan-600",
      bgGradient: "from-teal-50 to-cyan-50",
      iconBg: "bg-teal-100",
    },
    {
      id: "completion-rate",
      label: "Completion Rate",
      value: kpis.newOffers.toString() + "%",
      change: "0",
      trend: "up",
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
      iconBg: "bg-violet-100",
    },
  ], [kpis]);

  return (
    <div
      className={`grid grid-cols-2 ${isCollapsed ? "sm:grid-cols-5" : "sm:grid-cols-3 lg:grid-cols-5"
        } gap-2 sm:gap-3`}
    >
      {KPI_DATA.map((kpi, index) => (
        <motion.div
          key={kpi.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-md sm:shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />

          {/* Icon */}
          <div className="relative z-10 mb-3 sm:mb-4">
            <div
              className={`inline-flex p-2.5 sm:p-3 rounded-xl ${kpi.iconBg} group-hover:bg-gradient-to-br group-hover:${kpi.gradient} transition-all duration-300`}
            >
              <kpi.icon
                size={20}
                className="sm:w-[22px] sm:h-[22px] text-slate-600 group-hover:text-white transition-colors duration-300"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 sm:mb-2">
              {kpi.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                {kpi.value}
              </h3>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${kpi.trend === "up"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp size={10} className="sm:w-3 sm:h-3" strokeWidth={3} />
                ) : (
                  <TrendingDown size={10} className="sm:w-3 sm:h-3" strokeWidth={3} />
                )}
                <span>{kpi.change}</span>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500" />
          <div
            className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`}
          />
        </motion.div>
      ))}
    </div>
  );
};
