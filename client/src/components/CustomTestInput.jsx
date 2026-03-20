import { useState } from 'react';
import api from '../api/axios';
import { FiPlay } from 'react-icons/fi';

export default function CustomTestInput({ slug, languageId, code }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const res = await api.post('/submissions/run-custom', {
        challengeSlug: slug,
        languageId,
        sourceCode: code,
        customInput: input,
      });
      setOutput(res.data);
    } catch (err) {
      setOutput({ stderr: err.response?.data?.error || 'Execution failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="text-gray-500 text-xs hover:text-gray-300 px-3 py-1.5 transition"
      >
        Custom Input
      </button>
    );
  }

  return (
    <div className="bg-gray-850 border-t border-gray-700 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-xs font-medium">Custom Input</span>
        <button onClick={() => setShow(false)} className="text-gray-500 text-xs hover:text-gray-300">Hide</button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter custom input..."
        rows={3}
        className="w-full bg-gray-900 text-white text-xs font-mono px-3 py-2 rounded border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
      />
      <button
        onClick={handleRun}
        disabled={loading}
        className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded transition"
      >
        <FiPlay /> {loading ? 'Running...' : 'Run Custom'}
      </button>
      {output && (
        <div className="bg-gray-900 rounded p-2 text-xs font-mono">
          {output.stdout && <div className="text-green-300 whitespace-pre-wrap">{output.stdout}</div>}
          {output.stderr && <div className="text-red-300 whitespace-pre-wrap">{output.stderr}</div>}
          {output.compile_output && <div className="text-yellow-300 whitespace-pre-wrap">{output.compile_output}</div>}
          {output.time != null && <div className="text-gray-500 mt-1">{output.time}s | {Math.round(output.memory || 0)}KB</div>}
        </div>
      )}
    </div>
  );
}
