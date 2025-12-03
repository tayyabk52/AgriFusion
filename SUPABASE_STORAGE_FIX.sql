-- ============================================
-- FIX: Storage RLS Policies for consultant-documents
-- ============================================

-- First, drop the existing policies
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all documents" ON storage.objects;

-- New Policy 1: Allow authenticated users to upload documents
-- This allows uploads during registration before full authentication
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'consultant-documents' AND
  auth.role() = 'authenticated'
);

-- New Policy 2: Users can read documents in their profile folder
-- This uses the profile_id in the path
CREATE POLICY "Users can read own profile documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'consultant-documents' AND
  (
    -- User can access their own folder (path starts with their profile_id)
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM profiles WHERE auth_user_id = auth.uid()
    )
    OR
    -- Admins can access all folders
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);

-- New Policy 3: Allow authenticated users to update/delete their own documents
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'consultant-documents' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM profiles WHERE auth_user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);

-- New Policy 4: Allow users to delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'consultant-documents' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM profiles WHERE auth_user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);

-- ============================================
-- IMPORTANT: Make sure the bucket exists and RLS is enabled
-- ============================================

-- Check if bucket exists (run this separately to verify)
-- SELECT * FROM storage.buckets WHERE name = 'consultant-documents';

-- If bucket doesn't exist, create it:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'consultant-documents',
--   'consultant-documents',
--   false,
--   5242880,
--   ARRAY['application/pdf', 'image/jpeg', 'image/png']
-- );
