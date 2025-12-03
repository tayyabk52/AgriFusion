-- ============================================
-- FIX: RLS Policies for approval_requests table
-- ============================================

-- First, drop the existing policies
DROP POLICY IF EXISTS "Users can create own approval requests" ON approval_requests;
DROP POLICY IF EXISTS "Users can read own approval requests" ON approval_requests;
DROP POLICY IF EXISTS "Admins can read all approval requests" ON approval_requests;
DROP POLICY IF EXISTS "Admins can update approval requests" ON approval_requests;

-- CRITICAL: Make sure RLS is enabled on the table
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to create approval requests for their profile
CREATE POLICY "Authenticated users can create approval requests"
ON approval_requests FOR INSERT
WITH CHECK (
  -- User must be authenticated
  auth.role() = 'authenticated' AND
  -- The profile_id must belong to the authenticated user
  profile_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- Policy 2: Users can read their own approval requests
CREATE POLICY "Users can read own approval requests"
ON approval_requests FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
  OR
  -- Admins can read all
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 3: Admins can update approval requests (approve/reject)
CREATE POLICY "Admins can update approval requests"
ON approval_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 4: Admins can delete approval requests
CREATE POLICY "Admins can delete approval requests"
ON approval_requests FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- FIX: RLS Policies for notifications table
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- CRITICAL: Make sure RLS is enabled on the table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow service role to create notifications (for system-generated)
CREATE POLICY "Service role can create notifications"
ON notifications FOR INSERT
WITH CHECK (
  -- Service role can always insert (for system notifications)
  auth.jwt()->>'role' = 'service_role'
  OR
  -- Authenticated users can create notifications for themselves
  (
    auth.role() = 'authenticated' AND
    recipient_id IN (
      SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    )
  )
);

-- Policy 2: Users can read their own notifications
CREATE POLICY "Users can read own notifications"
ON notifications FOR SELECT
USING (
  recipient_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
  OR
  -- Admins can read all
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 3: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (
  recipient_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- Policy 4: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (
  recipient_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
  OR
  -- Admins can delete all
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- Verify policies are active
-- ============================================

-- Check approval_requests policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'approval_requests';

-- Check notifications policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'notifications';
