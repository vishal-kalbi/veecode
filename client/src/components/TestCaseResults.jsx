import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';

function DiffView({ actual, expected }) {
  const actualLines = (actual || '').split('\n');
  const expectedLines = (expected || '').split('\n');
  const maxLines = Math.max(actualLines.length, expectedLines.length);

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div>
        <div className="text-xs text-gray-500 mb-1">Your Output</div>
        <div className="bg-gray-950 rounded p-2 font-mono text-xs">
          {Array.from({ length: maxLines }).map((_, i) => {
            const line = actualLines[i] ?? '';
            const exp = expectedLines[i] ?? '';
            const differs = line !== exp;
            return (
              <div key={i} className={differs ? 'bg-red-900/30 px-1 -mx-1 rounded' : ''}>
                {line || '\u00A0'}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">Expected Output</div>
        <div className="bg-gray-950 rounded p-2 font-mono text-xs">
          {Array.from({ length: maxLines }).map((_, i) => {
            const line = actualLines[i] ?? '';
            const exp = expectedLines[i] ?? '';
            const differs = line !== exp;
            return (
              <div key={i} className={differs ? 'bg-green-900/30 px-1 -mx-1 rounded' : ''}>
                {exp || '\u00A0'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TestCaseResults({ results, status }) {
  if (!results) return null;

  const statusColor = status === 'accepted' ? 'text-green-400' : 'text-red-400';
  const statusText = status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const firstFailIdx = results.findIndex((r) => !r.passed);

  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (firstFailIdx >= 0) {
      setExpanded({ [firstFailIdx]: true });
    } else {
      setExpanded({});
    }
  }, [results]);

  const toggle = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-4 overflow-auto">
      <div className={`text-lg font-semibold mb-3 ${statusColor}`}>
        {statusText}
        <span className="text-sm text-gray-400 font-normal ml-2">
          ({results.filter((r) => r.passed).length}/{results.length} passed)
        </span>
      </div>
      <div className="space-y-1">
        {results.map((r, i) => (
          <div key={i} className="border border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800/50 transition text-sm"
            >
              {expanded[i] ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
              <span className="text-gray-300">Test {i + 1}</span>
              {r.passed ? (
                <span className="text-green-400 flex items-center gap-1 text-xs"><FiCheck /> Passed</span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 text-xs"><FiX /> Failed</span>
              )}
              <span className="ml-auto text-gray-500 text-xs">
                {r.time ? `${r.time}s` : ''} {r.memory ? `${Math.round(r.memory)}KB` : ''}
              </span>
            </button>
            {expanded[i] && (
              <div className="px-3 pb-3 border-t border-gray-800">
                {(r.stderr || r.compile_output) && (
                  <div className="mt-2 bg-red-950/30 rounded p-2 text-xs font-mono text-red-300">
                    {r.stderr || r.compile_output}
                  </div>
                )}
                <DiffView actual={r.stdout} expected={r.expected} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
