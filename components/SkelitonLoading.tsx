export default function SkeletonLoading() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
      
      {/* Image Skeleton */}
      <div className="w-full h-64 bg-gray-200" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

    </div>
  );
}