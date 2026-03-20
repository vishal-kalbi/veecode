import pool from '../config/db.js';

export async function getProfile(req, res, next) {
  try {
    const user = await pool.query(
      'SELECT id, username, email, created_at, current_streak, max_streak, score FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await pool.query(
      `SELECT c.difficulty, COUNT(DISTINCT c.id) as count
       FROM submissions s
       JOIN challenges c ON s.challenge_id = c.id
       WHERE s.user_id = $1 AND s.status = 'accepted'
       GROUP BY c.difficulty`,
      [req.user.userId]
    );

    const totalSolved = await pool.query(
      `SELECT COUNT(DISTINCT challenge_id) as count FROM submissions WHERE user_id = $1 AND status = 'accepted'`,
      [req.user.userId]
    );

    const badges = await pool.query(
      'SELECT b.slug, b.name, b.description, b.icon, ub.earned_at FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = $1',
      [req.user.userId]
    );

    const activityData = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM submissions WHERE user_id = $1 AND status = 'accepted' AND created_at > NOW() - INTERVAL '365 days'
       GROUP BY DATE(created_at)`,
      [req.user.userId]
    );

    const languageBreakdown = await pool.query(
      "SELECT language_name, COUNT(DISTINCT challenge_id) as count FROM submissions WHERE user_id = $1 AND status = 'accepted' GROUP BY language_name",
      [req.user.userId]
    );

    res.json({
      user: user.rows[0],
      stats: {
        totalSolved: parseInt(totalSolved.rows[0].count),
        byDifficulty: stats.rows.reduce((acc, row) => {
          acc[row.difficulty] = parseInt(row.count);
          return acc;
        }, { easy: 0, medium: 0, hard: 0 }),
      },
      streak: {
        current: user.rows[0].current_streak || 0,
        max: user.rows[0].max_streak || 0,
      },
      badges: badges.rows,
      activityData: activityData.rows,
      languageBreakdown: languageBreakdown.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSubmissions(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await pool.query(
      `SELECT s.id, s.language_name, s.status, s.passed_count, s.total_count, s.execution_time, s.memory_used, s.created_at, c.title, c.slug
       FROM submissions s
       JOIN challenges c ON s.challenge_id = c.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.userId, parseInt(limit), offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM submissions WHERE user_id = $1',
      [req.user.userId]
    );

    res.json({
      submissions: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
}

export async function getProgress(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT DISTINCT c.slug FROM submissions s
       JOIN challenges c ON s.challenge_id = c.id
       WHERE s.user_id = $1 AND s.status = 'accepted'`,
      [req.user.userId]
    );
    res.json(result.rows.map((r) => r.slug));
  } catch (err) {
    next(err);
  }
}
