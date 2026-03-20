import { FiAward, FiZap, FiStar, FiGlobe } from 'react-icons/fi';

const ICON_MAP = {
  trophy: FiAward,
  fire: FiZap,
  star: FiStar,
  flame: FiZap,
  lightning: FiZap,
  crown: FiAward,
  globe: FiGlobe,
};

const ICON_COLORS = {
  trophy: 'text-yellow-400',
  fire: 'text-orange-400',
  star: 'text-yellow-300',
  flame: 'text-orange-500',
  lightning: 'text-blue-400',
  crown: 'text-purple-400',
  globe: 'text-green-400',
};

export default function BadgeDisplay({ badges }) {
  if (!badges || badges.length === 0) {
    return <p className="text-gray-500 text-sm">No badges earned yet. Start solving!</p>;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {badges.map((badge) => {
        const Icon = ICON_MAP[badge.icon] || FiAward;
        const color = ICON_COLORS[badge.icon] || 'text-gray-400';
        return (
          <div
            key={badge.slug}
            className="bg-gray-700 rounded-lg p-3 min-w-[120px] flex flex-col items-center text-center shrink-0"
          >
            <Icon className={`text-2xl ${color} mb-2`} />
            <span className="text-white text-xs font-medium">{badge.name}</span>
            <span className="text-gray-400 text-[10px] mt-1">{badge.description}</span>
          </div>
        );
      })}
    </div>
  );
}
