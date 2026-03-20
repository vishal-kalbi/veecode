export default function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-lg p-5 animate-pulse">
      <div className="h-5 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="flex items-center gap-3">
        <div className="h-6 bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-700 rounded-full w-20"></div>
      </div>
    </div>
  );
}
