'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Loader2,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
  AlertCircle,
  RefreshCw,
  Wheat,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { FarmerWithProfile } from '@/types/farmer';
import { useUnassignedFarmers } from '@/hooks/useUnassignedFarmers';
import { useFilters } from '@/hooks/useFilters';
import { FilterDropdown } from './FilterDropdown';

interface LinkExistingFarmerFormProps {
  consultantId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LinkExistingFarmerForm: React.FC<LinkExistingFarmerFormProps> = ({
  consultantId,
  onSuccess,
  onCancel,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [linkingFarmerId, setLinkingFarmerId] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const {
    farmers,
    loading,
    error,
    pagination,
    refetch,
    setPage,
    setSearch,
    setFilters,
  } = useUnassignedFarmers(1, 12);

  const { filters: filterOptions, loading: filtersLoading } = useFilters();

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSearch(value);
  };

  const handleFiltersChange = () => {
    setFilters({
      district: selectedDistrict || undefined,
      state: selectedState || undefined,
      crops: selectedCrops.length > 0 ? selectedCrops : undefined,
    });
  };

  React.useEffect(() => {
    handleFiltersChange();
  }, [selectedDistrict, selectedState, selectedCrops]);

  const handleLinkFarmer = async (farmer: FarmerWithProfile) => {
    setLinkingFarmerId(farmer.id);
    setLinkError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated. Please log in again.');
      }

      const response = await fetch('/api/farmers/link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmerId: farmer.id,
          farmerProfileId: farmer.profiles.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to link farmer');
      }

      await refetch();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Link error:', err);
      setLinkError(err.message || 'Failed to link farmer. Please try again.');
    } finally {
      setLinkingFarmerId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Browse Available Farmers</h3>
          <p className="text-xs text-slate-500">Select farmers who are not yet linked to a consultant</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Search and Filters - Single Row */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, location, phone..."
            className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          {searchInput && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={14} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Filters - Inline */}
        <div className="flex gap-2 flex-shrink-0">
          <FilterDropdown
            label="District"
            placeholder="All"
            options={filterOptions.districts}
            value={selectedDistrict}
            onChange={(value) => setSelectedDistrict(value as string)}
            disabled={filtersLoading}
            compact
          />
          <FilterDropdown
            label="State"
            placeholder="All"
            options={filterOptions.states}
            value={selectedState}
            onChange={(value) => setSelectedState(value as string)}
            disabled={filtersLoading}
            compact
          />
          <FilterDropdown
            label="Crops"
            placeholder="All"
            options={filterOptions.crops}
            value={selectedCrops}
            onChange={(value) => setSelectedCrops(value as string[])}
            multiSelect
            disabled={filtersLoading}
            compact
          />
        </div>
      </div>

      {/* Error Display */}
      {(error || linkError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error || linkError}</p>
          {error && (
            <button onClick={refetch} className="p-1 hover:bg-red-100 rounded" title="Retry">
              <RefreshCw size={14} className="text-red-600" />
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-slate-500 text-sm">Loading farmers...</p>
          </div>
        </div>
      )}

      {/* Farmers Grid */}
      {!loading && (
        <>
          {farmers.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl">
              <Users size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">No farmers available</h3>
              <p className="text-sm text-slate-500">
                {searchInput || selectedDistrict || selectedState || selectedCrops.length > 0
                  ? 'No farmers match your filters.'
                  : 'All farmers are currently assigned.'}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="text-xs text-slate-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </div>

              {/* Compact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {farmers.map((farmer) => {
                  const profile = farmer.profiles as any;
                  const location = [farmer.district, farmer.state].filter(Boolean).join(', ');

                  return (
                    <motion.div
                      key={farmer.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-2.5 mb-2">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {profile?.full_name?.charAt(0).toUpperCase() || 'F'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">
                            {profile?.full_name || 'Unknown'}
                          </p>
                          {farmer.farm_name && (
                            <p className="text-[10px] text-slate-500 truncate">{farmer.farm_name}</p>
                          )}
                        </div>
                      </div>

                      {/* Details - Compact */}
                      <div className="space-y-1 mb-2.5">
                        {location && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <MapPin size={10} className="flex-shrink-0 text-slate-400" />
                            <span className="truncate">{location}</span>
                          </div>
                        )}
                        {profile?.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Phone size={10} className="flex-shrink-0 text-slate-400" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {farmer.current_crops && farmer.current_crops.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Wheat size={10} className="flex-shrink-0 text-slate-400" />
                            <span className="truncate">
                              {farmer.current_crops.slice(0, 2).join(', ')}
                              {farmer.current_crops.length > 2 && ` +${farmer.current_crops.length - 2}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Link Button */}
                      <button
                        onClick={() => handleLinkFarmer(farmer)}
                        disabled={linkingFarmerId === farmer.id}
                        className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        {linkingFarmerId === farmer.id ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            Linking...
                          </>
                        ) : (
                          'Link Farmer'
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setPage(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>

                  <span className="text-xs text-slate-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
