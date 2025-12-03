'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/consultant/Sidebar';
import { DashboardHeader } from '@/components/dashboard/consultant/DashboardHeader';
import { Settings, User, Bell, Lock, Globe, Palette, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const SETTINGS_TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Palette },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            <Sidebar />

            <main className="flex-1 ml-[80px] md:ml-[280px] transition-all duration-300 p-8">
                <div className="max-w-7xl mx-auto">
                    <DashboardHeader />

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                                <Settings className="text-white" size={24} strokeWidth={2.5} />
                            </div>
                            Settings
                        </h1>
                        <p className="text-slate-500">Manage your account settings and preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar Tabs */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-2">
                                {SETTINGS_TABS.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                                        <span className="text-sm">{tab.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-8">
                                {activeTab === 'profile' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                                <img
                                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
                                                    alt="Profile"
                                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                                <div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                                                    >
                                                        Change Photo
                                                    </motion.button>
                                                    <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        defaultValue="Ahmed Raza"
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        defaultValue="ahmed@agrifusion.com"
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        defaultValue="+92 300 1234567"
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                                    <input
                                                        type="text"
                                                        defaultValue="Faisalabad, Punjab"
                                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                                                <textarea
                                                    rows={4}
                                                    defaultValue="Agricultural consultant with 5+ years of experience in crop management and sustainable farming practices."
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Email Notifications', desc: 'Receive email updates about your account activity' },
                                                { label: 'New Query Alerts', desc: 'Get notified when farmers submit new queries' },
                                                { label: 'Waste Record Updates', desc: 'Updates on waste records and marketplace activity' },
                                                { label: 'Expert Recommendations', desc: 'Notifications when expert consultations are recommended' },
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{item.label}</p>
                                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-teal-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-6">Security Settings</h2>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preferences' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-6">Preferences</h2>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                                                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                                                    <option>English</option>
                                                    <option>Urdu</option>
                                                    <option>Punjabi</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Timezone</label>
                                                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                                                    <option>Pakistan Standard Time (PKT)</option>
                                                    <option>UTC</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Save Button */}
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                                    >
                                        <Save size={20} strokeWidth={2.5} />
                                        Save Changes
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
