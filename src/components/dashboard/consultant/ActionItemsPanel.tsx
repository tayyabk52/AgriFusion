'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MessageSquare, ShoppingBag, FileText, ChevronRight, Clock } from 'lucide-react';

const ACTION_ITEMS = [
    {
        id: 1,
        type: 'query',
        title: 'Leaf discoloration on Wheat crop',
        subtitle: 'Farmer: Ali Khan (Farm #F123)',
        status: 'More Info Required',
        time: '3 hours ago',
        priority: 'high',
        icon: MessageSquare,
        color: 'blue'
    },
    {
        id: 2,
        type: 'offer',
        title: 'Offer for Maize Stalks (2 tons)',
        subtitle: 'Buyer: GreenEnergy Corp',
        status: 'Awaiting Decision',
        time: '5 hours ago',
        priority: 'high',
        icon: ShoppingBag,
        color: 'emerald'
    },
    {
        id: 3,
        type: 'expert',
        title: 'Dr. Fatima responded on Query #Q321',
        subtitle: 'Review and pass to farmer',
        status: 'Review Needed',
        time: '1 day ago',
        priority: 'medium',
        icon: FileText,
        color: 'violet'
    },
    {
        id: 4,
        type: 'waste',
        title: 'Rice Husk (5 tons) - No buyers yet',
        subtitle: 'Farm: Indus Valley Farm',
        status: 'Action Required',
        time: '2 days ago',
        priority: 'medium',
        icon: AlertCircle,
        color: 'amber'
    }
];

const FILTERS = ['All', 'Queries', 'Offers', 'Expert'];

export const ActionItemsPanel = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredItems = activeFilter === 'All'
        ? ACTION_ITEMS
        : ACTION_ITEMS.filter(item => item.type.toLowerCase().includes(activeFilter.toLowerCase().slice(0, -1))); // Simple hack for plural matching

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        Work To Do
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                            {ACTION_ITEMS.length}
                        </span>
                    </h2>
                    <p className="text-sm text-slate-500">Prioritized tasks needing attention</p>
                </div>
            </div>

            {/* Filters */}
            <div className="px-5 py-3 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${activeFilter === filter
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-200 cursor-pointer relative"
                        >
                            <div className="flex gap-4">
                                {/* Icon Box */}
                                <div className={`w-10 h-10 rounded-lg bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon size={20} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-semibold text-slate-900 truncate pr-2 group-hover:text-emerald-700 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                                            <Clock size={10} /> {item.time}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                        {item.subtitle}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-100`}>
                                            {item.status}
                                        </span>
                                        {item.priority === 'high' && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-600 border border-red-100 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                High Priority
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center text-slate-300 group-hover:text-emerald-500 transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <p className="text-sm">No items found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
