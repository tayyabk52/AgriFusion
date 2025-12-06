import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * Request body interface for consultant registration
 */
interface ConsultantRegistrationRequest {
  avatar_url?: string | null;
  country?: string | null;
  state?: string | null;
  district?: string | null;
  service_country?: string | null;
  service_state?: string | null;
  service_district?: string | null;
  document_urls?: string[];
}

/**
 * Standard API response interface
 */
interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string;
}

/**
 * POST /api/consultant/register
 *
 * Completes consultant registration by:
 * 1. Updating profile with avatar
 * 2. Updating consultant record with locations and document URLs
 * 3. Creating approval request
 * 4. Creating welcome notification
 *
 * This route uses supabaseAdmin to bypass RLS policies.
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Authenticate the user (support both session-based and email-confirmation flow)
    const authHeader = request.headers.get('authorization');
    const userIdHeader = request.headers.get('x-user-id');

    let userId: string | null = null;

    if (authHeader) {
      // Session-based authentication (when email confirmation is disabled)
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        console.error('Auth error:', authError);
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      userId = user.id;
    } else if (userIdHeader) {
      // Email confirmation flow - validate user exists
      userId = userIdHeader;
    } else {
      return NextResponse.json(
        { error: 'Missing authentication' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body: ConsultantRegistrationRequest = await request.json();

    // Sanitize string inputs (trim whitespace)
    const avatar_url = body.avatar_url?.trim() || null;
    const country = body.country?.trim() || null;
    const state = body.state?.trim() || null;
    const district = body.district?.trim() || null;
    const service_country = body.service_country?.trim() || null;
    const service_state = body.service_state?.trim() || null;
    const service_district = body.service_district?.trim() || null;
    const document_urls = body.document_urls;

    // Validate document URLs if provided
    if (document_urls && !Array.isArray(document_urls)) {
      return NextResponse.json(
        { error: 'document_urls must be an array' },
        { status: 400 }
      );
    }

    // Validate avatar URL if provided
    if (avatar_url) {
      try {
        new URL(avatar_url);
      } catch {
        return NextResponse.json(
          { error: 'Invalid avatar URL format' },
          { status: 400 }
        );
      }
    }

    // Validate location strings length
    const maxLength = 100;
    const locationFields = { country, state, district, service_country, service_state, service_district };
    for (const [key, value] of Object.entries(locationFields)) {
      if (value && typeof value === 'string' && value.length > maxLength) {
        return NextResponse.json(
          { error: `${key} exceeds maximum length of ${maxLength} characters` },
          { status: 400 }
        );
      }
    }

    // 3. Get profile ID
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('auth_user_id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found. Please contact support.' },
        { status: 404 }
      );
    }

    // 4. Verify user is a consultant
    if (profile.role !== 'consultant') {
      return NextResponse.json(
        { error: 'Only consultants can complete registration' },
        { status: 403 }
      );
    }

    // 5. Update profile with avatar if provided
    // Using supabaseAdmin to bypass RLS policies
    if (avatar_url) {
      const { error: avatarUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (avatarUpdateError) {
        console.error('Avatar update error:', avatarUpdateError);
        // Don't fail registration if avatar update fails - just log it
      }
    }

    // 6. Update consultant record with location data and documents
    // Using supabaseAdmin to bypass RLS policies
    const consultantUpdates = {
      certificate_urls: document_urls || [],
      country: country || null,
      state: state || null,
      district: district || null,
      service_country: service_country || null,
      service_state: service_state || null,
      service_district: service_district || null,
      updated_at: new Date().toISOString(),
    };

    const { error: consultantUpdateError } = await supabaseAdmin
      .from('consultants')
      .update(consultantUpdates)
      .eq('profile_id', profile.id);

    if (consultantUpdateError) {
      console.error('Consultant update error:', consultantUpdateError);
      return NextResponse.json(
        {
          error: 'Failed to save consultant data',
          details: consultantUpdateError.message || 'Database update failed',
        },
        { status: 500 }
      );
    }

    // 7. Create approval request with document metadata
    if (document_urls && document_urls.length > 0) {
      const documentMetadata = {
        educational: document_urls.find((url: string) => url.includes('educational')) || null,
        professional: document_urls.find((url: string) => url.includes('professional')) || null,
        experience: document_urls.find((url: string) => url.includes('experience')) || null,
        government: document_urls.find((url: string) => url.includes('government')) || null,
        submitted_at: new Date().toISOString(),
      };

      const { error: approvalError } = await supabaseAdmin
        .from('approval_requests')
        .insert({
          profile_id: profile.id,
          request_type: 'registration',
          status: 'pending',
          submitted_documents: documentMetadata,
        });

      if (approvalError) {
        console.error('Approval request error:', approvalError);
        // Don't fail registration - approval request is non-critical
      }
    }

    // 8. Create welcome notification
    const { error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert({
        recipient_id: profile.id,
        type: 'welcome',
        title: 'Welcome to AgriFusion!',
        message: 'Your consultant application has been submitted. Our team will review your credentials within 2-3 business days.',
      });

    if (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail registration - notification is non-critical
    }

    // 9. Return success
    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
    });

  } catch (error: any) {
    console.error('POST /api/consultant/register error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
