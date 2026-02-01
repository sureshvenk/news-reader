import { CATEGORIES } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (category: string | undefined) => void;
  isLoading?: boolean;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  isLoading = false,
}: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          disabled={isLoading}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isLoading}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};
