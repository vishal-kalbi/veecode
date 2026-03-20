CREATE TABLE IF NOT EXISTS code_replays (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id    INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    submission_id   INTEGER REFERENCES submissions(id) ON DELETE SET NULL,
    language_name   VARCHAR(50) NOT NULL,
    snapshots       JSONB NOT NULL,
    duration_ms     INTEGER NOT NULL,
    is_public       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_code_replays_user ON code_replays(user_id);
CREATE INDEX IF NOT EXISTS idx_code_replays_challenge ON code_replays(challenge_id);
CREATE INDEX IF NOT EXISTS idx_code_replays_public ON code_replays(challenge_id, is_public) WHERE is_public = TRUE;
