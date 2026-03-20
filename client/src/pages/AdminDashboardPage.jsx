import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiUsers, FiCode, FiSend, FiCheck } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: FiUsers, color: 'text-blue-400' },
    { label: 'Total Challenges', value: stats?.total_challenges || 0, icon: FiCode, color: 'text-green-400' },
    { label: 'Submissions Today', value: stats?.submissions_today || 0, icon: FiSend, color: 'text-orange-400' },
    { label: 'Accepted Today', value: stats?.accepted_today || 0, icon: FiCheck, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-gray-800 rounded-lg p-5">
            <card.icon className={`text-2xl ${card.color} mb-2`} />
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-gray-400 text-sm">{card.label}</div>
          </div>
        ))}
      </div>

      <Link
        to="/admin/challenges"
        className="inline-block bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition font-medium"
      >
        Manage Challenges
      </Link>
    </div>
  );
}
