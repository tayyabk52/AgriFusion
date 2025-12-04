-- ============================================
-- FARMERS MODULE: RLS Policies
-- ============================================
-- This file creates comprehensive Row Level Security (RLS) policies
-- for the profiles, farmers, and consultants tables to ensure
-- proper data access control.
-- ============================================

-- ============================================
-- STEP 1: Enable RLS on Core Tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: PROFILES TABLE POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth_user_id = auth.uid());

-- Consultants can read profiles of their assigned farmers
CREATE POLICY "Consultants can read their farmers profiles"
ON profiles FOR SELECT
USING (
  id IN (
    SELECT f.profile_id
    FROM farmers f
    INNER JOIN consultants c ON c.id = f.consultant_id
    INNER JOIN profiles p ON p.id = c.profile_id
    WHERE p.auth_user_id = auth.uid()
  )
);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Service role has full access (for API routes)
CREATE POLICY "Service role full access to profiles"
ON profiles FOR ALL
USING (auth.jwt()->>'role' = 'service_role')
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- STEP 3: FARMERS TABLE POLICIES
-- ============================================

-- Farmers can read their own data
CREATE POLICY "Farmers can read own data"
ON farmers FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- Consultants can read their assigned farmers
CREATE POLICY "Consultants can read assigned farmers"
ON farmers FOR SELECT
USING (
  consultant_id IN (
    SELECT c.id
    FROM consultants c
    INNER JOIN profiles p ON p.id = c.profile_id
    WHERE p.auth_user_id = auth.uid()
  )
);

-- Admins can read all farmers
CREATE POLICY "Admins can read all farmers"
ON farmers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Consultants can update their assigned farmers
CREATE POLICY "Consultants can update assigned farmers"
ON farmers FOR UPDATE
USING (
  consultant_id IN (
    SELECT c.id
    FROM consultants c
    INNER JOIN profiles p ON p.id = c.profile_id
    WHERE p.auth_user_id = auth.uid()
  )
);

-- Farmers can update their own data
CREATE POLICY "Farmers can update own data"
ON farmers FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- Service role has full access (for API routes)
CREATE POLICY "Service role full access to farmers"
ON farmers FOR ALL
USING (auth.jwt()->>'role' = 'service_role')
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- STEP 4: CONSULTANTS TABLE POLICIES
-- ============================================

-- Consultants can read their own data
CREATE POLICY "Consultants can read own data"
ON consultants FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- Admins can read all consultants
CREATE POLICY "Admins can read all consultants"
ON consultants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Consultants can update their own data
CREATE POLICY "Consultants can update own data"
ON consultants FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- Service role has full access (for API routes)
CREATE POLICY "Service role full access to consultants"
ON consultants FOR ALL
USING (auth.jwt()->>'role' = 'service_role')
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- STEP 5: DATABASE HELPER FUNCTIONS
-- ============================================

-- Function to increment consultant farmer count when linking
CREATE OR REPLACE FUNCTION increment_consultant_farmer_count(consultant_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE consultants
  SET current_farmer_count = current_farmer_count + 1,
      updated_at = NOW()
  WHERE id = consultant_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement consultant farmer count when unlinking
CREATE OR REPLACE FUNCTION decrement_consultant_farmer_count(consultant_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE consultants
  SET current_farmer_count = GREATEST(current_farmer_count - 1, 0),
      updated_at = NOW()
  WHERE id = consultant_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 6: Verify Policies Created
-- ============================================

-- Run this query to verify all policies were created successfully
SELECT
  tablename,
  policyname,
  cmd,
  CASE
    WHEN cmd = 'INSERT' THEN 'CREATE'
    WHEN cmd = 'SELECT' THEN 'READ'
    WHEN cmd = 'UPDATE' THEN 'UPDATE'
    WHEN cmd = 'DELETE' THEN 'DELETE'
    WHEN cmd = 'ALL' THEN 'ALL'
  END as operation
FROM pg_policies
WHERE tablename IN ('profiles', 'farmers', 'consultants')
ORDER BY tablename, cmd;

-- ============================================
-- NOTES
-- ============================================
-- 1. These policies ensure data security at the database level
-- 2. Service role policies allow API routes to bypass RLS for administrative operations
-- 3. Each user role (farmer, consultant, admin) has appropriate access
-- 4. The helper functions maintain data consistency when linking/unlinking farmers
-- 5. All policies follow the principle of least privilege
