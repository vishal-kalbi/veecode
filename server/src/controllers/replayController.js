import pool from '../config/db.js';

export async function saveReplay(req, res, next) {
  try {
    const { challengeSlug, languageName, snapshots, durationMs, submissionId } = req.body;
    if (!challengeSlug || !languageName || !snapshots || !durationMs) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (snapshots.length > 2000) {
      return res.status(400).json({ error: 'Too many snapshots (max 2000)' });
    }

    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [challengeSlug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const result = await pool.query(
      `INSERT INTO code_replays (user_id, challenge_id, submission_id, language_name, snapshots, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.user.userId, challenge.rows[0].id, submissionId || null, languageName, JSON.stringify(snapshots), durationMs]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
}

export async function getMyReplays(req, res, next) {
  try {
    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [req.params.slug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const result = await pool.query(
      'SELECT id, submission_id, language_name, duration_ms, is_public, created_at FROM code_replays WHERE user_id = $1 AND challenge_id = $2 ORDER BY created_at DESC',
      [req.user.userId, challenge.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getCommunityReplays(req, res, next) {
  try {
    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [req.params.slug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Must have solved
    const solved = await pool.query(
      "SELECT id FROM submissions WHERE user_id = $1 AND challenge_id = $2 AND status = 'accepted' LIMIT 1",
      [req.user.userId, challenge.rows[0].id]
    );
    if (solved.rows.length === 0) {
      return res.status(403).json({ error: 'Solve this challenge first' });
    }

    const result = await pool.query(
      `SELECT r.id, r.language_name, r.duration_ms, r.created_at, u.username
       FROM code_replays r JOIN users u ON r.user_id = u.id
       WHERE r.challenge_id = $1 AND r.is_public = TRUE
       ORDER BY r.created_at DESC LIMIT 20`,
      [challenge.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getReplay(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT r.*, u.username, c.title as challenge_title, c.slug as challenge_slug
       FROM code_replays r JOIN users u ON r.user_id = u.id JOIN challenges c ON r.challenge_id = c.id
       WHERE r.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Replay not found' });
    }

    const replay = result.rows[0];
    // Allow if owner or public
    if (replay.user_id !== req.user.userId && !replay.is_public) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(replay);
  } catch (err) {
    next(err);
  }
}

export async function toggleVisibility(req, res, next) {
  try {
    const result = await pool.query(
      'UPDATE code_replays SET is_public = NOT is_public WHERE id = $1 AND user_id = $2 RETURNING is_public',
      [req.params.id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Replay not found' });
    }
    res.json({ is_public: result.rows[0].is_public });
  } catch (err) {
    next(err);
  }
}
