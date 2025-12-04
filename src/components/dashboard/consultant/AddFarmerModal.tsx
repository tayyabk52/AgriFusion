'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Link2 } from 'lucide-react';
import { LinkExistingFarmerForm } from './LinkExistingFarmerForm';
import { CreateFarmerForm } from './CreateFarmerForm';

interface AddFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  consultantId: string;
}

type FlowType = 'choice' | 'link' | 'create';

export const AddFarmerModal: React.FC<AddFarmerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  consultantId,
}) => {
  const [flow, setFlow] = useState<FlowType>('choice');

  const handleSuccess = () => {
    setFlow('choice');
    onSuccess();
    onClose();
  };

  const handleClose = () => {
    setFlow('choice');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-slate-900">Add Farmer to Network</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Choice Screen */}
              {flow === 'choice' && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <p className="text-slate-600 text-center">
                    Choose how you'd like to add a farmer to your network
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Link Existing Farmer */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFlow('link')}
                      className="p-6 border-2 border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                        <Link2 className="text-white" size={28} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Link Existing Farmer
                      </h3>
                      <p className="text-sm text-slate-600">
                        Search for and link farmers who have already registered on the platform
                      </p>
                    </motion.button>

                    {/* Create New Farmer */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFlow('create')}
                      className="p-6 border-2 border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                        <UserPlus className="text-white" size={28} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Create New Account
                      </h3>
                      <p className="text-sm text-slate-600">
                        Create a complete new farmer account with all details and farm information
                      </p>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Link Existing Farmer Flow */}
              {flow === 'link' && (
                <motion.div
                  key="link"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <LinkExistingFarmerForm
                    consultantId={consultantId}
                    onSuccess={handleSuccess}
                    onCancel={() => setFlow('choice')}
                  />
                </motion.div>
              )}

              {/* Create New Farmer Flow */}
              {flow === 'create' && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CreateFarmerForm
                    consultantId={consultantId}
                    onSuccess={handleSuccess}
                    onCancel={() => setFlow('choice')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
