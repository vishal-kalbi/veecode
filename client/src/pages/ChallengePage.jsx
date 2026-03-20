import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { LANGUAGES, DIFFICULTY_COLORS } from '../utils/constants';
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import SubmissionPanel from '../components/SubmissionPanel';
import TestCaseResults from '../components/TestCaseResults';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

function getStorageKey(slug, langId) {
  return `veecode_code_${slug}_${langId}`;
}

function getStarterCode(challenge, langSlug) {
  return challenge?.starter_code?.[langSlug] || '// Write your solution here\n';
}

export default function ChallengePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [sampleTests, setSampleTests] = useState([]);
  const [languageId, setLanguageId] = useState(71);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState(null);
  const [resultStatus, setResultStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('problem');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, targetLangId: null });
  const saveTimerRef = useRef(null);

  // Load challenge + restore saved code
  useEffect(() => {
    api.get(`/challenges/${slug}`)
      .then((res) => {
        setChallenge(res.data.challenge);
        setSampleTests(res.data.sampleTestCases);
        const lang = LANGUAGES.find((l) => l.id === languageId);
        const saved = localStorage.getItem(getStorageKey(slug, languageId));
        setCode(saved || getStarterCode(res.data.challenge, lang?.slug));
      })
      .catch(() => toast.error('Failed to load challenge'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Auto-save code to localStorage (debounced)
  useEffect(() => {
    if (!slug || !code) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(getStorageKey(slug, languageId), code);
    }, 300);
    return () => clearTimeout(saveTimerRef.current);
  }, [code, slug, languageId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (executing) return;
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRun();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [executing, code, slug, languageId, user]);

  const handleLanguageChange = (newLangId) => {
    const currentLang = LANGUAGES.find((l) => l.id === languageId);
    const starter = getStarterCode(challenge, currentLang?.slug);
    const isModified = code !== starter;

    if (isModified) {
      setConfirmDialog({ open: true, targetLangId: newLangId });
    } else {
      switchLanguage(newLangId);
    }
  };

  const switchLanguage = (newLangId) => {
    setLanguageId(newLangId);
    const lang = LANGUAGES.find((l) => l.id === newLangId);
    const saved = localStorage.getItem(getStorageKey(slug, newLangId));
    setCode(saved || getStarterCode(challenge, lang?.slug));
    setConfirmDialog({ open: false, targetLangId: null });
  };

  const handleRun = useCallback(async () => {
    if (!user) { toast.error('Please log in to run code'); return; }
    setExecuting(true);
    setResults(null);
    try {
      const res = await api.post('/submissions/run', {
        challengeSlug: slug,
        languageId,
        sourceCode: code,
      });
      setResults(res.data.test_results);
      setResultStatus(res.data.status);
      if (res.data.status === 'accepted') {
        toast.success(`All ${res.data.total_count} sample tests passed! Ready to submit.`, { duration: 3000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Execution failed', { duration: 5000 });
    } finally {
      setExecuting(false);
    }
  }, [user, slug, languageId, code]);

  const handleSubmit = useCallback(async () => {
    if (!user) { toast.error('Please log in to submit'); return; }
    setExecuting(true);
    setResults(null);
    try {
      const res = await api.post('/submissions/submit', {
        challengeSlug: slug,
        languageId,
        sourceCode: code,
      });
      setResults(res.data.test_results);
      setResultStatus(res.data.status);
      if (res.data.status === 'accepted') {
        toast.success(`Accepted! All ${res.data.total_count} tests passed in ${res.data.execution_time?.toFixed(2) || '0'}s`, { duration: 3000 });
      } else {
        toast.error(`${res.data.passed_count}/${res.data.total_count} tests passed. Check results below.`, { duration: 5000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed', { duration: 5000 });
    } finally {
      setExecuting(false);
    }
  }, [user, slug, languageId, code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!challenge) {
    return <div className="text-center text-gray-400 py-20">Challenge not found</div>;
  }

  const currentLang = LANGUAGES.find((l) => l.id === languageId);

  const examples = typeof challenge.examples === 'string'
    ? JSON.parse(challenge.examples)
    : challenge.examples;

  const problemPanel = (
    <div className="h-full overflow-auto p-6 bg-gray-900">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            color: DIFFICULTY_COLORS[challenge.difficulty],
            backgroundColor: `${DIFFICULTY_COLORS[challenge.difficulty]}20`,
          }}
        >
          {challenge.difficulty}
        </span>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{challenge.description}</ReactMarkdown>
      </div>
      {examples && (
        <div className="mt-6 space-y-4">
          <h3 className="text-white font-semibold">Examples</h3>
          {examples.map((ex, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4">
              <div className="mb-2">
                <span className="text-gray-400 text-sm">Input:</span>
                <pre className="text-green-300 text-sm mt-1 whitespace-pre-wrap">{ex.input}</pre>
              </div>
              <div className="mb-2">
                <span className="text-gray-400 text-sm">Output:</span>
                <pre className="text-green-300 text-sm mt-1 whitespace-pre-wrap">{ex.output}</pre>
              </div>
              {ex.explanation && (
                <div>
                  <span className="text-gray-400 text-sm">Explanation:</span>
                  <p className="text-gray-300 text-sm mt-1">{ex.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {challenge.constraints_text && (
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-2">Constraints</h3>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{challenge.constraints_text}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );

  const editorPanel = (
    <div className="h-full flex flex-col bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-3 p-3 border-b border-gray-700 shrink-0">
        <LanguageSelector value={languageId} onChange={handleLanguageChange} />
      </div>
      <div className="flex-1 min-h-0">
        <CodeEditor
          language={currentLang?.monacoLang || 'python'}
          value={code}
          onChange={(val) => setCode(val || '')}
        />
      </div>
      <div className="shrink-0">
        <SubmissionPanel onRun={handleRun} onSubmit={handleSubmit} loading={executing} />
      </div>
      {results && (
        <div className="shrink-0 max-h-[40%] overflow-auto">
          <TestCaseResults results={results} status={resultStatus} />
        </div>
      )}
    </div>
  );

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialog.open}
        title="Switch Language?"
        message="Switching languages will replace your current code. Any unsaved changes will be lost."
        onConfirm={() => switchLanguage(confirmDialog.targetLangId)}
        onCancel={() => setConfirmDialog({ open: false, targetLangId: null })}
      />

      {/* Desktop: split pane */}
      <div className="hidden lg:block h-[calc(100vh-4rem)]">
        <Split
          className="flex h-full"
          sizes={[45, 55]}
          minSize={300}
          gutterSize={6}
          gutterStyle={() => ({
            backgroundColor: '#374151',
            cursor: 'col-resize',
          })}
        >
          {problemPanel}
          {editorPanel}
        </Split>
      </div>

      {/* Mobile: tabs */}
      <div className="lg:hidden">
        <div className="flex border-b border-gray-700">
          {['problem', 'code', 'results'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="h-[calc(100vh-7rem)]">
          {activeTab === 'problem' && problemPanel}
          {activeTab === 'code' && editorPanel}
          {activeTab === 'results' && (
            <div className="p-4">
              {results ? (
                <TestCaseResults results={results} status={resultStatus} />
              ) : (
                <p className="text-gray-400 text-center py-20">
                  Run or submit your code to see results
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
