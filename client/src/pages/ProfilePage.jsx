import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { DIFFICULTY_COLORS } from '../utils/constants';
import SkeletonProfile from '../components/SkeletonProfile';
import ActivityHeatmap from '../components/ActivityHeatmap';
import BadgeDisplay from '../components/BadgeDisplay';
import LanguagePieChart from '../components/LanguagePieChart';
import { FiZap } from 'react-icons/fi';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/profile'),
      api.get('/users/submissions'),
    ])
      .then(([profileRes, subsRes]) => {
        setProfile(profileRes.data);
        setSubmissions(subsRes.data.submissions);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonProfile />;
  }

  const stats = profile?.stats;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* User info + stats */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">{user?.username}</h1>
        <p className="text-gray-400 text-sm">
          Member since {new Date(user?.created_at).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats?.totalSolved || 0}</div>
            <div className="text-gray-400 text-sm">Total Solved</div>
          </div>
          {['easy', 'medium', 'hard'].map((diff) => (
            <div key={diff} className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: DIFFICULTY_COLORS[diff] }}>
                {stats?.byDifficulty?.[diff] || 0}
              </div>
              <div className="text-gray-400 text-sm capitalize">{diff}</div>
            </div>
          ))}
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
              <FiZap /> {profile?.streak?.current || 0}
            </div>
            <div className="text-gray-400 text-sm">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Activity</h2>
        <ActivityHeatmap data={profile?.activityData} />
      </div>

      {/* Badges + Language Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Badges</h2>
          <BadgeDisplay badges={profile?.badges} />
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Languages</h2>
          <LanguagePieChart data={profile?.languageBreakdown} />
        </div>
      </div>

      {/* Submissions */}
      <h2 className="text-xl font-bold text-white mb-4">Recent Submissions</h2>
      {submissions.length === 0 ? (
        <p className="text-gray-400">No submissions yet. Start solving challenges!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-3 pr-4">Challenge</th>
                <th className="text-left py-3 pr-4">Language</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-left py-3 pr-4">Tests</th>
                <th className="text-left py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-gray-800">
                  <td className="py-3 pr-4">
                    <Link to={`/challenges/${s.slug}`} className="text-green-400 hover:underline">
                      {s.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-300">{s.language_name}</td>
                  <td className="py-3 pr-4">
                    <span className={s.status === 'accepted' ? 'text-green-400' : 'text-red-400'}>
                      {s.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-300">
                    {s.passed_count}/{s.total_count}
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
