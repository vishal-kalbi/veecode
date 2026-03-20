import { useState } from 'react';
import { FiArrowUp, FiMessageSquare } from 'react-icons/fi';
import CommentForm from './CommentForm';

export default function CommentCard({ comment, onVote, onReply }) {
  const [showReply, setShowReply] = useState(false);

  const handleReply = async (content) => {
    await onReply(comment.id, content);
    setShowReply(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-400 text-sm font-medium">{comment.username}</span>
        <span className="text-gray-500 text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-300 text-sm mb-3">{comment.content}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onVote(comment.id)}
          className={`flex items-center gap-1 text-xs transition ${comment.user_voted ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <FiArrowUp /> {comment.vote_count}
        </button>
        <button
          onClick={() => setShowReply(!showReply)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition"
        >
          <FiMessageSquare /> Reply
        </button>
      </div>

      {showReply && (
        <div className="mt-3">
          <CommentForm onSubmit={handleReply} placeholder="Write a reply..." compact />
        </div>
      )}

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-3 ml-4 pl-4 border-l border-gray-700 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400 text-xs font-medium">{reply.username}</span>
                <span className="text-gray-500 text-xs">{new Date(reply.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-300 text-sm mb-1">{reply.content}</p>
              <button
                onClick={() => onVote(reply.id)}
                className={`flex items-center gap-1 text-xs transition ${reply.user_voted ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <FiArrowUp /> {reply.vote_count}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
