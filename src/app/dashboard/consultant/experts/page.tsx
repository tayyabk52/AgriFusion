"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/consultant/Sidebar";
import { DashboardHeader } from "@/components/dashboard/consultant/DashboardHeader";
import {
  GraduationCap,
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";

const EXPERTS_DATA = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    specialty: "Soil Science",
    rating: 4.9,
    consultations: 156,
    status: "available",
    phone: "+92 300 1234567",
    email: "ahmed@agri.pk",
    location: "Faisalabad",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
  {
    id: 2,
    name: "Dr. Sara Khan",
    specialty: "Pest Management",
    rating: 4.8,
    consultations: 142,
    status: "busy",
    phone: "+92 301 2345678",
    email: "sara@agri.pk",
    location: "Lahore",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 3,
    name: "Dr. Usman Ali",
    specialty: "Irrigation Expert",
    rating: 4.7,
    consultations: 128,
    status: "available",
    phone: "+92 302 3456789",
    email: "usman@agri.pk",
    location: "Multan",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: 4,
    name: "Dr. Zainab Malik",
    specialty: "Crop Pathology",
    rating: 4.9,
    consultations: 178,
    status: "available",
    phone: "+92 303 4567890",
    email: "zainab@agri.pk",
    location: "Sialkot",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

export default function ExpertsPage() {
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

        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full p-5 md:p-7 lg:p-9 max-w-screen">
          {/* Page Header */}
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <GraduationCap
                      className="text-white"
                      size={24}
                      strokeWidth={2.5}
                    />
                  </div>
                  Expert Network
                </h1>
                <p className="text-slate-500">
                  Connect with agricultural experts for specialized
                  consultations
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total Experts", value: "5", color: "blue" },
                { label: "Available Now", value: "3", color: "emerald" },
                { label: "Pending Consults", value: "3", color: "amber" },
                { label: "Avg. Rating", value: "4.8", color: "violet" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Experts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {EXPERTS_DATA.map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {expert.name}
                          </h3>
                          <p className="text-sm text-emerald-600 font-semibold mb-2">
                            {expert.specialty}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Star
                                size={14}
                                className="text-amber-500 fill-amber-500"
                              />
                              <span className="font-semibold text-slate-900">
                                {expert.rating}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle
                                size={14}
                                className="text-blue-500"
                              />
                              <span>{expert.consultations} consultations</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          expert.status === "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                            expert.status === "available"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {expert.status === "available" ? "Available" : "Busy"}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        {expert.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {expert.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        {expert.email}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                      >
                        <MessageCircle size={18} />
                        Contact
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all"
                      >
                        View Profile
                      </motion.button>
                    </div>
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
