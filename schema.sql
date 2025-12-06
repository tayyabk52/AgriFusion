

CREATE TABLE public.approval_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  request_type character varying DEFAULT 'registration'::character varying,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  submitted_documents jsonb DEFAULT '[]'::jsonb,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT approval_requests_pkey PRIMARY KEY (id),
  CONSTRAINT approval_requests_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT approval_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.consultants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  qualification character varying NOT NULL,
  specialization_areas ARRAY NOT NULL,
  experience_years integer NOT NULL,
  certificate_urls ARRAY,
  current_farmer_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  country character varying,
  state character varying,
  district character varying,
  service_country character varying,
  service_state character varying,
  service_district character varying,
  CONSTRAINT consultants_pkey PRIMARY KEY (id),
  CONSTRAINT consultants_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.dashboard_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  role character varying NOT NULL,
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT dashboard_stats_pkey PRIMARY KEY (id),
  CONSTRAINT dashboard_stats_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.farmers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  consultant_id uuid,
  farm_name character varying,
  district character varying,
  state character varying,
  land_size_acres numeric,
  current_crops ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT farmers_pkey PRIMARY KEY (id),
  CONSTRAINT farmers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT farmers_consultant_id_fkey FOREIGN KEY (consultant_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  type character varying NOT NULL,
  title character varying NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE,
  role character varying NOT NULL CHECK (role::text = ANY (ARRAY['farmer'::character varying, 'consultant'::character varying, 'admin'::character varying]::text[])),
  full_name character varying NOT NULL,
  email character varying UNIQUE,
  phone character varying,
  avatar_url text,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'suspended'::character varying, 'active'::character varying]::text[])),
  is_verified boolean DEFAULT false,
  email_verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id)
);


[
  {
    "table_name": "approval_requests",
    "index_name": "approval_requests_pkey",
    "index_definition": "CREATE UNIQUE INDEX approval_requests_pkey ON public.approval_requests USING btree (id)"
  },
  {
    "table_name": "approval_requests",
    "index_name": "idx_approval_requests_profile",
    "index_definition": "CREATE INDEX idx_approval_requests_profile ON public.approval_requests USING btree (profile_id)"
  },
  {
    "table_name": "approval_requests",
    "index_name": "idx_approval_requests_status",
    "index_definition": "CREATE INDEX idx_approval_requests_status ON public.approval_requests USING btree (status)"
  },
  {
    "table_name": "consultants",
    "index_name": "consultants_pkey",
    "index_definition": "CREATE UNIQUE INDEX consultants_pkey ON public.consultants USING btree (id)"
  },
  {
    "table_name": "consultants",
    "index_name": "consultants_profile_id_key",
    "index_definition": "CREATE UNIQUE INDEX consultants_profile_id_key ON public.consultants USING btree (profile_id)"
  },
  {
    "table_name": "consultants",
    "index_name": "idx_consultants_country",
    "index_definition": "CREATE INDEX idx_consultants_country ON public.consultants USING btree (country)"
  },
  {
    "table_name": "consultants",
    "index_name": "idx_consultants_district",
    "index_definition": "CREATE INDEX idx_consultants_district ON public.consultants USING btree (district)"
  },
  {
    "table_name": "consultants",
    "index_name": "idx_consultants_profile",
    "index_definition": "CREATE INDEX idx_consultants_profile ON public.consultants USING btree (profile_id)"
  },
  {
    "table_name": "consultants",
    "index_name": "idx_consultants_service_country",
    "index_definition": "CREATE INDEX idx_consultants_service_country ON public.consultants USING btree (service_country)"
  },
  {
    "table_name": "consultants",
    "index_name": "idx_consultants_service_district",
    "index_definition": "CREATE INDEX idx_consultants_service_district ON public.consultants USING btree (service_district)"
  },
  {
    "table_name": "consultants",
    "index_name": "idx_consultants_service_state",
    "index_definition": "CREATE INDEX idx_consultants_service_state ON public.consultants USING btree (service_state)"
  },
  {
    "table_name": "consultants",
    "index_name": "idx_consultants_state",
    "index_definition": "CREATE INDEX idx_consultants_state ON public.consultants USING btree (state)"
  },
  {
    "table_name": "dashboard_stats",
    "index_name": "dashboard_stats_pkey",
    "index_definition": "CREATE UNIQUE INDEX dashboard_stats_pkey ON public.dashboard_stats USING btree (id)"
  },
  {
    "table_name": "dashboard_stats",
    "index_name": "dashboard_stats_profile_id_key",
    "index_definition": "CREATE UNIQUE INDEX dashboard_stats_profile_id_key ON public.dashboard_stats USING btree (profile_id)"
  },
  {
    "table_name": "dashboard_stats",
    "index_name": "idx_dashboard_stats_profile",
    "index_definition": "CREATE INDEX idx_dashboard_stats_profile ON public.dashboard_stats USING btree (profile_id)"
  },
  {
    "table_name": "farmers",
    "index_name": "farmers_pkey",
    "index_definition": "CREATE UNIQUE INDEX farmers_pkey ON public.farmers USING btree (id)"
  },
  {
    "table_name": "farmers",
    "index_name": "farmers_profile_id_key",
    "index_definition": "CREATE UNIQUE INDEX farmers_profile_id_key ON public.farmers USING btree (profile_id)"
  },
  {
    "table_name": "farmers",
    "index_name": "idx_farmers_consultant",
    "index_definition": "CREATE INDEX idx_farmers_consultant ON public.farmers USING btree (consultant_id)"
  },
  {
    "table_name": "notifications",
    "index_name": "idx_notifications_recipient",
    "index_definition": "CREATE INDEX idx_notifications_recipient ON public.notifications USING btree (recipient_id, is_read)"
  },
  {
    "table_name": "notifications",
    "index_name": "notifications_pkey",
    "index_definition": "CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id)"
  },
  {
    "table_name": "profiles",
    "index_name": "idx_profiles_email",
    "index_definition": "CREATE INDEX idx_profiles_email ON public.profiles USING btree (email)"
  },
  {
    "table_name": "profiles",
    "index_name": "idx_profiles_role",
    "index_definition": "CREATE INDEX idx_profiles_role ON public.profiles USING btree (role)"
  },
  {
    "table_name": "profiles",
    "index_name": "idx_profiles_status",
    "index_definition": "CREATE INDEX idx_profiles_status ON public.profiles USING btree (status)"
  },
  {
    "table_name": "profiles",
    "index_name": "profiles_auth_user_id_key",
    "index_definition": "CREATE UNIQUE INDEX profiles_auth_user_id_key ON public.profiles USING btree (auth_user_id)"
  },
  {
    "table_name": "profiles",
    "index_name": "profiles_email_key",
    "index_definition": "CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)"
  },
  {
    "table_name": "profiles",
    "index_name": "profiles_pkey",
    "index_definition": "CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)"
  }
]


