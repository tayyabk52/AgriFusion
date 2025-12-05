'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  multiSelect = false,
  disabled = false,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (option: string): boolean => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(option);
    }
    return value === option;
  };

  const handleOptionClick = (option: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(option)) {
        onChange(currentValues.filter((v) => v !== option));
      } else {
        onChange([...currentValues, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiSelect ? [] : '');
  };

  const getDisplayText = (): string => {
    if (multiSelect) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return placeholder;
      if (values.length === 1) return values[0];
      return `${values.length} selected`;
    }
    return (typeof value === 'string' ? value : '') || placeholder;
  };

  const hasValue = multiSelect
    ? Array.isArray(value) && value.length > 0
    : Boolean(value);

  return (
    <div ref={dropdownRef} className={`relative ${compact ? 'min-w-[100px]' : ''}`}>
      {!compact && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${compact ? 'px-3 py-2 text-xs min-w-[90px]' : 'w-full px-4 py-2.5'} border rounded-lg text-left flex items-center justify-between transition-all ${disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : isOpen
              ? 'border-emerald-500 ring-2 ring-emerald-100'
              : 'border-slate-200 hover:border-slate-300'
          }`}
      >
        <span className={`truncate ${hasValue ? 'text-slate-900' : 'text-slate-400'}`}>
          {compact && !hasValue ? label : getDisplayText()}
        </span>

        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          {hasValue && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 hover:bg-slate-100 rounded transition-colors cursor-pointer inline-flex"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClear(e as any);
                }
              }}
            >
              <X size={compact ? 12 : 16} className="text-slate-500" />
            </span>
          )}
          <ChevronDown
            size={compact ? 14 : 18}
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className={`absolute z-50 ${compact ? 'min-w-[180px]' : 'w-full'} mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden`}>
          {options.length > 5 && (
            <div className="p-2 border-b border-slate-100">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const selected = isSelected(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors text-sm ${selected ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
                      }`}
                  >
                    <span className="truncate">{option}</span>
                    {selected && (
                      <Check size={16} className="text-emerald-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {multiSelect && hasValue && (
            <div className="p-2 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
