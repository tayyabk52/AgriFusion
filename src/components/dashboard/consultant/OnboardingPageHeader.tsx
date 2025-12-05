'use client';

import Link from 'next/link';
import { ChevronRight, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export const OnboardingPageHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >


      {/* Title Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <UserPlus size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Onboard Farmer</h1>
          <p className="text-slate-600 text-base">
            Add farmers to your network by linking existing accounts or creating new ones
          </p>
        </div>
      </div>
    </motion.div>
  );
};
