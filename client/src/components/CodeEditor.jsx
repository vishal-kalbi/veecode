import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, value, onChange }) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      loading={
        <div className="h-full bg-gray-900 flex items-center justify-center">
          <div className="space-y-3 w-3/4">
            {[80, 60, 90, 45, 70, 55, 85, 40].map((w, i) => (
              <div key={i} className="h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      }
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        tabSize: 4,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        padding: { top: 16 },
      }}
    />
  );
}
