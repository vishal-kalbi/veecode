import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 animate-fadeIn">
      <FiAlertTriangle className="text-green-400 text-6xl mb-6" />
      <h1 className="text-8xl font-bold text-green-400 mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page not found</p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition font-medium"
      >
        Go Home
      </Link>
    </div>
  );
}
