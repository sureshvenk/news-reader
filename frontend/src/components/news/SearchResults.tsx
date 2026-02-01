interface SearchResultsHeaderProps {
  query: string;
  resultCount: number;
  onClear?: () => void;
}

export const SearchResultsHeader = ({
  query,
  resultCount,
  onClear,
}: SearchResultsHeaderProps) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-sm text-gray-600">Search Results for</p>
          <h2 className="text-2xl font-bold text-gray-900">"{query}"</h2>
          <p className="text-sm text-gray-600 mt-1">
            {resultCount} {resultCount === 1 ? 'article found' : 'articles found'}
          </p>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
};
