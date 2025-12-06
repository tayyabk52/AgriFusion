import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { validateEmail } from '@/lib/validationUtils';

/**
 * GET /api/consultant/profile
 *
 * Fetches the authenticated consultant's profile and professional data.
 * Only accessible by consultants.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the user
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

    // 2. Get profile with consultant data (JOIN)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        phone,
        avatar_url,
        role,
        consultants!inner (
          id,
          qualification,
          specialization_areas,
          experience_years,
          country,
          state,
          district,
          service_country,
          service_state,
          service_district,
          certificate_urls
        )
      `)
      .eq('auth_user_id', user.id)
      .single();

    if (profileError || !profileData) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // 3. Verify user is a consultant
    if (profileData.role !== 'consultant') {
      return NextResponse.json(
        { error: 'Only consultants can access this endpoint' },
        { status: 403 }
      );
    }

    // 4. Transform response (flatten consultants array to single object)
    const consultant = Array.isArray(profileData.consultants)
      ? profileData.consultants[0]
      : profileData.consultants;

    const response = {
      success: true,
      data: {
        id: profileData.id,
        full_name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone,
        avatar_url: profileData.avatar_url,
        consultant: {
          id: consultant.id,
          qualification: consultant.qualification,
          specialization_areas: consultant.specialization_areas || [],
          experience_years: consultant.experience_years,
          country: consultant.country || '',
          state: consultant.state || '',
          district: consultant.district || '',
          service_country: consultant.service_country || '',
          service_state: consultant.service_state || '',
          service_district: consultant.service_district || '',
          certificate_urls: consultant.certificate_urls || [],
        }
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('GET /api/consultant/profile error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/consultant/profile
 *
 * Updates the authenticated consultant's profile and professional data.
 * Only accessible by consultants.
 *
 * Request Body:
 * - full_name: string (required, max 255 chars)
 * - email: string (required, valid format, max 255 chars)
 * - phone: string (optional, format: +{code}{digits})
 * - avatar_url: string (optional, URL)
 * - qualification: string (required, max 255 chars)
 * - specialization_areas: string[] (required, min 1 item)
 * - experience_years: number (required, >= 0, <= 100)
 * - country: string (optional)
 * - state: string (optional)
 * - district: string (optional)
 */
