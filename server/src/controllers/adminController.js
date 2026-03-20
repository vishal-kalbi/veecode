import pool from '../config/db.js';

export async function getDashboard(req, res, next) {
  try {
    const [users, challenges, submissions, recentSubs] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM challenges'),
      pool.query('SELECT COUNT(*) as count FROM submissions'),
      pool.query(`SELECT s.id, s.status, s.language_name, s.created_at, u.username, c.title
        FROM submissions s JOIN users u ON s.user_id = u.id JOIN challenges c ON s.challenge_id = c.id
        ORDER BY s.created_at DESC LIMIT 10`),
    ]);

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalChallenges: parseInt(challenges.rows[0].count),
      totalSubmissions: parseInt(submissions.rows[0].count),
      recentSubmissions: recentSubs.rows,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, score, current_streak, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getChallenges(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(DISTINCT tc.id) as test_count
       FROM challenges c LEFT JOIN test_cases tc ON tc.challenge_id = c.id
       GROUP BY c.id ORDER BY c.id`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function createChallenge(req, res, next) {
  try {
    const { title, slug, description, difficulty, topic, constraints_text, examples, starter_code, time_limit, memory_limit, test_cases } = req.body;

    const result = await pool.query(
      `INSERT INTO challenges (title, slug, description, difficulty, topic, constraints_text, examples, starter_code, time_limit, memory_limit)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, slug, description, difficulty, topic, constraints_text, JSON.stringify(examples), JSON.stringify(starter_code), time_limit || 2000, memory_limit || 128000]
    );

    if (test_cases && test_cases.length > 0) {
      for (let i = 0; i < test_cases.length; i++) {
        const tc = test_cases[i];
        await pool.query(
          'INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES ($1, $2, $3, $4, $5)',
          [result.rows[0].id, tc.input, tc.expected_output, tc.is_sample || false, i]
        );
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateChallenge(req, res, next) {
  try {
    const { title, description, difficulty, topic, constraints_text, examples, starter_code, time_limit, memory_limit } = req.body;

    const result = await pool.query(
      `UPDATE challenges SET title=$1, description=$2, difficulty=$3, topic=$4, constraints_text=$5, examples=$6, starter_code=$7, time_limit=$8, memory_limit=$9
       WHERE id=$10 RETURNING *`,
      [title, description, difficulty, topic, constraints_text, JSON.stringify(examples), JSON.stringify(starter_code), time_limit, memory_limit, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteChallenge(req, res, next) {
  try {
    await pool.query('DELETE FROM challenges WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getTestCases(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM test_cases WHERE challenge_id = $1 ORDER BY order_index',
      [req.params.challengeId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function updateTestCases(req, res, next) {
  try {
    const { test_cases } = req.body;
    const challengeId = req.params.challengeId;

    await pool.query('DELETE FROM test_cases WHERE challenge_id = $1', [challengeId]);

    for (let i = 0; i < test_cases.length; i++) {
      const tc = test_cases[i];
      await pool.query(
        'INSERT INTO test_cases (challenge_id, input, expected_output, is_sample, order_index) VALUES ($1, $2, $3, $4, $5)',
        [challengeId, tc.input, tc.expected_output, tc.is_sample || false, i]
      );
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
