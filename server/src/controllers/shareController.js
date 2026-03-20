import crypto from 'crypto';
import pool from '../config/db.js';

export async function shareSubmission(req, res, next) {
  try {
    const { submissionId } = req.body;
    const sub = await pool.query(
      'SELECT id FROM submissions WHERE id = $1 AND user_id = $2',
      [submissionId, req.user.userId]
    );
    if (sub.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if already shared
    const existing = await pool.query(
      'SELECT share_token FROM shared_solutions WHERE submission_id = $1 AND user_id = $2',
      [submissionId, req.user.userId]
    );
    if (existing.rows.length > 0) {
      return res.json({ token: existing.rows[0].share_token });
    }

    const token = crypto.randomBytes(16).toString('hex');
    await pool.query(
      'INSERT INTO shared_solutions (submission_id, user_id, share_token) VALUES ($1, $2, $3)',
      [submissionId, req.user.userId, token]
    );

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
}

export async function getSharedSolution(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT s.source_code, s.language_name, s.status, s.execution_time, s.memory_used, s.created_at,
              u.username, c.title, c.slug, c.difficulty
       FROM shared_solutions ss
       JOIN submissions s ON ss.submission_id = s.id
       JOIN users u ON ss.user_id = u.id
       JOIN challenges c ON s.challenge_id = c.id
       WHERE ss.share_token = $1`,
      [req.params.token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shared solution not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}
