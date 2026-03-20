import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiEye } from 'react-icons/fi';

export default function HintsPanel({ slug }) {
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/hints/${slug}`)
      .then((res) => setHints(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const revealHint = async (hintId, index) => {
    try {
      const res = await api.post(`/hints/${hintId}/reveal`);
      setHints((prev) => prev.map((h, i) => i === index ? { ...h, hint_text: res.data.hint_text, revealed: true } : h));
    } catch {}
  };

  if (loading || hints.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-white font-semibold mb-3">Hints</h3>
      <div className="space-y-2">
        {hints.map((hint, i) => (
          <div key={hint.id} className="bg-gray-800 rounded-lg p-3">
            {hint.revealed ? (
              <p className="text-gray-300 text-sm">{hint.hint_text}</p>
            ) : (
              <button
                onClick={() => revealHint(hint.id, i)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition"
              >
                <FiEye /> Reveal Hint {i + 1}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
