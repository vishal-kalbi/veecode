import pool from '../config/db.js';

export async function getLeaderboard(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await pool.query(
      `SELECT u.id, u.username, u.score, u.current_streak, u.max_streak, u.created_at,
              COUNT(DISTINCT s.challenge_id) as solved_count
       FROM users u
       LEFT JOIN submissions s ON s.user_id = u.id AND s.status = 'accepted'
       GROUP BY u.id
       ORDER BY u.score DESC, solved_count DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows.map((u, i) => ({ ...u, rank: offset + i + 1 })),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyRank(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) + 1 as rank FROM users WHERE score > (SELECT score FROM users WHERE id = $1)',
      [req.user.userId]
    );
    const userResult = await pool.query(
      'SELECT score, current_streak, max_streak FROM users WHERE id = $1',
      [req.user.userId]
    );
    res.json({
      rank: parseInt(result.rows[0].rank),
      ...userResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
}
