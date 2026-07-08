-- SQL Schema Migration for Brojix Client Feedback & Project Management System
-- Run this in your Supabase SQL Editor to update your database schema.

-- ==========================================
-- 1. EXTEND THE EXISTING PROJECTS TABLE
-- ==========================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget NUMERIC DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS services_included JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS actual_delivery DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gst NUMERIC DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS final_amount NUMERIC DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assigned_team_member TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_files JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS invoice_upload TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_upload TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_thumbnail TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_color TEXT DEFAULT '#DFFF00';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::text[];

-- ==========================================
-- 2. CREATE FEEDBACK_LINKS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS feedback_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_disabled BOOLEAN DEFAULT FALSE,
  is_one_time BOOLEAN DEFAULT TRUE,
  password TEXT,
  submissions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. CREATE FEEDBACK TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT REFERENCES feedback_links(token) ON DELETE SET NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  overall_rating NUMERIC NOT NULL,
  detailed_ratings JSONB NOT NULL,
  text_feedback JSONB NOT NULL,
  nps_score INTEGER NOT NULL,
  nps_class TEXT NOT NULL,
  testimonial TEXT,
  allow_public_use BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  audio_url TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  work_again TEXT NOT NULL,
  more_services TEXT[] DEFAULT '{}'::text[],
  referral JSONB DEFAULT '{}'::jsonb,
  future_project JSONB DEFAULT '{}'::jsonb,
  contact_permission BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. CREATE NOTIFICATIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 6. CONFIGURE RLS POLICIES FOR PROJECTS
-- ==========================================

DROP POLICY IF EXISTS "Allow select for everyone on projects" ON projects;
CREATE POLICY "Allow select for everyone on projects" ON projects
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow insert for everyone on projects" ON projects;
CREATE POLICY "Allow insert for everyone on projects" ON projects
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow update for everyone on projects" ON projects;
CREATE POLICY "Allow update for everyone on projects" ON projects
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow delete for everyone on projects" ON projects;
CREATE POLICY "Allow delete for everyone on projects" ON projects
  FOR DELETE USING (TRUE);

-- ==========================================
-- 7. CONFIGURE RLS POLICIES FOR FEEDBACK_LINKS
-- ==========================================

DROP POLICY IF EXISTS "Allow select for everyone on feedback_links" ON feedback_links;
CREATE POLICY "Allow select for everyone on feedback_links" ON feedback_links
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow insert for everyone on feedback_links" ON feedback_links;
CREATE POLICY "Allow insert for everyone on feedback_links" ON feedback_links
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow update for everyone on feedback_links" ON feedback_links;
CREATE POLICY "Allow update for everyone on feedback_links" ON feedback_links
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow delete for everyone on feedback_links" ON feedback_links;
CREATE POLICY "Allow delete for everyone on feedback_links" ON feedback_links
  FOR DELETE USING (TRUE);

-- ==========================================
-- 8. CONFIGURE RLS POLICIES FOR FEEDBACK
-- ==========================================

DROP POLICY IF EXISTS "Allow select for everyone on feedback" ON feedback;
CREATE POLICY "Allow select for everyone on feedback" ON feedback
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow insert for everyone on feedback" ON feedback;
CREATE POLICY "Allow insert for everyone on feedback" ON feedback
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow update for everyone on feedback" ON feedback;
CREATE POLICY "Allow update for everyone on feedback" ON feedback
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow delete for everyone on feedback" ON feedback;
CREATE POLICY "Allow delete for everyone on feedback" ON feedback
  FOR DELETE USING (TRUE);

-- ==========================================
-- 9. CONFIGURE RLS POLICIES FOR NOTIFICATIONS
-- ==========================================

DROP POLICY IF EXISTS "Allow select for everyone on notifications" ON notifications;
CREATE POLICY "Allow select for everyone on notifications" ON notifications
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow insert for everyone on notifications" ON notifications;
CREATE POLICY "Allow insert for everyone on notifications" ON notifications
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow update for everyone on notifications" ON notifications;
CREATE POLICY "Allow update for everyone on notifications" ON notifications
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow delete for everyone on notifications" ON notifications;
CREATE POLICY "Allow delete for everyone on notifications" ON notifications
  FOR DELETE USING (TRUE);

-- ==========================================
-- 10. GRANT ROLES PERMISSIONS (EXPOSE TO DATA API)
-- ==========================================
-- In some Supabase settings, newly created tables need to be explicitly granted access to public roles.

GRANT ALL ON projects TO anon, authenticated, postgres;
GRANT ALL ON feedback_links TO anon, authenticated, postgres;
GRANT ALL ON feedback TO anon, authenticated, postgres;
GRANT ALL ON notifications TO anon, authenticated, postgres;
