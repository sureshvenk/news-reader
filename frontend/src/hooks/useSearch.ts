import { useCallback, useState } from 'react';
import { useDebounce } from './useDebounce';
import { useNewsSearch } from './useNews';

export function useSearch() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const { data, isLoading, error, isError } = useNewsSearch(debouncedSearch);

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  return {
    searchInput,
    debouncedSearch,
    handleSearch,
    clearSearch,
    data,
    isLoading,
    error,
    isError,
    hasResults: (data?.data?.articles?.length || 0) > 0,
  };
}
