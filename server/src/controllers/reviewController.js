import pool from '../config/db.js';
import { analyzeCode } from '../services/aiReviewService.js';

export async function requestReview(req, res, next) {
  try {
    const { submissionId } = req.params;

    // Check submission exists and belongs to user
    const sub = await pool.query(
      'SELECT s.*, c.title, c.description, c.difficulty FROM submissions s JOIN challenges c ON s.challenge_id = c.id WHERE s.id = $1 AND s.user_id = $2',
      [submissionId, req.user.userId]
    );
    if (sub.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    if (sub.rows[0].status !== 'accepted') {
      return res.status(400).json({ error: 'Only accepted submissions can be reviewed' });
    }

    // Check cache
    const cached = await pool.query('SELECT * FROM code_reviews WHERE submission_id = $1', [submissionId]);
    if (cached.rows.length > 0) {
      return res.json(cached.rows[0]);
    }

    // Call AI
    const submission = sub.rows[0];
    const { review, model } = await analyzeCode({
      sourceCode: submission.source_code,
      languageName: submission.language_name,
      challengeTitle: submission.title,
      challengeDescription: submission.description,
      difficulty: submission.difficulty,
    });

    // Store
    const result = await pool.query(
      'INSERT INTO code_reviews (submission_id, user_id, challenge_id, review_content, model_used) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [submissionId, req.user.userId, submission.challenge_id, JSON.stringify(review), model]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.message === 'OPENROUTER_API_KEY not configured') {
      return res.status(503).json({ error: 'AI review service not configured' });
    }
    next(err);
  }
}

export async function getReview(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM code_reviews WHERE submission_id = $1 AND user_id = $2',
      [req.params.submissionId, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No review found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}
