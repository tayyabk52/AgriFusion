'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/consultant/DashboardLayout';
import { Users, UserPlus, Search, Filter, MoreVertical, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const FARMERS_DATA = [
    { id: 1, name: 'Mohammad Ali', location: 'Faisalabad, Punjab', crops: 'Wheat, Cotton', phone: '+92 300 1234567', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    { id: 2, name: 'Fatima Khan', location: 'Multan, Punjab', crops: 'Rice, Sugarcane', phone: '+92 301 2345678', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { id: 3, name: 'Hassan Raza', location: 'Lahore, Punjab', crops: 'Vegetables', phone: '+92 302 3456789', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    { id: 4, name: 'Ayesha Malik', location: 'Sialkot, Punjab', crops: 'Wheat, Corn', phone: '+92 303 4567890', status: 'Active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
];

export default function FarmersPage() {
    return (
        <DashboardLayout>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <Users className="text-white" size={24} strokeWidth={2.5} />
                                </div>
                                Farmers Management
                            </h1>
                            <p className="text-slate-500">Manage and track all registered farmers</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 md:mt-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                        >
                            <UserPlus size={20} strokeWidth={2.5} />
                            Add New Farmer
                        </motion.button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Farmers', value: '42', color: 'emerald', change: '+12%' },
                            { label: 'Active This Month', value: '38', color: 'blue', change: '+8%' },
                            { label: 'New Registrations', value: '5', color: 'amber', change: '+25%' },
                            { label: 'Pending Approval', value: '2', color: 'red', change: '-' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-700`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Farmers List */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">All Farmers</h2>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
                                    <Search size={20} />
                                </button>
                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Farmer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Crops</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {FARMERS_DATA.map((farmer, index) => (
                                        <motion.tr
                                            key={farmer.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={farmer.avatar} alt={farmer.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{farmer.name}</p>
                                                        <p className="text-xs text-slate-500">ID: #{farmer.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    {farmer.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600">{farmer.crops}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Phone size={14} className="text-slate-400" />
                                                    {farmer.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                    farmer.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                        farmer.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                                                    }`} />
                                                    {farmer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
        </DashboardLayout>
    );
}
