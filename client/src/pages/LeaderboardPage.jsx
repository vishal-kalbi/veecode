import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { FiAward } from 'react-icons/fi';

const RANK_COLORS = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then((res) => {
      setUsers(res.data.users);
    }).catch(() => {}).finally(() => setLoading(false));

    if (user) {
      api.get('/leaderboard/me').then((res) => setMyRank(res.data)).catch(() => {});
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <FiAward className="text-yellow-400" /> Leaderboard
      </h1>

      {myRank && (
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-gray-300">Your Rank: <span className="text-green-400 font-bold text-xl">#{myRank.rank}</span></span>
          <span className="text-gray-400">Score: <span className="text-white font-semibold">{myRank.score}</span></span>
          <span className="text-gray-400">Streak: <span className="text-orange-400 font-semibold">{myRank.current_streak} days</span></span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-3 pr-4 w-16">Rank</th>
                <th className="text-left py-3 pr-4">Username</th>
                <th className="text-left py-3 pr-4">Score</th>
                <th className="text-left py-3 pr-4">Solved</th>
                <th className="text-left py-3 pr-4">Streak</th>
                <th className="text-left py-3">Max Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={`border-b border-gray-800 ${u.id === user?.id ? 'bg-green-900/20 ring-1 ring-green-800' : ''}`}
                >
                  <td className="py-3 pr-4">
                    <span className={`font-bold ${u.rank <= 3 ? RANK_COLORS[u.rank - 1] : 'text-gray-400'}`}>
                      #{u.rank}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-white font-medium">{u.username}</td>
                  <td className="py-3 pr-4 text-green-400 font-semibold">{u.score}</td>
                  <td className="py-3 pr-4 text-gray-300">{u.solved_count}</td>
                  <td className="py-3 pr-4 text-orange-400">{u.current_streak}d</td>
                  <td className="py-3 text-gray-400">{u.max_streak}d</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-gray-400 text-center py-10">No users yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  );
}
