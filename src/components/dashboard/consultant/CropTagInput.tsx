'use client';

import React, { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface CropTagInputProps {
  crops: string[];
  onChange: (crops: string[]) => void;
  placeholder?: string;
}

const COMMON_CROPS = [
  'Wheat',
  'Rice',
  'Cotton',
  'Sugarcane',
  'Corn',
  'Vegetables',
  'Fruits',
  'Pulses',
  'Oilseeds',
  'Barley',
];

export const CropTagInput: React.FC<CropTagInputProps> = ({
  crops,
  onChange,
  placeholder = 'Type crop name and press Enter...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = COMMON_CROPS.filter(
    (crop) =>
      crop.toLowerCase().includes(inputValue.toLowerCase()) &&
      !crops.includes(crop)
  );

  const addCrop = (crop: string) => {
    const trimmedCrop = crop.trim();
    if (trimmedCrop && !crops.includes(trimmedCrop)) {
      onChange([...crops, trimmedCrop]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeCrop = (cropToRemove: string) => {
    onChange(crops.filter((crop) => crop !== cropToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCrop(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
            >
              {filteredSuggestions.map((crop) => (
                <button
                  key={crop}
                  onClick={() => addCrop(crop)}
                  className="w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} className="text-emerald-600" />
                  <span className="text-sm text-slate-700">{crop}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags Display */}
      {crops.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {crops.map((crop) => (
              <motion.div
                key={crop}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
              >
                <span>{crop}</span>
                <button
                  onClick={() => removeCrop(crop)}
                  className="hover:bg-emerald-100 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500">
        Press Enter to add a crop, or select from suggestions
      </p>
    </div>
  );
};
