import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * GET /api/farmers/unassigned
 *
 * Fetches unassigned farmers (consultant_id = NULL) with pagination and filtering.
 * Only accessible by consultants.
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 * - search: Search term for name, email, phone, district, state
 * - district: Filter by district
 * - state: Filter by state
 * - crops: Filter by crops (comma-separated)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the consultant making the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Verify user is a consultant
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (profile.role !== 'consultant') {
      return NextResponse.json(
        { error: 'Only consultants can access this endpoint' },
        { status: 403 }
      );
    }

    // 3. Parse pagination and filter parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search')?.trim() || '';
    const district = searchParams.get('district')?.trim() || '';
    const state = searchParams.get('state')?.trim() || '';
    const cropsParam = searchParams.get('crops')?.trim() || '';
    const crops = cropsParam ? cropsParam.split(',').map(c => c.trim()).filter(Boolean) : [];

    const offset = (page - 1) * limit;

    // 4. Build the query with service role (bypasses RLS)
    let query = supabaseAdmin
      .from('farmers')
      .select(`
        id,
        profile_id,
        farm_name,
        district,
        state,
        land_size_acres,
        current_crops,
        created_at,
        updated_at,
        profiles:profile_id (
          id,
          full_name,
          email,
          phone,
          avatar_url,
          status
        )
      `, { count: 'exact' })
      .is('consultant_id', null);  // Only unassigned farmers

    // 5. Apply status filter - include both pending and active
    // We need to filter on the joined profiles table
    // Note: Supabase doesn't support filtering on joined relations directly in the query builder
    // So we'll fetch and filter in memory, or use a more complex approach

    // For now, let's use a workaround by filtering after fetching
    // This is acceptable for moderate data sizes with pagination

    // 6. Apply district filter
    if (district) {
      query = query.eq('district', district);
    }

    // 7. Apply state filter
    if (state) {
      query = query.eq('state', state);
    }

    // 8. Apply crops filter (if farmer grows any of the specified crops)
    if (crops.length > 0) {
      query = query.overlaps('current_crops', crops);
    }

    // 9. Apply pagination and sorting
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    const { data: rawData, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch farmers', details: error.message },
        { status: 500 }
      );
    }

    // 10. Filter by status (pending or active) and apply search
    let farmers = (rawData || []).filter(farmer => {
      const profile = farmer.profiles as any;
      if (!profile) return false;

      // Filter by status - include both pending and active
      const statusMatch = profile.status === 'pending' || profile.status === 'active';
      if (!statusMatch) return false;

      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        const nameMatch = profile.full_name?.toLowerCase().includes(searchLower);
        const emailMatch = profile.email?.toLowerCase().includes(searchLower);
        const phoneMatch = profile.phone?.toLowerCase().includes(searchLower);
        const districtMatch = farmer.district?.toLowerCase().includes(searchLower);
        const stateMatch = farmer.state?.toLowerCase().includes(searchLower);

        return nameMatch || emailMatch || phoneMatch || districtMatch || stateMatch;
      }

      return true;
    });

    // 11. Return paginated response
    return NextResponse.json({
      farmers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
