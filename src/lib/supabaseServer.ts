import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
}

/**
 * Supabase Admin Client - Service Role
 *
 * WARNING: This client bypasses Row Level Security (RLS) policies!
 * Only use this for:
 * - Server-side API routes
 * - Administrative operations
 * - Operations that require elevated permissions
 *
 * NEVER expose this client to the browser or use it in client components.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
