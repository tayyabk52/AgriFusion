import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface FilterOptions {
  districts: string[];
  states: string[];
  crops: string[];
}

interface UseFiltersResult {
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching available filter options from unassigned farmers
 *
 * @returns Object with filter options (districts, states, crops), loading state, and refetch function
 */
export function useFilters(): UseFiltersResult {
  const [filters, setFilters] = useState<FilterOptions>({
    districts: [],
    states: [],
    crops: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated. Please log in again.');
      }

      // Call API route
      const response = await fetch('/api/farmers/filters', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch filter options');
      }

      const data = await response.json();
      setFilters({
        districts: data.districts || [],
        states: data.states || [],
        crops: data.crops || [],
      });

    } catch (err: any) {
      console.error('Fetch filters error:', err);
      setError(err.message || 'Failed to load filter options');
      setFilters({
        districts: [],
        states: [],
        crops: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch filters on mount
  useEffect(() => {
    fetchFilters();
  }, []);

  return {
    filters,
    loading,
    error,
    refetch: fetchFilters,
  };
}
