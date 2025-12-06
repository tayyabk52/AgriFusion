"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import {
  Recycle,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";

const WASTE_RECORDS = [
  {
    id: 1,
    farmer: "Mohammad Ali",
    wasteType: "Wheat Straw",
    quantity: "500 kg",
    value: "PKR 5,000",
    date: "2025-11-28",
    status: "sold",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: 2,
    farmer: "Fatima Khan",
    wasteType: "Rice Husk",
    quantity: "300 kg",
    value: "PKR 3,600",
    date: "2025-11-27",
    status: "available",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 3,
    farmer: "Hassan Raza",
    wasteType: "Cotton Stalks",
    quantity: "400 kg",
    value: "PKR 4,800",
    date: "2025-11-26",
    status: "available",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
  {
    id: 4,
    farmer: "Ayesha Malik",
    wasteType: "Corn Cobs",
    quantity: "200 kg",
    value: "PKR 2,400",
    date: "2025-11-25",
    status: "sold",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

export default function WastePage() {
  const { isCollapsed, isTemporary } = useSidebar();
  return (
    <main
      className="flex-1 transition-all duration-300"
      style={{
        marginLeft:
          isCollapsed && !isTemporary ? "80px" : isTemporary ? "0" : "280px",
      }}
    >
      {" "}
      <div className="w-full max-w-screen">
        <DashboardHeader />

        {/* Page Header */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full p-5 md:p-7 lg:p-9 max-w-dvw">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
                  <Recycle className="text-white" size={24} strokeWidth={2.5} />
                </div>
                Waste Management
              </h1>
              <p className="text-slate-500">
                Track and manage agricultural waste records
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 md:mt-0 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-teal-200 hover:shadow-xl transition-all"
            >
              <Package size={20} strokeWidth={2.5} />
              Record New Waste
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Records",
                value: "12",
                icon: Recycle,
                color: "teal",
              },
              {
                label: "Available Stock",
                value: "2",
                icon: Package,
                color: "blue",
              },
              {
                label: "Total Value",
                value: "PKR 45K",
                icon: DollarSign,
                color: "emerald",
              },
              {
                label: "This Month",
                value: "+18%",
                icon: TrendingUp,
                color: "violet",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}
                  >
                    <stat.icon
                      size={20}
                      className={`text-${stat.color}-600`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </h3>
                </div>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Waste Records Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Waste Records
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Farmer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Waste Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Estimated Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {WASTE_RECORDS.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 w-max">
                          <img
                            src={record.avatar}
                            alt={record.farmer}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">
                              {record.farmer}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: #{record.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-max">
                        <p className="text-sm font-medium text-slate-900">
                          {record.wasteType}
                        </p>
                      </td>
                      <td className="px-6 py-4 w-max">
                        <p className="text-sm text-slate-600">
                          {record.quantity}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-emerald-600">
                          {record.value}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={14} className="text-slate-400" />
                          {record.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === "sold"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              record.status === "sold"
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            }`}
                          />
                          {record.status === "sold" ? "Sold" : "Available"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
