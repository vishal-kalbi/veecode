import pool from '../config/db.js';
import { executeAndWait } from '../services/judge0Service.js';
import { LANGUAGES } from '../utils/constants.js';

function mapStatus(testResults) {
  if (testResults.every((r) => r.passed)) return 'accepted';
  const firstFail = testResults.find((r) => !r.passed);
  if (!firstFail) return 'wrong_answer';
  if (firstFail.status_id === 5) return 'time_limit_exceeded';
  if (firstFail.status_id === 6) return 'compilation_error';
  if (firstFail.status_id >= 7 && firstFail.status_id <= 12) return 'runtime_error';
  return 'wrong_answer';
}

export async function runCode(req, res, next) {
  try {
    const { challengeSlug, languageId, sourceCode } = req.body;
    if (!challengeSlug || !languageId || !sourceCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [challengeSlug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const testCases = await pool.query(
      'SELECT id, input, expected_output FROM test_cases WHERE challenge_id = $1 AND is_sample = TRUE ORDER BY order_index',
      [challenge.rows[0].id]
    );

    const results = await executeAndWait(sourceCode, languageId, testCases.rows);
    const passed = results.filter((r) => r.passed).length;

    res.json({
      status: passed === results.length ? 'accepted' : 'wrong_answer',
      passed_count: passed,
      total_count: results.length,
      test_results: results,
    });
  } catch (err) {
    if (err.message === 'Code execution timed out') {
      return res.status(504).json({ error: 'Code execution timed out' });
    }
    next(err);
  }
}

export async function submitCode(req, res, next) {
  try {
    const { challengeSlug, languageId, sourceCode } = req.body;
    if (!challengeSlug || !languageId || !sourceCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [challengeSlug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    const challengeId = challenge.rows[0].id;

    const testCases = await pool.query(
      'SELECT id, input, expected_output FROM test_cases WHERE challenge_id = $1 ORDER BY order_index',
      [challengeId]
    );

    const results = await executeAndWait(sourceCode, languageId, testCases.rows);
    const passed = results.filter((r) => r.passed).length;
    const status = mapStatus(results);
    const maxTime = Math.max(...results.map((r) => r.time || 0));
    const maxMemory = Math.max(...results.map((r) => r.memory || 0));
    const lang = LANGUAGES.find((l) => l.id === languageId);
    const errorOutput = results.find((r) => r.stderr || r.compile_output);

    const submission = await pool.query(
      `INSERT INTO submissions (user_id, challenge_id, language_id, language_name, source_code, status, passed_count, total_count, execution_time, memory_used, error_output, test_results)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        req.user.userId,
        challengeId,
        languageId,
        lang?.name || 'Unknown',
        sourceCode,
        status,
        passed,
        results.length,
        maxTime,
        maxMemory,
        errorOutput ? errorOutput.stderr || errorOutput.compile_output : null,
        JSON.stringify(results),
      ]
    );

    res.status(201).json(submission.rows[0]);
  } catch (err) {
    if (err.message === 'Code execution timed out') {
      return res.status(504).json({ error: 'Code execution timed out' });
    }
    next(err);
  }
}

export async function getSubmission(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getChallengeSubmissions(req, res, next) {
  try {
    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [req.params.slug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const result = await pool.query(
      'SELECT id, language_name, status, passed_count, total_count, execution_time, memory_used, created_at FROM submissions WHERE user_id = $1 AND challenge_id = $2 ORDER BY created_at DESC',
      [req.user.userId, challenge.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}
