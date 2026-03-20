import { useState, useRef, useCallback, useEffect } from 'react';

export default function useCodeRecorder() {
  const [recording, setRecording] = useState(false);
  const snapshotsRef = useRef([]);
  const startTimeRef = useRef(null);
  const lastCodeRef = useRef('');
  const intervalRef = useRef(null);
  const codeRef = useRef('');

  const startRecording = useCallback(() => {
    snapshotsRef.current = [];
    startTimeRef.current = Date.now();
    lastCodeRef.current = '';
    setRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setRecording(false);
    clearInterval(intervalRef.current);
    const duration = Date.now() - (startTimeRef.current || Date.now());
    return {
      snapshots: snapshotsRef.current,
      durationMs: duration,
    };
  }, []);

  const updateCode = useCallback((code) => {
    codeRef.current = code;
  }, []);

  useEffect(() => {
    if (!recording) return;

    intervalRef.current = setInterval(() => {
      const code = codeRef.current;
      if (code && code !== lastCodeRef.current) {
        const t = Date.now() - startTimeRef.current;
        snapshotsRef.current.push({ t, c: code });
        lastCodeRef.current = code;
      }
    }, 2500);

    return () => clearInterval(intervalRef.current);
  }, [recording]);

  return { recording, startRecording, stopRecording, updateCode, getSnapshots: () => snapshotsRef.current };
}
