const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function LanguagePieChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm">No language data yet.</p>;
  }

  const total = data.reduce((sum, d) => sum + parseInt(d.count), 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = parseInt(d.count) / total;
    const dashLength = pct * circumference;
    const seg = { ...d, color: COLORS[i % COLORS.length], dashLength, offset, pct };
    offset += dashLength;
    return seg;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={140} height={140} viewBox="0 0 140 140">
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={20}
            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
            strokeDashoffset={-seg.offset}
            transform="rotate(-90 70 70)"
          />
        ))}
      </svg>
      <div className="space-y-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-300">{seg.language_name}</span>
            <span className="text-gray-500">({seg.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
