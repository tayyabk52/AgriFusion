'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Sprout, Recycle, ShoppingBag, MessageSquare, MoreHorizontal } from 'lucide-react';

const ACTIVITIES = [
    {
        id: 1,
        type: 'farmer',
        text: 'New farmer registered: Ali Khan (Farm in Lahore)',
        time: '10:30 AM',
        icon: UserPlus,
        color: 'emerald',
        actor: 'System'
    },
    {
        id: 2,
        type: 'recommendation',
        text: 'Crop recommendation generated for Farm #F123 (Wheat + Companion Crop)',
        time: '09:15 AM',
        icon: Sprout,
        color: 'green',
        actor: 'Consultant'
    },
    {
        id: 3,
        type: 'waste',
        text: 'New waste record created: Maize stalks (2 tons) at Farm #F456',
        time: 'Yesterday',
        icon: Recycle,
        color: 'amber',
        actor: 'Farmer'
    },
    {
        id: 4,
        type: 'offer',
        text: 'Buyer ABC submitted an offer for Waste #W789',
        time: 'Yesterday',
        icon: ShoppingBag,
        color: 'blue',
        actor: 'Buyer ABC'
    },
    {
        id: 5,
        type: 'expert',
        text: 'Expert Dr. Fatima responded on Query #Q321',
        time: '2 days ago',
        icon: MessageSquare,
        color: 'violet',
        actor: 'Dr. Fatima'
    }
];

export const ActivityFeed = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                    {ACTIVITIES.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-6"
                        >
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-${activity.color}-500 shadow-sm`} />

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-800 font-medium leading-snug hover:text-emerald-700 cursor-pointer transition-colors">
                                        {activity.text}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                                            {activity.actor}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap mt-1 sm:mt-0">
                                    {activity.time}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-emerald-600 font-medium border border-dashed border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200">
                    View All Activity
                </button>
            </div>
        </div>
    );
};
