'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Sprout,
    Users,
    MessageSquare,
    FileText,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/farmer', badge: null },
    { icon: Sprout, label: 'My Farm', href: '/dashboard/farmer/farm', badge: null },
    { icon: Users, label: 'My Consultant', href: '/dashboard/farmer/consultant', badge: null },
];

interface FarmerSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export function FarmerSidebar({ isCollapsed, setIsCollapsed }: FarmerSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? '80px' : '280px',
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 bottom-0 left-0 bg-slate-900 text-white z-50 border-r border-slate-800 flex flex-col"
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-center px-4 border-b border-slate-800">
                    <motion.div
                        animate={{ scale: isCollapsed ? 0.9 : 1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden bg-white">
                            <Image
                                src="/logo.png"
                                alt="AgriFusion Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                                priority
                            />
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col"
                            >
                                <span className="font-bold text-white tracking-tight text-sm">
                                    Agri<span className="text-emerald-400">Fusion</span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-400 tracking-wide">
                                    FARMER
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link key={item.href} href={item.href} className="block">
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer
                                            ${isActive
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-900/50'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                            }
                                        `}
                                    >
                                        <Icon size={20} className="flex-shrink-0" strokeWidth={2.5} />

                                        {!isCollapsed && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex-1 flex items-center justify-between"
                                            >
                                                <span className="text-sm font-semibold">{item.label}</span>
                                                {item.badge && (
                                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </motion.div>
                                        )}

                                        {isCollapsed && item.badge && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white">
                                                {item.badge}
                                            </span>
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Help Section */}
                <div className="px-3 pb-4 border-t border-slate-800 pt-4">
                    <motion.button
                        whileHover={{ x: 4 }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <HelpCircle size={20} strokeWidth={2.5} />
                        {!isCollapsed && (
                            <span className="text-sm font-semibold">Help & Support</span>
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ x: 4 }}
                        className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all mt-2"
                        onClick={async () => {
                            // Implement logout
                            router.push('/signin');
                        }}
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        {!isCollapsed && (
                            <span className="text-sm font-semibold">Logout</span>
                        )}
                    </motion.button>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-8 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all cursor-pointer z-[60] border-2 border-white"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight size={16} className="text-white" strokeWidth={3} />
                    </motion.div>
                </button>
            </motion.aside>
        </>
    );
}
