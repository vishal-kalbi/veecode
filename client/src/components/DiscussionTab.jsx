import { useState, useEffect } from 'react';
import api from '../api/axios';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

export default function DiscussionTab({ slug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/comments/${slug}`)
      .then((res) => setComments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePost = async (content) => {
    const res = await api.post(`/comments/${slug}`, { content });
    setComments((prev) => [res.data, ...prev]);
  };

  const handleVote = async (commentId) => {
    await api.post(`/comments/${commentId}/vote`);
    setComments((prev) => prev.map((c) => {
      if (c.id === commentId) {
        return { ...c, user_voted: !c.user_voted, vote_count: String(parseInt(c.vote_count) + (c.user_voted ? -1 : 1)) };
      }
      if (c.replies) {
        return { ...c, replies: c.replies.map((r) => r.id === commentId ? { ...r, user_voted: !r.user_voted, vote_count: String(parseInt(r.vote_count) + (r.user_voted ? -1 : 1)) } : r) };
      }
      return c;
    }));
  };

  const handleReply = async (parentId, content) => {
    const res = await api.post(`/comments/${slug}`, { content, parentId });
    setComments((prev) => prev.map((c) =>
      c.id === parentId ? { ...c, replies: [...(c.replies || []), res.data] } : c
    ));
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div></div>;
  }

  return (
    <div className="p-4 space-y-4">
      <CommentForm onSubmit={handlePost} placeholder="Share your thoughts..." />
      {comments.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No discussions yet. Be the first!</p>
      ) : (
        comments.map((c) => (
          <CommentCard key={c.id} comment={c} onVote={handleVote} onReply={handleReply} />
        ))
      )}
    </div>
  );
}
