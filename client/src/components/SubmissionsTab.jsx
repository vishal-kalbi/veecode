import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiPlay } from 'react-icons/fi';

export default function SubmissionsTab({ slug, onLoadCode }) {
  const [submissions, setSubmissions] = useState([]);
  const [replays, setReplays] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/submissions/challenge/${slug}`),
      api.get(`/replays/my/${slug}`).catch(() => ({ data: [] })),
    ]).then(([subsRes, replaysRes]) => {
      setSubmissions(subsRes.data);
      const replayMap = {};
      replaysRes.data.forEach((r) => { if (r.submission_id) replayMap[r.submission_id] = r.id; });
      setReplays(replayMap);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div></div>;
  }

  if (submissions.length === 0) {
    return <p className="text-gray-400 text-center py-10">No submissions yet for this challenge.</p>;
  }

  return (
    <div className="p-4 space-y-2">
      {submissions.map((s) => (
        <div key={s.id} className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className={s.status === 'accepted' ? 'text-green-400' : 'text-red-400'}>
              {s.status?.replace(/_/g, ' ')}
            </span>
            <span className="text-gray-400">{s.language_name}</span>
            <span className="text-gray-500">{s.passed_count}/{s.total_count}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs">{new Date(s.created_at).toLocaleString()}</span>
            {replays[s.id] && (
              <Link
                to={`/replays/${replays[s.id]}`}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
              >
                <FiPlay size={10} /> Replay
              </Link>
            )}
            {s.source_code && (
              <button
                onClick={() => onLoadCode(s.source_code)}
                className="text-green-400 hover:text-green-300 text-xs underline"
              >
                Load
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
