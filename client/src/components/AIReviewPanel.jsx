import { useState, useEffect } from 'react';
import api from '../api/axios';
import ReactMarkdown from 'react-markdown';
import { FiCpu, FiChevronDown, FiChevronRight, FiZap, FiAlertCircle, FiLayers } from 'react-icons/fi';

function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-750 transition text-left"
      >
        {open ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
        <Icon className="text-green-400" />
        <span className="text-white font-medium text-sm">{title}</span>
      </button>
      {open && <div className="px-4 py-3 text-sm text-gray-300">{children}</div>}
    </div>
  );
}

export default function AIReviewPanel({ slug, hasSolved }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  // Find latest accepted submission
  useEffect(() => {
    if (!hasSolved) return;
    api.get(`/submissions/challenge/${slug}`)
      .then((res) => {
        const accepted = res.data.find((s) => s.status === 'accepted');
        if (accepted) {
          setSubmissionId(accepted.id);
          // Try to load cached review
          api.get(`/reviews/${accepted.id}`)
            .then((r) => setReview(r.data.review_content))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [slug, hasSolved]);

  const requestReview = async () => {
    if (!submissionId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/reviews/${submissionId}`);
      setReview(res.data.review_content);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get AI review');
    } finally {
      setLoading(false);
    }
  };

  if (!hasSolved) {
    return <p className="text-gray-400 text-center py-10">Solve this challenge first to get AI feedback.</p>;
  }

  const content = typeof review === 'string' ? JSON.parse(review) : review;

  if (!content) {
    return (
      <div className="text-center py-10">
        <FiCpu className="text-4xl text-green-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-4">Get personalized AI feedback on your solution</p>
        <button
          onClick={requestReview}
          disabled={loading || !submissionId}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Analyzing...
            </span>
          ) : (
            'Get AI Review'
          )}
        </button>
        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="py-2">
      <Section title="Complexity Analysis" icon={FiZap} defaultOpen={true}>
        {content.complexity && (
          <>
            <div className="flex gap-6 mb-3">
              <div>
                <span className="text-gray-500 text-xs">Time</span>
                <p className="text-green-400 font-mono">{content.complexity.time}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Space</span>
                <p className="text-green-400 font-mono">{content.complexity.space}</p>
              </div>
            </div>
            {content.complexity.optimal !== undefined && (
              <p className={content.complexity.optimal ? 'text-green-400' : 'text-yellow-400'}>
                {content.complexity.optimal ? '✓ This is an optimal solution' : '⚡ This can be further optimized'}
              </p>
            )}
            {content.complexity.notes && <p className="mt-2 text-gray-400">{content.complexity.notes}</p>}
          </>
        )}
      </Section>

      <Section title="Code Quality" icon={FiAlertCircle} defaultOpen={true}>
        {content.quality && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-500 text-xs">Score:</span>
              <span className={`font-bold text-lg ${content.quality.score >= 7 ? 'text-green-400' : content.quality.score >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                {content.quality.score}/10
              </span>
            </div>
            {content.quality.strengths?.length > 0 && (
              <div className="mb-2">
                <span className="text-green-400 text-xs font-medium">Strengths</span>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {content.quality.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {content.quality.issues?.length > 0 && (
              <div className="mb-2">
                <span className="text-red-400 text-xs font-medium">Issues</span>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {content.quality.issues.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {content.quality.suggestions?.length > 0 && (
              <div>
                <span className="text-yellow-400 text-xs font-medium">Suggestions</span>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {content.quality.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </>
        )}
      </Section>

      <Section title="Optimization Ideas" icon={FiZap}>
        {content.optimizations?.length > 0 ? (
          <div className="space-y-3">
            {content.optimizations.map((opt, i) => (
              <div key={i} className="bg-gray-800 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm">{opt.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    opt.impact === 'high' ? 'bg-red-900 text-red-300' :
                    opt.impact === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-700 text-gray-400'
                  }`}>{opt.impact}</span>
                </div>
                <p className="text-gray-400 text-sm">{opt.description}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500">No optimizations suggested — great job!</p>}
      </Section>

      <Section title="Alternative Approaches" icon={FiLayers}>
        {content.alternatives?.length > 0 ? (
          <div className="space-y-3">
            {content.alternatives.map((alt, i) => (
              <div key={i} className="bg-gray-800 rounded p-3">
                <span className="text-white font-medium text-sm">{alt.approach}</span>
                <p className="text-gray-400 text-sm mt-1">{alt.description}</p>
                {alt.tradeoffs && <p className="text-gray-500 text-xs mt-1">Tradeoffs: {alt.tradeoffs}</p>}
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500">No alternative approaches suggested.</p>}
      </Section>

      <button
        onClick={requestReview}
        disabled={loading}
        className="text-xs text-gray-500 hover:text-gray-300 mt-2 transition"
      >
        {loading ? 'Re-analyzing...' : '↻ Re-analyze with latest submission'}
      </button>
    </div>
  );
}
