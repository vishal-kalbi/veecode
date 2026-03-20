import axios from 'axios';

const PISTON_URL = process.env.JUDGE0_API_URL; // reusing env var, points to http://localhost:2358

const pistonApi = axios.create({
  baseURL: PISTON_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Map our language IDs to Piston language names and versions
const LANGUAGE_MAP = {
  63: { language: 'javascript', version: '18.15.0' },
  71: { language: 'python', version: '3.10.0' },
  62: { language: 'java', version: '15.0.2' },
  54: { language: 'c++', version: '10.2.0' },
  50: { language: 'c', version: '10.2.0' },
  72: { language: 'ruby', version: '3.0.1' },
  60: { language: 'go', version: '1.16.2' },
  73: { language: 'rust', version: '1.68.2' },
  78: { language: 'kotlin', version: '1.8.20' },
  74: { language: 'typescript', version: '5.0.3' },
  51: { language: 'c', version: '10.2.0' }, // C# not available, fallback
};

async function runSingle(sourceCode, languageId, stdin) {
  const lang = LANGUAGE_MAP[languageId];
  if (!lang) throw new Error(`Unsupported language ID: ${languageId}`);

  const response = await pistonApi.post('/api/v2/execute', {
    language: lang.language,
    version: lang.version,
    files: [{ content: sourceCode }],
    stdin: stdin || '',
    run_timeout: 3000,
    compile_timeout: 3000,
  });

  return response.data;
}

export async function executeAndWait(sourceCode, languageId, testCases) {
  const results = [];

  for (const tc of testCases) {
    try {
      const result = await runSingle(sourceCode, languageId, tc.input);
      const stdout = (result.run?.stdout || '').trim();
      const stderr = result.run?.stderr || '';
      const compileOutput = result.compile?.stderr || result.compile?.output || '';
      const expected = tc.expected_output.trim();
      const passed = stdout === expected;

      let statusId = 3; // Accepted by default
      if (result.compile?.code !== 0 && result.compile?.code != null) {
        statusId = 6; // Compilation error
      } else if (result.run?.signal) {
        statusId = 7; // Runtime error (signal)
      } else if (result.run?.code !== 0) {
        statusId = 11; // Runtime error (non-zero exit)
      } else if (!passed) {
        statusId = 4; // Wrong answer
      }

      results.push({
        test_case_id: tc.id,
        status_id: statusId,
        status_description: getStatusDescription(statusId),
        stdout,
        stderr,
        expected,
        passed,
        time: result.run?.cpu_time ? result.run.cpu_time / 1000 : null,
        memory: result.run?.memory ? result.run.memory / 1000 : null,
        compile_output: compileOutput,
      });
    } catch (err) {
      results.push({
        test_case_id: tc.id,
        status_id: 13,
        status_description: 'Internal Error',
        stdout: '',
        stderr: err.message,
        expected: tc.expected_output.trim(),
        passed: false,
        time: null,
        memory: null,
        compile_output: '',
      });
    }
  }

  return results;
}

function getStatusDescription(statusId) {
  const map = {
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error (SIGSEGV)',
    11: 'Runtime Error (NZEC)',
    13: 'Internal Error',
  };
  return map[statusId] || 'Unknown';
}
