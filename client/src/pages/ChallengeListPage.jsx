import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeFilters from '../components/ChallengeFilters';
import SkeletonCard from '../components/SkeletonCard';

export default function ChallengeListPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [solvedSlugs, setSolvedSlugs] = useState([]);
  const [filters, setFilters] = useState({ difficulty: '', topic: '', search: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.topic) params.topic = filters.topic;
        if (filters.search) params.search = filters.search;
        params.page = filters.page;

        const res = await api.get('/challenges', { params });
        setChallenges(res.data.challenges);
        setTotalPages(res.data.totalPages);
      } catch {
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, [filters]);

  useEffect(() => {
    if (user) {
      api.get('/users/progress').then((res) => setSolvedSlugs(res.data)).catch(() => {});
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-6">Challenges</h1>
      <ChallengeFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : challenges.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No challenges found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                solved={solvedSlugs.includes(c.slug)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters({ ...filters, page: i + 1 })}
                  className={`px-3 py-1 rounded ${
                    filters.page === i + 1
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
