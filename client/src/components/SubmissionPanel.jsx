import { FiPlay, FiSend } from 'react-icons/fi';

export default function SubmissionPanel({ onRun, onSubmit, loading }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-900 border-t border-gray-700">
      <button
        onClick={onRun}
        disabled={loading}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition text-sm"
      >
        <FiPlay />
        {loading ? 'Running...' : 'Run'}
      </button>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition text-sm"
      >
        <FiSend />
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      <span className="text-gray-500 text-xs ml-auto hidden sm:block">
        Ctrl+Enter run &middot; Ctrl+Shift+Enter submit
      </span>
    </div>
  );
}
