import pool from '../config/db.js';

export async function getHints(req, res, next) {
  try {
    const { slug } = req.params;
    const challenge = await pool.query('SELECT id FROM challenges WHERE slug = $1', [slug]);
    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const result = await pool.query(
      `SELECT h.id, h.order_index, h.cost,
              CASE WHEN uh.id IS NOT NULL THEN h.hint_text ELSE NULL END as hint_text,
              (uh.id IS NOT NULL) as revealed
       FROM hints h
       LEFT JOIN user_hints uh ON h.id = uh.hint_id AND uh.user_id = $1
       WHERE h.challenge_id = $2
       ORDER BY h.order_index`,
      [req.user.userId, challenge.rows[0].id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function revealHint(req, res, next) {
  try {
    const { hintId } = req.params;

    await pool.query(
      'INSERT INTO user_hints (user_id, hint_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.userId, parseInt(hintId)]
    );

    const result = await pool.query('SELECT hint_text FROM hints WHERE id = $1', [parseInt(hintId)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hint not found' });
    }

    res.json({ hint_text: result.rows[0].hint_text });
  } catch (err) {
    next(err);
  }
}
