CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$ BEGIN
    CREATE TYPE difficulty_enum AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS challenges (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    description     TEXT NOT NULL,
    examples        JSONB NOT NULL,
    constraints_text TEXT,
    difficulty      difficulty_enum NOT NULL,
    topic           VARCHAR(100) NOT NULL,
    starter_code    JSONB DEFAULT '{}',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_cases (
    id              SERIAL PRIMARY KEY,
    challenge_id    INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    input           TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample       BOOLEAN DEFAULT FALSE,
    order_index     INTEGER DEFAULT 0
);

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM (
        'pending', 'running', 'accepted', 'wrong_answer',
        'time_limit_exceeded', 'memory_limit_exceeded',
        'runtime_error', 'compilation_error'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS submissions (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id    INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    language_id     INTEGER NOT NULL,
    language_name   VARCHAR(50) NOT NULL,
    source_code     TEXT NOT NULL,
    status          submission_status DEFAULT 'pending',
    passed_count    INTEGER DEFAULT 0,
    total_count     INTEGER DEFAULT 0,
    execution_time  FLOAT,
    memory_used     FLOAT,
    error_output    TEXT,
    test_results    JSONB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_challenge ON submissions(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_challenge_id ON test_cases(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_topic ON challenges(topic);
