'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Link2, UserPlus } from 'lucide-react';

export const OnboardingTabs = () => {
  const pathname = usePathname();
  const isLinkActive = pathname.includes('/link');
  const isCreateActive = pathname.includes('/create');

  return (
    <div className="border-b border-slate-200 mb-8">
      <div className="flex gap-1">
        <Link href="/dashboard/consultant/farmer-network/link">
          <motion.div
            whileHover={{ y: -2 }}
            className={`px-6 py-4 rounded-t-xl transition-all cursor-pointer ${
              isLinkActive
                ? 'bg-white border-t-2 border-x-2 border-emerald-600 text-emerald-700 font-semibold -mb-[1px]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Link2 size={18} strokeWidth={2.5} />
              <span>Link Existing Farmer</span>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/consultant/farmer-network/create">
          <motion.div
            whileHover={{ y: -2 }}
            className={`px-6 py-4 rounded-t-xl transition-all cursor-pointer ${
              isCreateActive
                ? 'bg-white border-t-2 border-x-2 border-emerald-600 text-emerald-700 font-semibold -mb-[1px]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus size={18} strokeWidth={2.5} />
              <span>Create New Account</span>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};
