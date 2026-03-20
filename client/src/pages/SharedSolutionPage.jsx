import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import CodeEditor from '../components/CodeEditor';
import { LANGUAGES } from '../utils/constants';

export default function SharedSolutionPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/share/${token}`)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-gray-400 py-20">Shared solution not found</div>;
  }

  const lang = LANGUAGES.find((l) => l.name === data.language_name);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h1 className="text-xl font-bold text-white mb-2">
          Shared Solution for{' '}
          <Link to={`/challenges/${data.slug}`} className="text-green-400 hover:underline">
            {data.title}
          </Link>
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>By <span className="text-green-400">{data.username}</span></span>
          <span>{data.language_name}</span>
          <span className={data.status === 'accepted' ? 'text-green-400' : 'text-red-400'}>{data.status}</span>
          <span>{data.passed_count}/{data.total_count} tests</span>
          {data.execution_time && <span>{data.execution_time.toFixed(3)}s</span>}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden" style={{ height: 400 }}>
        <CodeEditor
          language={lang?.monacoLang || 'python'}
          value={data.source_code}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
