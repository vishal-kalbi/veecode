import { Link } from 'react-router-dom';
import { DIFFICULTY_COLORS } from '../utils/constants';
import { FiCheck } from 'react-icons/fi';

export default function ChallengeCard({ challenge, solved }) {
  return (
    <Link
      to={`/challenges/${challenge.slug}`}
      className="block bg-gray-800 rounded-lg p-5 hover:bg-gray-750 hover:ring-1 hover:ring-gray-600 transition"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
        {solved && (
          <span className="text-green-400 text-xl">
            <FiCheck />
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            color: DIFFICULTY_COLORS[challenge.difficulty],
            backgroundColor: `${DIFFICULTY_COLORS[challenge.difficulty]}20`,
          }}
        >
          {challenge.difficulty}
        </span>
        <span className="text-xs text-gray-400 bg-gray-700 px-2.5 py-1 rounded-full">
          {challenge.topic}
        </span>
      </div>
    </Link>
  );
}
