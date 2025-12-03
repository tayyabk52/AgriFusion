'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/consultant/DashboardLayout';
import { KPIGrid } from '@/components/dashboard/consultant/KPIGrid';
import { QuickActionsGrid } from '@/components/dashboard/consultant/QuickActionsGrid';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, MessageSquare, Sparkles, BarChart3 } from 'lucide-react';

export default function ConsultantDashboard() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

    const getGreeting = () => {
        const hour = currentDate.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <DashboardLayout>
            {/* Welcome & Quick Actions Row */}
            <div className="flex flex-col xl:flex-row gap-8 mb-10">
                {/* Welcome Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="xl:w-1/3 pt-2"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar size={14} className="text-emerald-600" strokeWidth={2.5} />
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                            {formattedDate}
                        </p>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                        {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Ahmed</span>
                    </h1>
                    <p className="text-slate-600 text-base leading-relaxed">
                        Here's what's happening in your network today. Keep up the great work!
                    </p>
                </motion.div>

                {/* Quick Actions */}
                <div className="xl:w-2/3">
                    <QuickActionsGrid />
                </div>
            </div>

            {/* KPI Grid */}
            <section className="mb-10">
                <KPIGrid />
            </section>

            {/* Enhanced Content Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <MessageSquare className="text-white" size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-white px-3 py-1.5 rounded-full">
                                Live
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { user: 'Mohammad Ali', action: 'submitted a new query', time: '2 hours ago', color: 'amber' },
                                { user: 'Fatima Khan', action: 'updated waste record', time: '3 hours ago', color: 'teal' },
                                { user: 'Hassan Raza', action: 'requested consultation', time: '5 hours ago', color: 'blue' },
                            ].map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer"
                                >
                                    <div className={`w-2 h-2 rounded-full bg-${activity.color}-500 mt-2`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900">
                                            <span className="font-semibold">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-slate-500">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-4 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all"
                        >
                            View All Activity
                        </motion.button>
                    </div>
                </motion.div>

                {/* Quick Stats Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <BarChart3 className="text-white" size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Performance Overview</h3>
                            </div>
                            <TrendingUp className="text-emerald-600" size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[
                                { label: 'Response Rate', value: '95%', progress: 95, color: 'emerald' },
                                { label: 'Avg. Response Time', value: '2.4 hrs', progress: 85, color: 'blue' },
                                { label: 'Farmer Satisfaction', value: '4.8/5', progress: 96, color: 'amber' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-700">{stat.label}</span>
                                        <span className="text-sm font-bold text-slate-900">{stat.value}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.progress}%` }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                                            className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-emerald-600" size={20} strokeWidth={2.5} />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Excellent Work!</p>
                                    <p className="text-xs text-slate-600">You're in the top 10% of consultants</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
