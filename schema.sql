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

    -- Update the handle_new_user function to handle Google sign-in
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (auth_user_id, email, full_name, role, status, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            ''
        ),
        COALESCE(new.raw_user_meta_data->>'role', 'farmer'),
        CASE 
            WHEN new.raw_user_meta_data->>'role' = 'admin' THEN 'active'
            ELSE 'pending'
        END,
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;