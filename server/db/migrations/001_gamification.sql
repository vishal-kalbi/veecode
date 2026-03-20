-- Gamification columns on users
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_solved_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    name        VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon        VARCHAR(50) NOT NULL,
    criteria    JSONB NOT NULL
);

-- User badges (earned achievements)
CREATE TABLE IF NOT EXISTS user_badges (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id    INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_users_score ON users(score DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Seed badges
INSERT INTO badges (slug, name, description, icon, criteria) VALUES
('first-solve', 'First Blood', 'Solve your first challenge', 'trophy', '{"type":"total_solves","count":1}'),
('ten-solves', 'Problem Crusher', 'Solve 10 challenges', 'fire', '{"type":"total_solves","count":10}'),
('all-easy', 'Easy Peasy', 'Solve all easy challenges', 'star', '{"type":"difficulty_clear","difficulty":"easy"}'),
('streak-3', 'On Fire', 'Maintain a 3-day streak', 'flame', '{"type":"streak","count":3}'),
('streak-7', 'Week Warrior', 'Maintain a 7-day streak', 'lightning', '{"type":"streak","count":7}'),
('streak-30', 'Monthly Master', 'Maintain a 30-day streak', 'crown', '{"type":"streak","count":30}'),
('polyglot', 'Polyglot', 'Solve challenges in 3+ languages', 'globe', '{"type":"languages","count":3}')
ON CONFLICT (slug) DO NOTHING;
