'use client';

import { motion } from 'framer-motion';
import { Link2, UserPlus } from 'lucide-react';

interface OnboardingTabsProps {
  activeTab: 'link' | 'create';
  onTabChange: (tab: 'link' | 'create') => void;
}

export const OnboardingTabs = ({ activeTab, onTabChange }: OnboardingTabsProps) => {
  const isLinkActive = activeTab === 'link';
  const isCreateActive = activeTab === 'create';

  return (
    <div className="border-b border-slate-200 mb-6">
      <div className="flex gap-1">
        <button
          onClick={() => onTabChange('link')}
          className="focus:outline-none"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className={`px-6 py-3 rounded-t-xl transition-all cursor-pointer ${isLinkActive
                ? 'bg-white border-t-2 border-x border-emerald-600 text-emerald-700 font-semibold -mb-[1px]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <Link2 size={18} strokeWidth={2.5} />
              <span className="text-sm">Link Existing Farmer</span>
            </div>
          </motion.div>
        </button>

        <button
          onClick={() => onTabChange('create')}
          className="focus:outline-none"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className={`px-6 py-3 rounded-t-xl transition-all cursor-pointer ${isCreateActive
                ? 'bg-white border-t-2 border-x border-emerald-600 text-emerald-700 font-semibold -mb-[1px]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus size={18} strokeWidth={2.5} />
              <span className="text-sm">Create New Account</span>
            </div>
          </motion.div>
        </button>
      </div>
    </div>
  );
};
