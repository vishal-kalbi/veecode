import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiCode, FiAward, FiZap } from 'react-icons/fi';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 animate-fadeIn">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
          Master Coding with{' '}
          <span className="text-green-400">VeeCode</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Solve coding challenges, sharpen your skills, and track your progress.
          Support for 11+ programming languages with instant code execution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/challenges"
            className="bg-green-600 hover:bg-green-500 text-white text-lg px-8 py-3 rounded-lg transition font-medium"
          >
            Start Solving
          </Link>
          {!user && (
            <Link
              to="/signup"
              className="bg-gray-700 hover:bg-gray-600 text-white text-lg px-8 py-3 rounded-lg transition font-medium"
            >
              Create Account
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-800 rounded-xl p-6">
            <FiCode className="text-green-400 text-3xl mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">15+ Challenges</h3>
            <p className="text-gray-400 text-sm">
              From easy warm-ups to hard algorithmic puzzles across various topics.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <FiZap className="text-green-400 text-3xl mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Instant Execution</h3>
            <p className="text-gray-400 text-sm">
              Write and run code directly in the browser with real-time feedback.
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <FiAward className="text-green-400 text-3xl mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm">
              Monitor your solving streak and see detailed submission history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
