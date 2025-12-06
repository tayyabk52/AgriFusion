import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * Request validation interface
 */
interface UploadedFile {
  avatar_url?: string | null;
  document_urls: string[];
}

/**
 * POST /api/consultant/upload-files
 *
 * Uploads avatar and consultant documents using supabaseAdmin (bypasses RLS).
 * This is needed during registration when email confirmation is enabled,
 * as users don't have an active session yet.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
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

    const uploadedFiles: UploadedFile = {
      avatar_url: null,
      document_urls: [],
    };

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
        } else {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(fileName);

          uploadedFiles.avatar_url = publicUrl;
        }
      } catch (error: any) {
        console.error('Avatar upload exception:', error);
        // Don't fail - avatar is optional
      }
    }

    // 3. Upload documents
    const docTypes = ['educational', 'professional', 'experience', 'government'] as const;

    for (const docType of docTypes) {
      const file = formData.get(docType) as File | null;
      if (!file) continue;

      try {
        // Sanitize filename
        const sanitizedName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, '_')
          .substring(0, 100);

        const timestamp = Date.now();
        const fileName = `${timestamp}-${sanitizedName}`;
        const filePath = `${profileId}/${docType}/${fileName}`;

        // Upload using supabaseAdmin to bypass RLS
        const { error: uploadError } = await supabaseAdmin.storage
          .from('consultant-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error(`${docType} upload error:`, uploadError);
          return NextResponse.json(
            { error: `Failed to upload ${docType} document: ${uploadError.message}` },
            { status: 500 }
          );
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('consultant-documents')
          .getPublicUrl(filePath);

        uploadedFiles.document_urls.push(publicUrl);
      } catch (error: any) {
        console.error(`${docType} upload exception:`, error);
        return NextResponse.json(
          { error: `Failed to upload ${docType} document` },
          { status: 500 }
        );
      }
    }

    // 4. Return uploaded URLs
    return NextResponse.json({
      success: true,
      data: uploadedFiles,
    });

  } catch (error: any) {
    console.error('POST /api/consultant/upload-files error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
