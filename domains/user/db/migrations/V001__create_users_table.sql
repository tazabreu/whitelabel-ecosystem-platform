-- User Service: Initial schema
-- V001: Create users table

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    user_ecosystem_id VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for ecosystem ID lookups
CREATE INDEX idx_users_ecosystem_id ON users(user_ecosystem_id);

-- Demo users (MVP only)
INSERT INTO users (user_ecosystem_id, username, password_hash, role)
VALUES 
    ('usr_demo_user_001', 'user', 'user', 'USER'),
    ('usr_demo_admin_001', 'admin', 'admin', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

COMMENT ON TABLE users IS 'User accounts for the ACME Ecosystem';
COMMENT ON COLUMN users.user_ecosystem_id IS 'Stable identifier used across all ecosystem products';

