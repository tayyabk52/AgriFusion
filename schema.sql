-- This is the main user profile table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'consultant', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20), -- Optional for now, not unique
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended', 'active')),
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES profiles(id), -- Link to consultant
    farm_name VARCHAR(255),
    
    -- Basic location info
    district VARCHAR(100),
    state VARCHAR(100),
    
    -- Essential farm details
    land_size_acres DECIMAL(10, 2),
    current_crops TEXT[], -- Array of current crops
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_farmers_consultant ON farmers(consultant_id);

CREATE TABLE consultants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Essential professional details
    qualification VARCHAR(255) NOT NULL,
    specialization_areas TEXT[] NOT NULL,
    experience_years INTEGER NOT NULL,
    certificate_urls TEXT[], -- Document URLs for verification
    
    -- Service details
    service_areas TEXT[], -- Districts they serve
    current_farmer_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consultants_profile ON consultants(profile_id);

CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    request_type VARCHAR(50) DEFAULT 'registration',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Documents submitted
    submitted_documents JSONB DEFAULT '[]'::jsonb,
    
    -- Admin review
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_profile ON approval_requests(profile_id);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES profiles(id),
    type VARCHAR(50) NOT NULL, -- 'approval', 'system', 'welcome'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);

CREATE TABLE dashboard_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    role VARCHAR(20) NOT NULL,
    
    -- Flexible stats storage
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    /* For farmers: {"land_size": 10, "crops_count": 3, "consultant_name": "John"} */
    /* For consultants: {"farmer_count": 5, "pending_approvals": 2} */
    
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id)
);

CREATE INDEX idx_dashboard_stats_profile ON dashboard_stats(profile_id);

-- This automatically creates a profile when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (auth_user_id, email, full_name, role, status)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'farmer'),
        CASE 
            WHEN new.raw_user_meta_data->>'role' = 'admin' THEN 'active'
            ELSE 'pending'
        END
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the handle_new_user function to handle all user metadata including phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    new_profile_id UUID;
    user_role TEXT;
BEGIN
    -- Extract role
    user_role := COALESCE(new.raw_user_meta_data->>'role', 'farmer');

    -- Insert into profiles table
    INSERT INTO public.profiles (
        auth_user_id,
        email,
        full_name,
        role,
        status,
        avatar_url,
        phone,
        is_verified,
        email_verified_at
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            ''
        ),
        user_role,
        CASE
            WHEN user_role = 'admin' THEN 'active'
            ELSE 'pending'
        END,
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'phone',
        CASE WHEN new.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
        new.email_confirmed_at
    )
    RETURNING id INTO new_profile_id;

    -- If user is a farmer, create entry in farmers table
    IF user_role = 'farmer' THEN
        INSERT INTO public.farmers (profile_id)
        VALUES (new_profile_id);
    END IF;

    -- If user is a consultant, create entry in consultants table
    IF user_role = 'consultant' THEN
        INSERT INTO public.consultants (
            profile_id,
            qualification,
            specialization_areas,
            experience_years
        )
        VALUES (
            new_profile_id,
            COALESCE(new.raw_user_meta_data->>'qualification', 'Not specified'),
            COALESCE(
                ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'specialization_areas')),
                ARRAY[]::TEXT[]
            ),
            COALESCE((new.raw_user_meta_data->>'experience_years')::INTEGER, 0)
        );
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for handling email verification updates
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS trigger AS $$
BEGIN
    -- Update profile when email is verified
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.profiles
        SET
            is_verified = TRUE,
            email_verified_at = NEW.email_confirmed_at,
            updated_at = NOW()
        WHERE auth_user_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;
CREATE TRIGGER on_email_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_email_verification();