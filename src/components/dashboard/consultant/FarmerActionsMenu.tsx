'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`p-2 rounded-lg transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed text-slate-400'
            : 'hover:bg-slate-100 text-slate-600'
        }`}
        title={disabled ? 'Your account must be approved to manage farmers' : 'Farmer actions'}
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20"
          >
            <div className="py-1">
              <button
                onClick={() => handleAction(() => onView(farmer))}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm text-slate-700"
              >
                <Eye size={16} className="text-slate-400" />
                View Details
              </button>

              <button
                onClick={() => handleAction(() => onEdit(farmer))}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm text-slate-700"
              >
                <Edit size={16} className="text-slate-400" />
                Edit Details
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => handleAction(() => onRemove(farmer))}
                className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-sm text-red-600"
              >
                <Trash2 size={16} className="text-red-500" />
                Remove from Network
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
