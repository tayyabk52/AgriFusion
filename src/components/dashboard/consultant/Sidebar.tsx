"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  Recycle,
  GraduationCap,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/consultant" },
  { label: "Farmers", icon: Users, href: "/dashboard/consultant/farmers" },
  {
    label: "Onboard Farmer",
    icon: UserPlus,
    href: "/dashboard/consultant/farmer-network",
  },
  {
    label: "Queries",
    icon: MessageSquare,
    href: "/dashboard/consultant/queries",
    badge: 8,
  },
  {
    label: "Waste Records",
    icon: Recycle,
    href: "/dashboard/consultant/waste",
  },
  {
    label: "Experts",
    icon: GraduationCap,
    href: "/dashboard/consultant/experts",
  },
  { label: "Settings", icon: Settings, href: "/dashboard/consultant/settings" },
];

export const Sidebar = () => {
  const { isCollapsed, toggleSidebar, isTemporary } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <motion.button
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={false}
        animate={{
          left:
            isCollapsed && !isTemporary
              ? "64px"
              : isTemporary && isCollapsed
              ? "5px"
              : "264px",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-8 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center text-white hover:shadow-xl hover:shadow-emerald-300 border-2 border-white z-[70]"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronRight size={16} strokeWidth={3} />
        </motion.div>
      </motion.button>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`min-h-screen h-full bg-white border-r border-slate-200/80 fixed z-[69] ${
          isTemporary && isCollapsed ? "-ml-20" : ""
        } left-0 top-0 bottom-0 z-40 flex flex-col shadow-xl shadow-slate-200/50 overflow-visible`}
      >
        {/* Sleek Toggle Button - Positioned outside sidebar */}

        {/* Logo Section - Matching Navbar Style */}
        <div
          className={`p-6 flex items-center ${
            isCollapsed ? "justify-center" : "gap-3"
          } border-b border-slate-100`}
        >
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer select-none"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0"
            >
              <Image
                src="/logo.png"
                alt="AgriFusion Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col leading-none overflow-hidden"
                >
                  <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    Agri
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                      Fusion
                    </span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 mt-0.5 tracking-wide">
                    CONSULTANT
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
          {NAV_ITEMS.map((item, index) => {
            // Exact match for Dashboard, startsWith for others
            const isActive =
              item.href === "/dashboard/consultant"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                                    ${
                                      isActive
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                                    }`}
                >
                  {/* Active Indicator */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-r-full"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <item.icon
                    size={22}
                    className={
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center justify-between flex-1 overflow-hidden"
                      >
                        <span className="text-sm whitespace-nowrap">
                          {item.label}
                        </span>
                        {item.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Badge Dot for collapsed state */}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200 shadow-xl">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
};
