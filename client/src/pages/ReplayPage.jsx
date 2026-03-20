import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ReplayPlayer from '../components/ReplayPlayer';
import { LANGUAGES } from '../utils/constants';

export default function ReplayPage() {
  const { id } = useParams();
  const [replay, setReplay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/replays/${id}`)
      .then((res) => setReplay(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!replay) {
    return <div className="text-center text-gray-400 py-20">Replay not found</div>;
  }

  const lang = LANGUAGES.find((l) => l.name === replay.language_name);
  const snapshots = typeof replay.snapshots === 'string' ? JSON.parse(replay.snapshots) : replay.snapshots;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-2">
          Code Replay —{' '}
          <Link to={`/challenges/${replay.challenge_slug}`} className="text-green-400 hover:underline">
            {replay.challenge_title}
          </Link>
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>By <span className="text-green-400">{replay.username}</span></span>
          <span>{replay.language_name}</span>
          <span>{Math.round(replay.duration_ms / 1000)}s total</span>
          <span>{snapshots.length} snapshots</span>
        </div>
      </div>

      <div style={{ height: 'calc(100vh - 14rem)' }}>
        <ReplayPlayer
          snapshots={snapshots}
          durationMs={replay.duration_ms}
          language={lang?.monacoLang || 'python'}
        />
      </div>
    </div>
  );
}
