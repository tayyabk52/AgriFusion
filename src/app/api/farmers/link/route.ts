import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * POST /api/farmers/link
 *
 * Links an unassigned farmer to the authenticated consultant.
 * Only accessible by consultants.
 *
 * Request Body:
 * - farmerId: UUID of the farmer record to link
 * - farmerProfileId: UUID of the farmer's profile
 */
export async function POST(request: NextRequest) {
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

    // 2. Get consultant profile
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
        { error: 'Only consultants can link farmers' },
        { status: 403 }
      );
    }

    // 3. Get consultant record (we need both profile_id and consultants.id)
    const { data: consultant, error: consultantError } = await supabaseAdmin
      .from('consultants')
      .select('id, profile_id')
      .eq('profile_id', profile.id)
      .single();

    if (consultantError || !consultant) {
      console.error('Consultant error:', consultantError);
      return NextResponse.json(
        { error: 'Consultant record not found' },
        { status: 404 }
      );
    }

    // 4. Parse request body
    const body = await request.json();
    const { farmerId, farmerProfileId } = body;

    if (!farmerId || !farmerProfileId) {
      return NextResponse.json(
        { error: 'Missing required fields: farmerId and farmerProfileId' },
        { status: 400 }
      );
    }

    // 5. Verify farmer exists and is unassigned
    const { data: farmer, error: farmerCheckError } = await supabaseAdmin
      .from('farmers')
      .select('id, consultant_id, profile_id')
      .eq('id', farmerId)
      .single();

    if (farmerCheckError || !farmer) {
      console.error('Farmer check error:', farmerCheckError);
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    if (farmer.consultant_id) {
      return NextResponse.json(
        { error: 'Farmer is already assigned to a consultant' },
        { status: 400 }
      );
    }

    // Verify the profile_id matches
    if (farmer.profile_id !== farmerProfileId) {
      return NextResponse.json(
        { error: 'Farmer profile ID mismatch' },
        { status: 400 }
      );
    }

    // 6. Link farmer to consultant (use profile_id, not consultants.id)
    const { error: linkError } = await supabaseAdmin
      .from('farmers')
      .update({
        consultant_id: consultant.profile_id, // Use consultant's profile_id
        updated_at: new Date().toISOString(),
      })
      .eq('id', farmerId)
      .is('consultant_id', null); // Double-check still unassigned (prevents race conditions)

    if (linkError) {
      console.error('Link error:', linkError);
      return NextResponse.json(
        { error: 'Failed to link farmer. The farmer may have been assigned to another consultant.' },
        { status: 500 }
      );
    }

    // 7. Update farmer profile status to active
    const { error: statusError } = await supabaseAdmin
      .from('profiles')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', farmerProfileId);

    if (statusError) {
      console.error('Status update error:', statusError);

      // Rollback: unlink farmer
      await supabaseAdmin
        .from('farmers')
        .update({
          consultant_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', farmerId);

      return NextResponse.json(
        { error: 'Failed to update farmer status. Changes have been rolled back.' },
        { status: 500 }
      );
    }

    // 8. Update consultant farmer count
    const { error: countError } = await supabaseAdmin
      .rpc('increment_consultant_farmer_count', {
        consultant_id_param: consultant.id,
      });

    if (countError) {
      console.error('Count update error:', countError);
      // Don't rollback for this - the link is still valid
      // Just log the error
    }

    // 9. Return success
    return NextResponse.json({
      success: true,
      message: 'Farmer linked successfully',
      data: {
        farmerId: farmer.id,
        consultantId: consultant.id,
      },
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
