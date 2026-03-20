export default function SkeletonProfile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="h-7 bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-36 mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-4 h-20"></div>
          ))}
        </div>
      </div>
      <div className="h-6 bg-gray-700 rounded w-52 mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-800 rounded mb-2"></div>
      ))}
    </div>
  );
}
