import { FiLock } from 'react-icons/fi';

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'solutions', label: 'Solutions' },
  { key: 'submissions', label: 'Submissions' },
  { key: 'discussion', label: 'Discussion' },
  { key: 'ai-review', label: 'AI Review', lockUnlessSolved: true },
];

export default function ChallengeTabs({ activeTab, onChange, hasSolved }) {
  return (
    <div className="flex border-b border-gray-700">
      {TABS.map((tab) => {
        const locked = (tab.key === 'solutions' || tab.lockUnlessSolved) && !hasSolved;
        return (
          <button
            key={tab.key}
            onClick={() => !locked && onChange(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium flex items-center gap-1.5 transition ${
              activeTab === tab.key
                ? 'text-green-400 border-b-2 border-green-400'
                : locked
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
            {locked && <FiLock className="text-xs" />}
          </button>
        );
      })}
    </div>
  );
}
