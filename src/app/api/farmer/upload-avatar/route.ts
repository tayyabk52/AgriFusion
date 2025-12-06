import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * Response interface
 */
interface UploadResponse {
  success?: boolean;
  data?: {
    avatar_url: string | null;
  };
  error?: string;
  details?: string;
}

/**
 * POST /api/farmer/upload-avatar
 *
 * Uploads farmer avatar and updates profile using supabaseAdmin (bypasses RLS).
 * This is needed during registration when email confirmation is enabled,
 * as users don't have an active session yet.
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // 1. Parse the multipart form data
    const formData = await request.formData();

    const profileId = formData.get('profile_id') as string;
    const userId = formData.get('user_id') as string;

    if (!profileId || !userId) {
      return NextResponse.json(
        { error: 'Missing profile_id or user_id' },
        { status: 400 }
      );
    }

    let avatarUrl: string | null = null;

    // 2. Upload avatar if provided
    const avatarFile = formData.get('avatar') as File | null;
    if (avatarFile) {
      try {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        // Upload using supabaseAdmin to bypass RLS
        const { error: uploadError } = await supabaseAdmin.storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Avatar upload error:', uploadError);
          return NextResponse.json(
            { error: `Failed to upload avatar: ${uploadError.message}` },
            { status: 500 }
          );
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;

        // 3. Update profile with avatar URL
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId);

        if (updateError) {
          console.error('Profile update error:', updateError);
          return NextResponse.json(
            { error: `Failed to update profile: ${updateError.message}` },
            { status: 500 }
          );
        }

        console.log('✓ Avatar uploaded and profile updated successfully');
      } catch (error: any) {
        console.error('Avatar upload exception:', error);
        return NextResponse.json(
          { error: 'Failed to upload avatar' },
          { status: 500 }
        );
      }
    }

    // 4. Return success
    return NextResponse.json({
      success: true,
      data: {
        avatar_url: avatarUrl,
      },
    });

  } catch (error: any) {
    console.error('POST /api/farmer/upload-avatar error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
