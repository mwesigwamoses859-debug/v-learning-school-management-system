CREATE TABLE IF NOT EXISTS vlearning_students (learner_id TEXT PRIMARY KEY, student_id TEXT NOT NULL UNIQUE, username TEXT NOT NULL, display_name TEXT NOT NULL, class_level TEXT NOT NULL, school_name TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS vlearning_student_class ON vlearning_students(class_level, display_name);
CREATE TABLE IF NOT EXISTS vlearning_quiz_results (id TEXT PRIMARY KEY, learner_id TEXT NOT NULL, content_id TEXT NOT NULL, submission_id TEXT NOT NULL, title TEXT NOT NULL, subject TEXT NOT NULL, topic TEXT NOT NULL, class_level TEXT NOT NULL, correct INTEGER NOT NULL, total INTEGER NOT NULL CHECK(total>0), percentage REAL NOT NULL, created_at TEXT NOT NULL, UNIQUE(learner_id,submission_id));
CREATE INDEX IF NOT EXISTS vlearning_results_learner ON vlearning_quiz_results(learner_id,created_at);
CREATE TABLE IF NOT EXISTS school_staff_sessions (token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS school_access_codes (code_hash TEXT PRIMARY KEY, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS school_connection (id INTEGER PRIMARY KEY CHECK(id=1), last_synced_at TEXT NOT NULL);
