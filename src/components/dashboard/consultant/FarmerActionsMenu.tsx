'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { FarmerWithProfile } from '@/types/farmer';

interface FarmerActionsMenuProps {
  farmer: FarmerWithProfile;
  onEdit: (farmer: FarmerWithProfile) => void;
  onView: (farmer: FarmerWithProfile) => void;
  onRemove: (farmer: FarmerWithProfile) => void;
  disabled?: boolean;
}

export const FarmerActionsMenu: React.FC<FarmerActionsMenuProps> = ({
  farmer,
  onEdit,
  onView,
  onRemove,
  disabled = false,
}) => {
  if (disabled) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-400">Pending approval</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onView(farmer)}
        className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
        title="View Details"
        aria-label="View farmer details"
      >
        <Eye size={16} strokeWidth={2} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onEdit(farmer)}
        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        title="Edit Details"
        aria-label="Edit farmer details"
      >
        <Edit size={16} strokeWidth={2} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onRemove(farmer)}
        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
        title="Remove from Network"
        aria-label="Remove farmer from network"
      >
        <Trash2 size={16} strokeWidth={2} />
      </motion.button>
    </div>
  );
};
