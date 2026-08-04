-- Migration: 0002_relationship_platform.sql
-- Description: Database tables for Relationship Journey, private photo sharing, video/voice intros, and professional verification

-- Shared relationship journey tracker and planning board for matched couples
CREATE TABLE IF NOT EXISTS relationship_journeys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  stage TEXT DEFAULT 'Discovery', -- e.g. Discovery, First Match, First Conversation, Video Call, First Meeting, Relationship, Visiting Each Other, Relocation Planning, Engagement, Marriage
  progress_percent INTEGER DEFAULT 10,
  visa_checklist_json TEXT, -- JSON string array of task objects
  moving_checklist_json TEXT, -- JSON string array of task objects
  budget_json TEXT, -- JSON string array of expense items
  calendar_json TEXT, -- JSON string array of shared event logs
  housing_search_json TEXT, -- JSON string array of shortlisted property IDs or notes
  documents_json TEXT, -- JSON string array of checklist items
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Access tracking for watermarked private photo albums
CREATE TABLE IF NOT EXISTS private_photo_permissions (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  requester_id TEXT NOT NULL,
  status TEXT DEFAULT 'none', -- none, requested, approved, revoked
  expires_at TEXT, -- Expiration ISO string
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Introduction video entries for profile views
CREATE TABLE IF NOT EXISTS video_introductions (
  user_id TEXT PRIMARY KEY,
  video_url TEXT NOT NULL,
  caption TEXT,
  duration_seconds INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Voice clip/introduction entries for profiles
CREATE TABLE IF NOT EXISTS voice_introductions (
  user_id TEXT PRIMARY KEY,
  voice_url TEXT NOT NULL,
  transcript TEXT,
  duration_seconds INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Professional background check validations
CREATE TABLE IF NOT EXISTS professional_verifications (
  user_id TEXT PRIMARY KEY,
  verification_type TEXT NOT NULL, -- e.g. ID, Degree, Income, Background
  status TEXT DEFAULT 'pending', -- pending, verified, rejected
  verified_by TEXT,
  details TEXT, -- JSON string metadata
  verified_at TEXT
);