[
  {
    "table_name": "approval_requests",
    "policy_name": "Admins can delete approval requests",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "DELETE",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.auth_user_id = auth.uid()) AND ((profiles.role)::text = 'admin'::text))))",
    "with_check_expression": null
  },
  {
    "table_name": "approval_requests",
    "policy_name": "Admins can update approval requests",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "UPDATE",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.auth_user_id = auth.uid()) AND ((profiles.role)::text = 'admin'::text))))",
    "with_check_expression": null
  },
  {
    "table_name": "approval_requests",
    "policy_name": "Allow registration approval requests",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "INSERT",
    "using_expression": null,
    "with_check_expression": "(profile_id IN ( SELECT profiles.id\n   FROM profiles))"
  },
  {
    "table_name": "approval_requests",
    "policy_name": "Users can read own approval requests",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "SELECT",
    "using_expression": "((profile_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.auth_user_id = auth.uid()))) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.auth_user_id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))))",
    "with_check_expression": null
  },
  {
    "table_name": "notifications",
    "policy_name": "Allow system notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "INSERT",
    "using_expression": null,
    "with_check_expression": "(recipient_id IN ( SELECT profiles.id\n   FROM profiles))"
  },
  {
    "table_name": "notifications",
    "policy_name": "Users can delete own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "DELETE",
    "using_expression": "((recipient_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.auth_user_id = auth.uid()))) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.auth_user_id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))))",
    "with_check_expression": null
  },
  {
    "table_name": "notifications",
    "policy_name": "Users can read own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "SELECT",
    "using_expression": "((recipient_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.auth_user_id = auth.uid()))) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.auth_user_id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))))",
    "with_check_expression": null
  },
  {
    "table_name": "notifications",
    "policy_name": "Users can update own notifications",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "command": "UPDATE",
    "using_expression": "(recipient_id IN ( SELECT profiles.id\n   FROM profiles\n  WHERE (profiles.auth_user_id = auth.uid())))",
    "with_check_expression": null
  }
]

