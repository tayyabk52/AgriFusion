-- Migration Script: Fix Existing Users
-- This script fixes issues with existing user accounts:
-- 1. Updates phone numbers from auth.users metadata
-- 2. Updates email verification status
-- 3. Creates missing farmers table entries

-- ========================================
-- STEP 1: Update phone numbers from auth metadata
-- ========================================
UPDATE public.profiles p
SET
    phone = (
        SELECT au.raw_user_meta_data->>'phone'
        FROM auth.users au
        WHERE au.id = p.auth_user_id
    ),
    updated_at = NOW()
WHERE
    p.phone IS NULL
    AND EXISTS (
        SELECT 1
        FROM auth.users au
        WHERE au.id = p.auth_user_id
        AND au.raw_user_meta_data->>'phone' IS NOT NULL
    );

-- ========================================
-- STEP 2: Update email verification status
-- ========================================
UPDATE public.profiles p
SET
    is_verified = TRUE,
    email_verified_at = (
        SELECT au.email_confirmed_at
        FROM auth.users au
        WHERE au.id = p.auth_user_id
    ),
    updated_at = NOW()
WHERE
    p.is_verified = FALSE
    AND EXISTS (
        SELECT 1
        FROM auth.users au
        WHERE au.id = p.auth_user_id
        AND au.email_confirmed_at IS NOT NULL
    );

-- ========================================
-- STEP 3: Create missing farmers table entries
-- ========================================
INSERT INTO public.farmers (profile_id)
SELECT p.id
FROM public.profiles p
WHERE
    p.role = 'farmer'
    AND NOT EXISTS (
        SELECT 1
        FROM public.farmers f
        WHERE f.profile_id = p.id
    );

-- ========================================
-- STEP 4: Create missing consultants table entries
-- ========================================
INSERT INTO public.consultants (
    profile_id,
    qualification,
    specialization_areas,
    experience_years
)
SELECT
    p.id,
    'Not specified',
    ARRAY[]::TEXT[],
    0
FROM public.profiles p
WHERE
    p.role = 'consultant'
    AND NOT EXISTS (
        SELECT 1
        FROM public.consultants c
        WHERE c.profile_id = p.id
    );

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify the migration worked:

-- Check profiles with phone numbers
-- SELECT id, full_name, email, phone, is_verified FROM public.profiles;

-- Check farmers table entries
-- SELECT f.id, p.full_name, p.email FROM public.farmers f
-- JOIN public.profiles p ON f.profile_id = p.id;

-- Check consultants table entries
-- SELECT c.id, p.full_name, p.email FROM public.consultants c
-- JOIN public.profiles p ON c.profile_id = p.id;

-- ========================================
-- ROLLBACK (if needed)
-- ========================================
-- If you need to rollback, run:
-- UPDATE public.profiles SET phone = NULL WHERE phone IS NOT NULL;
-- UPDATE public.profiles SET is_verified = FALSE, email_verified_at = NULL WHERE is_verified = TRUE;
-- DELETE FROM public.farmers WHERE profile_id IN (SELECT id FROM public.profiles WHERE role = 'farmer');
-- DELETE FROM public.consultants WHERE profile_id IN (SELECT id FROM public.profiles WHERE role = 'consultant');
