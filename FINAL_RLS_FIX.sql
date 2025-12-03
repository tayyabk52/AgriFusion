-- ============================================
-- FINAL FIX: Complete RLS Reset and Fix
-- ============================================

-- ============================================
-- STEP 1: Drop ALL existing policies (catch all variations)
-- ============================================

-- Drop all approval_requests policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'approval_requests') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON approval_requests';
    END LOOP;
END $$;

-- Drop all notifications policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'notifications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON notifications';
    END LOOP;
END $$;

-- ============================================
-- STEP 2: Create NEW policies for approval_requests
-- ============================================

-- Allow INSERT during registration (validates profile exists)
CREATE POLICY "Allow registration approval requests"
ON approval_requests FOR INSERT
WITH CHECK (
  profile_id IN (SELECT id FROM profiles)
);

-- Users can read their own approval requests
CREATE POLICY "Users can read own approval requests"
ON approval_requests FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admins can update approval requests (approve/reject)
CREATE POLICY "Admins can update approval requests"
ON approval_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Admins can delete approval requests
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
-- STEP 3: Create NEW policies for notifications
-- ============================================

-- Allow INSERT for system notifications (validates recipient exists)
CREATE POLICY "Allow system notifications"
ON notifications FOR INSERT
WITH CHECK (
  recipient_id IN (SELECT id FROM profiles)
);

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
ON notifications FOR SELECT
USING (
  recipient_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (
  recipient_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (
  recipient_id IN (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- STEP 4: Verify all policies are created
-- ============================================

SELECT 
  tablename, 
  policyname, 
  cmd,
  CASE 
    WHEN cmd = 'INSERT' THEN 'CREATE'
    WHEN cmd = 'SELECT' THEN 'READ'
    WHEN cmd = 'UPDATE' THEN 'UPDATE'
    WHEN cmd = 'DELETE' THEN 'DELETE'
  END as operation
FROM pg_policies
WHERE tablename IN ('approval_requests', 'notifications')
ORDER BY tablename, cmd;
