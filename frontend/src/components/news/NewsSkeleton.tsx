export const NewsSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-2" />
        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4" />

        {/* Description Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        {/* Author and Date Skeleton */}
        <div className="flex justify-between mb-4">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>

        {/* Button Skeleton */}
        <div className="h-4 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
  );
};

export const NewsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {Array.from({ length: count }).map((_, index) => (
        <NewsSkeleton key={index} />
      ))}
    </div>
  );
};
