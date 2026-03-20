import { useState, useEffect, useRef, useCallback } from 'react';
import CodeEditor from './CodeEditor';
import { FiPlay, FiPause, FiSkipBack } from 'react-icons/fi';

export default function ReplayPlayer({ snapshots, durationMs, language }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [currentCode, setCurrentCode] = useState(snapshots?.[0]?.c || '');
  const animRef = useRef(null);
  const lastTickRef = useRef(null);

  const updateCode = useCallback((time) => {
    if (!snapshots || snapshots.length === 0) return;
    let closest = snapshots[0];
    for (const snap of snapshots) {
      if (snap.t <= time) closest = snap;
      else break;
    }
    setCurrentCode(closest.c);
  }, [snapshots]);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(animRef.current);
      return;
    }

    lastTickRef.current = Date.now();
    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) * speed;
      lastTickRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= durationMs) {
          setPlaying(false);
          updateCode(durationMs);
          return durationMs;
        }
        updateCode(next);
        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, speed, durationMs, updateCode]);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    updateCode(time);
  };

  const reset = () => {
    setCurrentTime(0);
    setPlaying(false);
    updateCode(0);
  };

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  if (!snapshots || snapshots.length === 0) {
    return <p className="text-gray-400 text-center py-10">No replay data.</p>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 bg-gray-900 rounded-lg overflow-hidden" style={{ minHeight: 300 }}>
        <CodeEditor language={language || 'python'} value={currentCode} onChange={() => {}} options={{ readOnly: true }} />
      </div>

      <div className="bg-gray-800 rounded-lg p-3 mt-3">
        <input
          type="range"
          min={0}
          max={durationMs}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button onClick={reset} className="text-gray-400 hover:text-white transition p-1">
              <FiSkipBack />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="bg-green-600 hover:bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
            >
              {playing ? <FiPause size={14} /> : <FiPlay size={14} />}
            </button>
            <span className="text-gray-400 text-xs font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(durationMs)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`text-xs px-2 py-1 rounded transition ${
                  speed === s ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
