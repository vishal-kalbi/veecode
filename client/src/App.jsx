import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChallengeListPage from './pages/ChallengeListPage';
import ChallengePage from './pages/ChallengePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminChallengesPage from './pages/AdminChallengesPage';
import AdminChallengeFormPage from './pages/AdminChallengeFormPage';
import SharedSolutionPage from './pages/SharedSolutionPage';
import ReplayPage from './pages/ReplayPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/challenges" element={<ChallengeListPage />} />
            <Route path="/challenges/:slug" element={<ChallengePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/challenges" element={<AdminRoute><AdminChallengesPage /></AdminRoute>} />
            <Route path="/admin/challenges/new" element={<AdminRoute><AdminChallengeFormPage /></AdminRoute>} />
            <Route path="/admin/challenges/:id/edit" element={<AdminRoute><AdminChallengeFormPage /></AdminRoute>} />
            <Route path="/share/:token" element={<SharedSolutionPage />} />
            <Route path="/replays/:id" element={<ProtectedRoute><ReplayPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
