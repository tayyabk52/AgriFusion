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

  // Update search with debouncing handled by the hook
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSearch(value);
  };

  // Update filters
  const handleFiltersChange = () => {
    setFilters({
      district: selectedDistrict || undefined,
      state: selectedState || undefined,
      crops: selectedCrops.length > 0 ? selectedCrops : undefined,
    });
  };

  // Apply filters when they change
  React.useEffect(() => {
    handleFiltersChange();
  }, [selectedDistrict, selectedState, selectedCrops]);

  const handleLinkFarmer = async (farmer: FarmerWithProfile) => {
    setLinkingFarmerId(farmer.id);
    setLinkError(null);

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Call API route
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

      // Success! Refresh the list and notify parent
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Browse Available Farmers
        </h3>
        <p className="text-sm text-slate-600">
          Select from farmers who have registered but are not yet linked to a consultant
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name, location, phone, or email..."
          className="w-full px-4 py-3 pl-11 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {searchInput && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilterDropdown
          label="District"
          placeholder="All districts"
          options={filterOptions.districts}
          value={selectedDistrict}
          onChange={(value) => setSelectedDistrict(value as string)}
          disabled={filtersLoading}
        />
        <FilterDropdown
          label="State"
          placeholder="All states"
          options={filterOptions.states}
          value={selectedState}
          onChange={(value) => setSelectedState(value as string)}
          disabled={filtersLoading}
        />
        <FilterDropdown
          label="Crops"
          placeholder="All crops"
          options={filterOptions.crops}
          value={selectedCrops}
          onChange={(value) => setSelectedCrops(value as string[])}
          multiSelect
          disabled={filtersLoading}
        />
      </div>

      {/* Error Display */}
      {(error || linkError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error || linkError}</p>
          </div>
          {error && (
            <button
              onClick={refetch}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              title="Retry"
            >
              <RefreshCw size={16} className="text-red-600" />
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-600">Loading farmers...</p>
          </div>
        </div>
      )}

      {/* Farmers Grid */}
      {!loading && (
        <>
          {farmers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No farmers available
              </h3>
              <p className="text-slate-500">
                {searchInput || selectedDistrict || selectedState || selectedCrops.length > 0
                  ? 'No farmers match your search criteria. Try adjusting your filters.'
                  : 'All farmers are currently assigned to consultants.'}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between text-sm text-slate-600">
                <p>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} -{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} farmers
                </p>
              </div>

              {/* Farmers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {farmers.map((farmer) => {
                  const profile = farmer.profiles as any;
                  const location = [farmer.district, farmer.state]
                    .filter(Boolean)
                    .join(', ') || 'Not specified';

                  return (
                    <motion.div
                      key={farmer.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Avatar and Name */}
                        <div className="flex items-start gap-3">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                              {profile?.full_name?.charAt(0).toUpperCase() || 'F'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {profile?.full_name || 'Unknown'}
                            </p>
                            {farmer.farm_name && (
                              <p className="text-xs text-slate-500 truncate">
                                {farmer.farm_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5">
                          {location !== 'Not specified' && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <MapPin size={12} className="flex-shrink-0" />
                              <span className="truncate">{location}</span>
                            </div>
                          )}
                          {profile?.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone size={12} className="flex-shrink-0" />
                              <span>{profile.phone}</span>
                            </div>
                          )}
                          {farmer.current_crops && farmer.current_crops.length > 0 && (
                            <div className="text-xs text-slate-600">
                              <span className="font-medium">Crops:</span>{' '}
                              {farmer.current_crops.slice(0, 2).join(', ')}
                              {farmer.current_crops.length > 2 && ` +${farmer.current_crops.length - 2}`}
                            </div>
                          )}
                        </div>

                        {/* Link Button */}
                        <button
                          onClick={() => handleLinkFarmer(farmer)}
                          disabled={linkingFarmerId === farmer.id}
                          className="w-full px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {linkingFarmerId === farmer.id ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Linking...
                            </>
                          ) : (
                            'Link Farmer'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setPage(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="text-sm text-slate-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={16} />
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
