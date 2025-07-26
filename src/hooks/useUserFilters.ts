import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { UserData, UserFilters, SortConfig } from '../types/user';
import { filterAndSortUsers } from '../utils/userUtils';

interface UseUserFiltersProps {
  users: UserData[];
  debounceDelay?: number;
}

export function useUserFilters({ 
  users, 
  debounceDelay = 300 
}: UseUserFiltersProps) {
  // Immediate state for UI responsiveness
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });

  // Debounced search term for actual filtering
  const debouncedSearchTerm = useDebounce(searchInput, debounceDelay);

  // Create filters object with debounced search
  const filters: UserFilters = useMemo(() => ({
    searchTerm: debouncedSearchTerm,
    roleFilter
  }), [debouncedSearchTerm, roleFilter]);

  // Memoized filtered and sorted users
  const filteredAndSortedUsers = useMemo(() => 
    filterAndSortUsers(users, filters, sortConfig),
    [users, filters, sortConfig]
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };

  const handleSort = (field: SortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    // UI state (immediate updates)
    searchInput,
    roleFilter,
    sortConfig,
    
    // Filtered data (debounced)
    filteredAndSortedUsers,
    filters, // for other components that need the actual filter values
    
    // Handlers
    handleSearchChange,
    handleRoleFilterChange,
    handleSort,
    
    // Status
    isSearching: searchInput !== debouncedSearchTerm,
  };
}