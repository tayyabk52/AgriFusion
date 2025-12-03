'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// --- Interfaces ---

interface MiniTableProps {
    title: string;
    columns: string[];
    data: any[];
    renderRow: (row: any) => React.ReactNode;
    onViewAll: () => void;
}

// --- Mock Data ---

const RECENT_FARMERS = [
    { id: 1, name: 'Ahmed Raza', location: 'Multan', farms: 2, activity: 'Rec generated 1d ago' },
    { id: 2, name: 'Sara Khan', location: 'Faisalabad', farms: 1, activity: 'New registration' },
    { id: 3, name: 'Bilal Ahmed', location: 'Sahiwal', farms: 3, activity: 'Waste added 2h ago' },
];

const RECENT_QUERIES = [
    { id: 'Q101', farmer: 'Ahmed Raza', summary: 'Wheat rust issue', status: 'Pending', updated: '2h ago' },
    { id: 'Q102', farmer: 'Sara Khan', summary: 'Soil pH high', status: 'In Progress', updated: '5h ago' },
    { id: 'Q103', farmer: 'Bilal Ahmed', summary: 'Fertilizer dosage', status: 'Resolved', updated: '1d ago' },
];

const ACTIVE_WASTE = [
    { id: 'W201', farmer: 'Ahmed Raza', type: 'Wheat Straw', qty: '5 tons', status: 'Offers Pending' },
    { id: 'W202', farmer: 'Bilal Ahmed', type: 'Cotton Sticks', qty: '2 tons', status: 'No buyers yet' },
    { id: 'W203', farmer: 'Sara Khan', type: 'Rice Husk', qty: '10 tons', status: 'Negotiation' },
];

// --- Reusable Mini Table ---

const MiniTable = ({ title, columns, data, renderRow, onViewAll }: MiniTableProps) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{title}</h3>
            <button
                onClick={onViewAll}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
                View All <ChevronRight size={14} />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                        {columns.map((col: string, i: number) => (
                            <th key={i} className="px-5 py-3 first:pl-5 last:pr-5 whitespace-nowrap">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((row: any, i: number) => (
                        <tr
                            key={i}
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                            {renderRow(row)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const QuickStatsTables = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Farmer Cases */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <MiniTable
                    title="Recent Farmer Cases"
                    columns={['Name', 'Location', 'Activity']}
                    data={RECENT_FARMERS}
                    onViewAll={() => { }}
                    renderRow={(row: any) => (
                        <>
                            <td className="px-5 py-3 font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {row.name}
                                <span className="block text-xs text-slate-400 font-normal">{row.farms} Farms</span>
                            </td>
                            <td className="px-5 py-3 text-slate-600">{row.location}</td>
                            <td className="px-5 py-3 text-slate-500 text-xs">{row.activity}</td>
                        </>
                    )}
                />
            </motion.div>

            {/* Recent Queries */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <MiniTable
                    title="Recent Queries"
                    columns={['ID / Farmer', 'Summary', 'Status']}
                    data={RECENT_QUERIES}
                    onViewAll={() => { }}
                    renderRow={(row: any) => (
                        <>
                            <td className="px-5 py-3">
                                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{row.id}</span>
                                <div className="text-xs text-slate-900 font-medium mt-1">{row.farmer}</div>
                            </td>
                            <td className="px-5 py-3 text-slate-600 truncate max-w-[120px]">{row.summary}</td>
                            <td className="px-5 py-3">
                                <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${row.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        row.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    }`}>
                                    {row.status}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-1">{row.updated}</div>
                            </td>
                        </>
                    )}
                />
            </motion.div>

            {/* Active Waste Records */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <MiniTable
                    title="Active Waste Records"
                    columns={['Waste', 'Qty', 'Status']}
                    data={ACTIVE_WASTE}
                    onViewAll={() => { }}
                    renderRow={(row: any) => (
                        <>
                            <td className="px-5 py-3 font-medium text-slate-900">
                                {row.type}
                                <div className="text-xs text-slate-500 font-normal">{row.farmer}</div>
                            </td>
                            <td className="px-5 py-3 text-slate-600 text-xs">{row.qty}</td>
                            <td className="px-5 py-3">
                                <span className={`text-[10px] font-medium ${row.status.includes('Offers') ? 'text-emerald-600' :
                                        row.status.includes('Negotiation') ? 'text-blue-600' : 'text-slate-500'
                                    }`}>
                                    {row.status}
                                </span>
                            </td>
                        </>
                    )}
                />
            </motion.div>
        </div>
    );
};
