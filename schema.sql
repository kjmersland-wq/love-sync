-- SQLite/D1 database schema for Love Sync premium relationship platform

-- Users base registry
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    occupation TEXT NOT NULL,
    location TEXT NOT NULL,
    country TEXT NOT NULL,
    subscription TEXT DEFAULT 'Free', -- 'Free' or 'Premium'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User compatibility profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    introduction TEXT,
    lifestyle_text TEXT,
    values_text TEXT,
    goals_text TEXT,
    interests_text TEXT,
    expectations TEXT,
    -- Compatibility scores (0-100)
    family_goals_score INTEGER DEFAULT 80,
    lifestyle_score INTEGER DEFAULT 80,
    personality_score INTEGER DEFAULT 80,
    values_score INTEGER DEFAULT 80,
    interests_score INTEGER DEFAULT 80,
    distance_score INTEGER DEFAULT 80,
    age_score INTEGER DEFAULT 80
);

-- Connections/Matches logs
CREATE TABLE IF NOT EXISTS user_connections (
    user_a TEXT REFERENCES users(id) ON DELETE CASCADE,
    user_b TEXT REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Matched', -- 'Matched', 'Ignored', 'Saved'
    matched_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_a, user_b)
);

-- Direct messaging thread logs
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    recipient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    translated_text TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0 -- Boolean (0 or 1)
);

-- Webhook event idempotency log (Double billing & replay protection)
CREATE TABLE IF NOT EXISTS processed_payment_events (
    event_id TEXT PRIMARY KEY,
    processed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    provider TEXT NOT NULL
);

-- Normalized invoices
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL, -- 'paid', 'open', 'void'
    pdf_url TEXT,
    provider TEXT NOT NULL
);
