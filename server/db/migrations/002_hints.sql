CREATE TABLE IF NOT EXISTS hints (
    id              SERIAL PRIMARY KEY,
    challenge_id    INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    hint_text       TEXT NOT NULL,
    order_index     INTEGER DEFAULT 0,
    cost            INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_hints (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    hint_id         INTEGER REFERENCES hints(id) ON DELETE CASCADE,
    revealed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, hint_id)
);

CREATE INDEX IF NOT EXISTS idx_hints_challenge_id ON hints(challenge_id);

-- Seed some hints for existing challenges
INSERT INTO hints (challenge_id, hint_text, order_index) VALUES
(1, 'Try using a hash map to store values you have seen so far.', 1),
(1, 'For each element, check if target - element exists in the hash map.', 2),
(5, 'Think about Kadane''s algorithm — track the current subarray sum.', 1),
(5, 'Reset the current sum to 0 whenever it goes negative.', 2),
(6, 'Use a stack data structure to match opening and closing brackets.', 1),
(8, 'Use a sliding window with two pointers and a set to track characters.', 1),
(13, 'Use BFS or DFS to traverse connected components of 1s.', 1),
(13, 'Mark visited cells to avoid counting the same island twice.', 2),
(15, 'For each bar, find the maximum water above it using left_max and right_max.', 1),
(15, 'Try a two-pointer approach from both ends moving inward.', 2)
ON CONFLICT DO NOTHING;
