import pool from '../config/db.js';

export async function checkAndAward(userId) {
  const badges = await pool.query('SELECT * FROM badges');
  const earned = await pool.query('SELECT badge_id FROM user_badges WHERE user_id = $1', [userId]);
  const earnedIds = new Set(earned.rows.map((r) => r.badge_id));

  for (const badge of badges.rows) {
    if (earnedIds.has(badge.id)) continue;

    const met = await checkCriteria(userId, badge.criteria);
    if (met) {
      await pool.query(
        'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, badge.id]
      );
    }
  }
}

async function checkCriteria(userId, criteria) {
  switch (criteria.type) {
    case 'total_solves': {
      const res = await pool.query(
        "SELECT COUNT(DISTINCT challenge_id) as c FROM submissions WHERE user_id = $1 AND status = 'accepted'",
        [userId]
      );
      return parseInt(res.rows[0].c) >= criteria.count;
    }
    case 'streak': {
      const res = await pool.query('SELECT current_streak FROM users WHERE id = $1', [userId]);
      return (res.rows[0]?.current_streak || 0) >= criteria.count;
    }
    case 'difficulty_clear': {
      const total = await pool.query(
        'SELECT COUNT(*) as c FROM challenges WHERE difficulty = $1',
        [criteria.difficulty]
      );
      const solved = await pool.query(
        "SELECT COUNT(DISTINCT s.challenge_id) as c FROM submissions s JOIN challenges c ON s.challenge_id = c.id WHERE s.user_id = $1 AND s.status = 'accepted' AND c.difficulty = $2",
        [userId, criteria.difficulty]
      );
      return parseInt(solved.rows[0].c) >= parseInt(total.rows[0].c) && parseInt(total.rows[0].c) > 0;
    }
    case 'languages': {
      const res = await pool.query(
        "SELECT COUNT(DISTINCT language_name) as c FROM submissions WHERE user_id = $1 AND status = 'accepted'",
        [userId]
      );
      return parseInt(res.rows[0].c) >= criteria.count;
    }
    default:
      return false;
  }
}
