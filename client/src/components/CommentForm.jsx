import { useState } from 'react';

export default function CommentForm({ onSubmit, placeholder, compact }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch {} finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 1 : 2}
        className="flex-1 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition text-sm self-end"
      >
        Post
      </button>
    </form>
  );
}