export async function PUT(request: NextRequest) {
  try {
    // 1. Authenticate the user
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

    // 2. Get profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, email')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // 3. Verify user is a consultant
    if (profile.role !== 'consultant') {
      return NextResponse.json(
        { error: 'Only consultants can update this profile' },
        { status: 403 }
      );
    }

    // 4. Parse request body
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      avatar_url,
      qualification,
      specialization_areas,
      experience_years,
      country,
      state,
      district,
      service_country,
      service_state,
      service_district,
    } = body;

    // 5. Validate and sanitize inputs
    const errors: Record<string, string> = {};

    // Sanitize text inputs
    const sanitizedFullName = full_name?.trim() || '';
    const sanitizedEmail = email?.trim().toLowerCase() || '';
    const sanitizedPhone = phone?.trim() || '';
    const sanitizedQualification = qualification?.trim() || '';
    const sanitizedAvatarUrl = avatar_url?.trim() || '';

    // Sanitize arrays
    const sanitizedSpecializations = Array.isArray(specialization_areas)
      ? specialization_areas
          .filter(s => typeof s === 'string')
          .map(s => s.trim())
          .filter(s => s.length > 0)
      : [];

    // Sanitize personal location fields
    const sanitizedCountry = country?.trim() || '';
    const sanitizedState = state?.trim() || '';
    const sanitizedDistrict = district?.trim() || '';

    // Sanitize service location fields
    const sanitizedServiceCountry = service_country?.trim() || '';
    const sanitizedServiceState = service_state?.trim() || '';
    const sanitizedServiceDistrict = service_district?.trim() || '';

    // Validate full_name
    if (!sanitizedFullName) {
      errors.full_name = 'Full name is required';
    } else if (sanitizedFullName.length > 255) {
      errors.full_name = 'Full name cannot exceed 255 characters';
    }

    // Validate email
    if (!sanitizedEmail) {
      errors.email = 'Email is required';
    } else if (!validateEmail(sanitizedEmail)) {
      errors.email = 'Please enter a valid email address';
    } else if (sanitizedEmail.length > 255) {
      errors.email = 'Email cannot exceed 255 characters';
    } else if (sanitizedEmail !== profile.email) {
      // Check email uniqueness only if it changed
      const { data: existingEmail } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', sanitizedEmail)
        .neq('id', profile.id)
        .single();

      if (existingEmail) {
        errors.email = 'This email address is already in use';
      }
    }

    // Validate phone (optional)
    if (sanitizedPhone) {
      const phoneMatch = sanitizedPhone.match(/^\+(\d{1,4})(\d{7,15})$/);
      if (!phoneMatch) {
        errors.phone = 'Invalid phone format. Use +{countryCode}{number}';
      } else {
        const [, countryCode, number] = phoneMatch;
        // Pakistan-specific validation
        if (countryCode === '92' && number.length !== 10) {
          errors.phone = 'Pakistani phone numbers must be exactly 10 digits';
        }
      }
    }

    // Validate avatar URL (optional)
    if (sanitizedAvatarUrl) {
      try {
        new URL(sanitizedAvatarUrl);
      } catch {
        errors.avatar_url = 'Invalid avatar URL';
      }
    }

    // Validate qualification
    if (!sanitizedQualification) {
      errors.qualification = 'Qualification is required';
    } else if (sanitizedQualification.length > 255) {
      errors.qualification = 'Qualification cannot exceed 255 characters';
    }

    // Validate specialization_areas
    if (!Array.isArray(specialization_areas)) {
      errors.specialization_areas = 'Specialization areas must be an array';
    } else if (sanitizedSpecializations.length === 0) {
      errors.specialization_areas = 'Please select at least one specialization area';
    } else if (sanitizedSpecializations.some(s => s.length > 100)) {
      errors.specialization_areas = 'Each specialization cannot exceed 100 characters';
    }

    // Validate experience_years
    if (experience_years === undefined || experience_years === null) {
      errors.experience_years = 'Experience years is required';
    } else if (!Number.isInteger(experience_years)) {
      errors.experience_years = 'Experience years must be a whole number';
    } else if (experience_years < 0) {
      errors.experience_years = 'Experience years cannot be negative';
    } else if (experience_years > 100) {
      errors.experience_years = 'Experience years cannot exceed 100';
    }

    // Validate personal location fields (optional)
    if (sanitizedCountry && sanitizedCountry.length > 100) {
      errors.country = 'Country name cannot exceed 100 characters';
    }
    if (sanitizedState && sanitizedState.length > 100) {
      errors.state = 'State name cannot exceed 100 characters';
    }
    if (sanitizedDistrict && sanitizedDistrict.length > 100) {
      errors.district = 'District name cannot exceed 100 characters';
    }

    // Validate service location fields (optional)
    if (sanitizedServiceCountry && sanitizedServiceCountry.length > 100) {
      errors.service_country = 'Service country name cannot exceed 100 characters';
    }
    if (sanitizedServiceState && sanitizedServiceState.length > 100) {
      errors.service_state = 'Service state name cannot exceed 100 characters';
    }
    if (sanitizedServiceDistrict && sanitizedServiceDistrict.length > 100) {
      errors.service_district = 'Service district name cannot exceed 100 characters';
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors,
        },
        { status: 400 }
      );
    }

    // 6. Update profiles table
    const profileUpdates = {
      full_name: sanitizedFullName,
      email: sanitizedEmail,
      phone: sanitizedPhone || null,
      avatar_url: sanitizedAvatarUrl || null,
      updated_at: new Date().toISOString(),
    };

    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdates)
      .eq('id', profile.id);

    if (profileUpdateError) {
      console.error('Profile update error:', profileUpdateError);

      // Check for unique constraint violation
      if (profileUpdateError.code === '23505') {
        return NextResponse.json(
          {
            error: 'Email already in use',
            errors: { email: 'This email address is already registered' },
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // 7. Update consultants table
    const consultantUpdates = {
      qualification: sanitizedQualification,
      specialization_areas: sanitizedSpecializations,
      experience_years: experience_years,
      country: sanitizedCountry || null,
      state: sanitizedState || null,
      district: sanitizedDistrict || null,
      service_country: sanitizedServiceCountry || null,
      service_state: sanitizedServiceState || null,
      service_district: sanitizedServiceDistrict || null,
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
          error: 'Failed to update consultant details',
          details: 'Profile updated but professional information failed. Please try again.',
        },
        { status: 500 }
      );
    }

    // 8. Return success
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });

  } catch (error: any) {
    console.error('PUT /api/consultant/profile error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
