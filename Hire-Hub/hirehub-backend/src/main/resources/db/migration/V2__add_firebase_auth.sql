-- V2: Add Firebase UID column, make password_hash nullable
-- Flyway migration: replaces JWT-based auth with Firebase Auth

ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE AFTER id;

ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL;

ALTER TABLE users ALTER COLUMN is_enabled SET DEFAULT TRUE;
