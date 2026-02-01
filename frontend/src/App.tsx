import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navigation } from './components/layout/Navigation';
import { Layout } from './components/layout/Layout';
import { SearchBar } from './components/filters/SearchBar';
import { CategoryFilter } from './components/filters/CategoryFilter';
import { NewsGrid } from './components/news/NewsGrid';
import { NewsGridSkeleton } from './components/news/NewsSkeleton';
import { EmptyState } from './components/news/EmptyState';
import { ErrorMessage } from './components/common/ErrorMessage';
import { SearchResultsHeader } from './components/news/SearchResults';
import { useNews, useNewsSearch } from './hooks/useNews';
import { useSearch } from './hooks/useSearch';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
    },
  },
});

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const searchHook = useSearch();
  const isSearching = searchHook.debouncedSearch.length > 0;

  // Use search or regular news based on search input
  const newsQuery = useNews(isSearching ? undefined : selectedCategory, currentPage);
  const searchQuery = useNewsSearch(searchHook.debouncedSearch, currentPage);

  const activeQuery = isSearching ? searchQuery : newsQuery;
  const { data, isLoading, error, isError, refetch } = activeQuery;

  const handleSearch = (query: string) => {
    searchHook.handleSearch(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    searchHook.clearSearch();
    setCurrentPage(1);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <>
      <Navigation />
      <Layout>
        {/* Search and Filters */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Search for news..."
        />

        {!isSearching && (
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isLoading={isLoading}
          />
        )}

        {/* Search Results Header */}
        {isSearching && searchHook.debouncedSearch && (
          <SearchResultsHeader
            query={searchHook.debouncedSearch}
            resultCount={data?.data?.articles?.length || 0}
            onClear={searchHook.clearSearch}
          />
        )}

        {/* Loading State */}
        {isLoading && <NewsGridSkeleton count={6} />}

        {/* Error State */}
        {isError && error && (
          <div className="flex justify-center">
            <ErrorMessage
              title="Failed to load articles"
              message={error.message || 'An error occurred while fetching news articles.'}
              onRetry={handleRetry}
              icon="⚠️"
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!data || data.data.articles.length === 0) && (
          <EmptyState
            title={isSearching ? 'No results found' : 'No articles available'}
            message={
              isSearching
                ? `We couldn't find any articles matching "${searchHook.debouncedSearch}". Try a different search term.`
                : 'Try selecting a different category or searching for something else.'
            }
            icon={isSearching ? '🔍' : '📭'}
            actionLabel={isSearching ? 'Clear Search' : 'Reset'}
            onAction={isSearching ? searchHook.clearSearch : () => setSelectedCategory(undefined)}
          />
        )}

        {/* News Grid */}
        {!isLoading && !isError && data && data.data.articles.length > 0 && (
          <>
            <NewsGrid articles={data.data.articles} />

            {/* Pagination Info */}
            <div className="mt-8 text-center text-gray-600">
              <p>
                Showing {data.data.articles.length} of {data.data.totalResults} articles
              </p>
            </div>

            {/* Load More Button */}
            {data.data.articles.length < data.data.totalResults && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </Layout>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
