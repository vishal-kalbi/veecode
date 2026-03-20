import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { DIFFICULTY_COLORS } from '../utils/constants';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchChallenges = () => {
    api.get('/admin/challenges')
      .then((res) => setChallenges(res.data))
      .catch(() => toast.error('Failed to load challenges'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchChallenges, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/challenges/${deleteTarget}`);
      setChallenges((prev) => prev.filter((c) => c.id !== deleteTarget));
      toast.success('Challenge deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Challenges</h1>
        <Link
          to="/admin/challenges/new"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition text-sm"
        >
          + Create Challenge
        </Link>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Challenge?"
        message="This will permanently delete the challenge and all its test cases and submissions."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-800 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-3 pr-4">ID</th>
                <th className="text-left py-3 pr-4">Title</th>
                <th className="text-left py-3 pr-4">Difficulty</th>
                <th className="text-left py-3 pr-4">Topic</th>
                <th className="text-left py-3 pr-4">Tests</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((c) => (
                <tr key={c.id} className="border-b border-gray-800">
                  <td className="py-3 pr-4 text-gray-500">{c.id}</td>
                  <td className="py-3 pr-4 text-white">{c.title}</td>
                  <td className="py-3 pr-4">
                    <span style={{ color: DIFFICULTY_COLORS[c.difficulty] }}>{c.difficulty}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-300">{c.topic}</td>
                  <td className="py-3 pr-4 text-gray-300">{c.test_count}</td>
                  <td className="py-3 flex gap-2">
                    <Link to={`/admin/challenges/${c.id}/edit`} className="text-blue-400 hover:underline text-xs">Edit</Link>
                    <button onClick={() => setDeleteTarget(c.id)} className="text-red-400 hover:underline text-xs">Delete</button>
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
