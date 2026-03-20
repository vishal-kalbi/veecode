import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { FiMenu, FiX, FiCode } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const navClass = (path) => `${isActive(path) ? 'text-green-400 font-medium' : 'text-gray-300 hover:text-white'} transition`;
  const mobileNavClass = (path) => `block ${isActive(path) ? 'text-green-400 font-medium' : 'text-gray-300 hover:text-white'} py-2`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-green-400">
            <FiCode className="text-2xl" />
            VeeCode
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/challenges" className={navClass('/challenges')}>
              Challenges
            </Link>
            <Link to="/leaderboard" className={navClass('/leaderboard')}>
              Leaderboard
            </Link>
            {user ? (
              <>
                <Link to="/profile" className={navClass('/profile')}>
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={navClass('/admin')}>
                    Admin
                  </Link>
                )}
                <span className="text-gray-400">Hi, {user.username}</span>
                <button
                  onClick={logout}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 text-2xl"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/challenges"
              className={mobileNavClass('/challenges')}
              onClick={() => setMenuOpen(false)}
            >
              Challenges
            </Link>
            <Link
              to="/leaderboard"
              className={mobileNavClass('/leaderboard')}
              onClick={() => setMenuOpen(false)}
            >
              Leaderboard
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={mobileNavClass('/profile')}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="block text-gray-300 hover:text-white py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-300 hover:text-white py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-gray-300 hover:text-white py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
