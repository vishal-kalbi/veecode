import pool from '../config/db.js';

export async function getComments(req, res, next) {
  try {
    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [req.params.slug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const result = await pool.query(
      `SELECT c.id, c.body, c.parent_id, c.created_at, c.updated_at, u.id as user_id, u.username
       FROM comments c JOIN users u ON c.user_id = u.id
       WHERE c.challenge_id = $1
       ORDER BY c.created_at ASC`,
      [challenge.rows[0].id]
    );

    // Build tree structure
    const comments = result.rows;
    const roots = [];
    const map = {};
    comments.forEach((c) => { c.replies = []; map[c.id] = c; });
    comments.forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(c);
      } else {
        roots.push(c);
      }
    });

    res.json(roots);
  } catch (err) {
    next(err);
  }
}

export async function createComment(req, res, next) {
  try {
    const { body, parentId } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Comment body is required' });
    }

    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [req.params.slug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const result = await pool.query(
      'INSERT INTO comments (challenge_id, user_id, parent_id, body) VALUES ($1, $2, $3, $4) RETURNING *',
      [challenge.rows[0].id, req.user.userId, parentId || null, body.trim()]
    );

    const user = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.userId]);
    res.status(201).json({ ...result.rows[0], username: user.rows[0].username, replies: [] });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found or not authorized' });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
