import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function SolutionsTab({ slug, hasSolved }) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!hasSolved) { setLoading(false); return; }
    api.get(`/submissions/community/${slug}`)
      .then((res) => setSolutions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, hasSolved]);

  if (!hasSolved) {
    return <p className="text-gray-400 text-center py-10">Solve this challenge first to see community solutions.</p>;
  }

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div></div>;
  }

  if (solutions.length === 0) {
    return <p className="text-gray-400 text-center py-10">No solutions yet.</p>;
  }

  return (
    <div className="space-y-3 p-4">
      {solutions.map((s) => (
        <div key={s.id} className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === s.id ? null : s.id)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-750 transition text-sm"
          >
            <span className="text-gray-300">{s.username} — <span className="text-green-400">{s.language_name}</span></span>
            <span className="text-gray-500 text-xs">{s.execution_time?.toFixed(3)}s | {Math.round(s.memory_used || 0)}KB</span>
          </button>
          {expanded === s.id && (
            <pre className="px-4 pb-4 text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-auto max-h-64 border-t border-gray-700">
              {s.source_code}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
