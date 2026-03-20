CREATE TABLE IF NOT EXISTS code_reviews (
    id              SERIAL PRIMARY KEY,
    submission_id   INTEGER UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id    INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    review_content  JSONB NOT NULL,
    model_used      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_code_reviews_submission ON code_reviews(submission_id);
CREATE INDEX IF NOT EXISTS idx_code_reviews_user ON code_reviews(user_id);