[
  {
    "function_name": "handle_email_verification",
    "function_definition": "CREATE OR REPLACE FUNCTION public.handle_email_verification()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\r\nBEGIN\r\n    RAISE NOTICE 'handle_email_verification triggered for user: %', NEW.id;\r\n\r\n    -- Update profile when email is verified\r\n    IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN\r\n        UPDATE public.profiles\r\n        SET\r\n            is_verified = TRUE,\r\n            email_verified_at = NEW.email_confirmed_at,\r\n            updated_at = NOW()\r\n        WHERE auth_user_id = NEW.id;\r\n\r\n        RAISE NOTICE 'Profile updated as verified for user: %', NEW.id;\r\n    END IF;\r\n\r\n    RETURN NEW;\r\nEXCEPTION\r\n    WHEN OTHERS THEN\r\n        RAISE WARNING 'Error in handle_email_verification: %', SQLERRM;\r\n        RETURN NEW;\r\nEND;\r\n$function$\n"
  },
  {
    "function_name": "handle_new_user",
    "function_definition": "CREATE OR REPLACE FUNCTION public.handle_new_user()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\r\nDECLARE\r\n    new_profile_id UUID;\r\n    user_role TEXT;\r\nBEGIN\r\n    -- Log the trigger execution\r\n    RAISE NOTICE 'handle_new_user triggered for user: %', NEW.id;\r\n\r\n    -- Extract role from metadata\r\n    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'farmer');\r\n\r\n    RAISE NOTICE 'User role: %', user_role;\r\n\r\n    -- Insert into profiles table\r\n    INSERT INTO public.profiles (\r\n        auth_user_id,\r\n        email,\r\n        full_name,\r\n        role,\r\n        status,\r\n        avatar_url,\r\n        phone,\r\n        is_verified,\r\n        email_verified_at,\r\n        created_at,\r\n        updated_at\r\n    )\r\n    VALUES (\r\n        NEW.id,\r\n        NEW.email,\r\n        COALESCE(\r\n            NEW.raw_user_meta_data->>'full_name',\r\n            NEW.raw_user_meta_data->>'name',\r\n            ''\r\n        ),\r\n        user_role,\r\n        CASE\r\n            WHEN user_role = 'admin' THEN 'active'\r\n            ELSE 'pending'\r\n        END,\r\n        NEW.raw_user_meta_data->>'avatar_url',\r\n        NEW.raw_user_meta_data->>'phone',\r\n        CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,\r\n        NEW.email_confirmed_at,\r\n        NOW(),\r\n        NOW()\r\n    )\r\n    RETURNING id INTO new_profile_id;\r\n\r\n    RAISE NOTICE 'Profile created with ID: %', new_profile_id;\r\n\r\n    -- Create farmer entry if role is farmer\r\n    IF user_role = 'farmer' THEN\r\n        INSERT INTO public.farmers (profile_id, created_at, updated_at)\r\n        VALUES (new_profile_id, NOW(), NOW());\r\n        RAISE NOTICE 'Farmer entry created for profile: %', new_profile_id;\r\n    END IF;\r\n\r\n    -- Create consultant entry if role is consultant\r\n    IF user_role = 'consultant' THEN\r\n        INSERT INTO public.consultants (\r\n            profile_id,\r\n            qualification,\r\n            specialization_areas,\r\n            experience_years,\r\n            created_at,\r\n            updated_at\r\n        )\r\n        VALUES (\r\n            new_profile_id,\r\n            COALESCE(NEW.raw_user_meta_data->>'qualification', 'Not specified'),\r\n            COALESCE(\r\n                ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'specialization_areas'))::TEXT[],\r\n                ARRAY[]::TEXT[]\r\n            ),\r\n            COALESCE((NEW.raw_user_meta_data->>'experience_years')::INTEGER, 0),\r\n            NOW(),\r\n            NOW()\r\n        );\r\n        RAISE NOTICE 'Consultant entry created for profile: %', new_profile_id;\r\n    END IF;\r\n\r\n    RETURN NEW;\r\nEXCEPTION\r\n    WHEN OTHERS THEN\r\n        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;\r\n        RETURN NEW;\r\nEND;\r\n$function$\n"
  }
]