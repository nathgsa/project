// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen p-8 space-y-6 bg-gray-100">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-6 w-2/3 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Cards / Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Table / Results Skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-1/4 bg-gray-300 rounded animate-pulse"></div>
        <div className="overflow-x-auto">
          <div className="h-48 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
