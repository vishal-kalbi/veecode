const SHADES = ['#1a1a2e', '#14532d', '#166534', '#16a34a', '#22c55e'];

function getShade(count) {
  if (!count) return SHADES[0];
  if (count === 1) return SHADES[1];
  if (count <= 3) return SHADES[2];
  if (count <= 5) return SHADES[3];
  return SHADES[4];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ActivityHeatmap({ data }) {
  const countMap = {};
  (data || []).forEach((d) => {
    const dateStr = new Date(d.date).toISOString().split('T')[0];
    countMap[dateStr] = parseInt(d.count);
  });

  const today = new Date();
  const weeks = [];
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - 364);
  // Align to Sunday
  startDay.setDate(startDay.getDate() - startDay.getDay());

  let current = new Date(startDay);
  while (current <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split('T')[0];
      week.push({ date: dateStr, count: countMap[dateStr] || 0, future: current > today });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = new Date(week[0].date);
    if (firstDay.getMonth() !== lastMonth) {
      lastMonth = firstDay.getMonth();
      monthLabels.push({ index: i, label: MONTHS[lastMonth] });
    }
  });

  return (
    <div className="overflow-x-auto">
      <svg width={weeks.length * 14 + 30} height={110}>
        {/* Month labels */}
        {monthLabels.map((m) => (
          <text key={m.index} x={m.index * 14 + 30} y={10} className="fill-gray-500" fontSize={10}>
            {m.label}
          </text>
        ))}
        {/* Grid */}
        {weeks.map((week, wi) =>
          week.map((day, di) => (
            !day.future && (
              <rect
                key={day.date}
                x={wi * 14 + 30}
                y={di * 14 + 16}
                width={11}
                height={11}
                rx={2}
                fill={getShade(day.count)}
              >
                <title>{day.date}: {day.count} solve{day.count !== 1 ? 's' : ''}</title>
              </rect>
            )
          ))
        )}
        {/* Day labels */}
        {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
          label && <text key={i} x={0} y={i * 14 + 25} className="fill-gray-500" fontSize={10}>{label}</text>
        ))}
      </svg>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
        Less
        {SHADES.map((color, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
        ))}
        More
      </div>
    </div>
  );
}
