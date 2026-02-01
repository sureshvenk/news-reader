import { truncateText } from '../../utils/formatDate';

export const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-blue-600">📰</div>
            <h1 className="text-xl font-bold text-gray-900">News Reader</h1>
          </div>
          <p className="hidden sm:block text-sm text-gray-600">Stay updated with the latest news</p>
        </div>
      </div>
    </header>
  );
};
