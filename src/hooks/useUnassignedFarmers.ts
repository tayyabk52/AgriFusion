import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FarmerWithProfile } from '@/types/farmer';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FilterOptions {
  district?: string;
  state?: string;
  crops?: string[];
}

interface UseUnassignedFarmersResult {
  farmers: FarmerWithProfile[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilters: (filters: FilterOptions) => void;
}

/**
 * Custom hook for fetching unassigned farmers with pagination, search, and filtering
 *
 * @param initialPage - Starting page number (default: 1)
 * @param initialLimit - Items per page (default: 12)
 * @returns Object with farmers data, loading state, pagination info, and control functions
 */
export function useUnassignedFarmers(
  initialPage: number = 1,
  initialLimit: number = 12
): UseUnassignedFarmersResult {
  const [farmers, setFarmers] = useState<FarmerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearchState] = useState('');
  const [filters, setFiltersState] = useState<FilterOptions>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [search]);

  const fetchFarmers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
      });

      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }

      if (filters.district) {
        params.append('district', filters.district);
      }

      if (filters.state) {
        params.append('state', filters.state);
      }

      if (filters.crops && filters.crops.length > 0) {
        params.append('crops', filters.crops.join(','));
      }

      // Call API route
      const response = await fetch(`/api/farmers/unassigned?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch farmers');
      }

      const data = await response.json();
      setFarmers(data.farmers || []);
      setPagination(data.pagination);

    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load farmers. Please try again.');
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters, initialLimit]);

  // Fetch farmers when dependencies change
  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  // Update search with immediate state update
  const setSearch = useCallback((searchQuery: string) => {
    setSearchState(searchQuery);
  }, []);

  // Update filters
  const setFilters = useCallback((newFilters: FilterOptions) => {
    setFiltersState(newFilters);
    setPage(1); // Reset to first page on filter change
  }, []);

  return {
    farmers,
    loading,
    error,
    pagination,
    refetch: fetchFarmers,
    setPage,
    setSearch,
    setFilters,
  };
}
