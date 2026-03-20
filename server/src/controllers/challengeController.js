import pool from '../config/db.js';

export async function listChallenges(req, res, next) {
  try {
    const { difficulty, topic, search, page = 1, limit = 20 } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (difficulty) {
      conditions.push(`difficulty = $${idx++}`);
      params.push(difficulty);
    }
    if (topic) {
      conditions.push(`topic = $${idx++}`);
      params.push(topic);
    }
    if (search) {
      conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countResult = await pool.query(`SELECT COUNT(*) FROM challenges ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT id, title, slug, difficulty, topic, created_at FROM challenges ${where} ORDER BY id ASC LIMIT $${idx++} OFFSET $${idx}`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      challenges: result.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
}

export async function getChallenge(req, res, next) {
  try {
    const { slug } = req.params;
    const challengeResult = await pool.query('SELECT * FROM challenges WHERE slug = $1', [slug]);
    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = challengeResult.rows[0];
    const testCases = await pool.query(
      'SELECT id, input, expected_output, is_sample, order_index FROM test_cases WHERE challenge_id = $1 AND is_sample = TRUE ORDER BY order_index',
      [challenge.id]
    );

    res.json({ challenge, sampleTestCases: testCases.rows });
  } catch (err) {
    next(err);
  }
}
