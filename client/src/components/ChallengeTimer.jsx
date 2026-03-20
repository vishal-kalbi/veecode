import { useState, useEffect, useRef } from 'react';
import { FiClock, FiPause, FiPlay } from 'react-icons/fi';

export default function ChallengeTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const time = `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono">
      <FiClock className="text-gray-500" />
      <span>{time}</span>
      <button
        onClick={() => setRunning(!running)}
        className="text-gray-500 hover:text-gray-300 transition"
      >
        {running ? <FiPause /> : <FiPlay />}
      </button>
    </div>
  );
}
