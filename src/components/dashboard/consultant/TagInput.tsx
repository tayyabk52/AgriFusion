'use client';

import React, { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  error?: string;
  maxItems?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Type and press Enter...',
  suggestions = [],
  error,
  maxItems,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (item) =>
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(item)
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    // Check if tag is valid and not duplicate
    if (!trimmedTag || tags.includes(trimmedTag)) {
      setInputValue('');
      setShowSuggestions(false);
      return;
    }

    // Check max items limit
    if (maxItems && tags.length >= maxItems) {
      setInputValue('');
      setShowSuggestions(false);
      return;
    }

    onChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      onChange(tags.slice(0, -1));
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
            setShowSuggestions(e.target.value.length > 0 && suggestions.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10'
              : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
          }`}
          disabled={maxItems ? tags.length >= maxItems : false}
        />

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto"
            >
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => addTag(item)}
                  className="w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} className="text-emerald-600" />
                  <span className="text-sm text-slate-700">{item}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 mt-1 ml-1 font-medium">
          {error}
        </p>
      )}

      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
              >
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-emerald-100 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag}`}
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
        {maxItems && tags.length >= maxItems
          ? `Maximum of ${maxItems} items reached`
          : 'Press Enter to add an item, or select from suggestions'}
      </p>
    </div>
  );
};
