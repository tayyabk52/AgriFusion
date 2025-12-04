import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * GET /api/farmers/filters
 *
 * Returns available filter options from unassigned farmers.
 * Only accessible by consultants.
 *
 * Returns:
 * - districts: Array of unique district names
 * - states: Array of unique state names
 * - crops: Array of unique crop names
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the consultant
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

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

    // 3. Fetch all unassigned farmers to extract filter options
    const { data: farmers, error: farmersError } = await supabaseAdmin
      .from('farmers')
      .select(`
        district,
        state,
        current_crops,
        profiles:profile_id (
          status
        )
      `)
      .is('consultant_id', null);

    if (farmersError) {
      console.error('Farmers fetch error:', farmersError);
      return NextResponse.json(
        { error: 'Failed to fetch filter options' },
        { status: 500 }
      );
    }

    // 4. Extract unique values for each filter
    const districts = new Set<string>();
    const states = new Set<string>();
    const crops = new Set<string>();

    (farmers || []).forEach((farmer: any) => {
      // Only include farmers with pending or active status
      const profile = farmer.profiles;
      if (profile && (profile.status === 'pending' || profile.status === 'active')) {
        if (farmer.district) {
          districts.add(farmer.district);
        }
        if (farmer.state) {
          states.add(farmer.state);
        }
        if (Array.isArray(farmer.current_crops)) {
          farmer.current_crops.forEach((crop: string) => {
            if (crop) {
              crops.add(crop);
            }
          });
        }
      }
    });

    // 5. Convert sets to sorted arrays
    return NextResponse.json({
      districts: Array.from(districts).sort(),
      states: Array.from(states).sort(),
      crops: Array.from(crops).sort(),
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
