import { supabase } from './supabaseClient';

export type DocumentType = 'educational' | 'professional' | 'experience' | 'government';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Sanitize file name to prevent path traversal and special characters
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 100);
}

/**
 * Validate file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF, JPG, and PNG files are allowed' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }
  return { valid: true };
}

/**
 * Upload a single document to Supabase Storage
 */
export async function uploadDocument(
  profileId: string,
  docType: DocumentType,
  file: File
): Promise<UploadResult> {
  try {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const sanitizedName = sanitizeFileName(file.name);
    const fileName = `${timestamp}-${sanitizedName}`;
    const filePath = `${profileId}/${docType}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('consultant-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('consultant-documents')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Upload all consultant documents
 */
export async function uploadConsultantDocuments(
  profileId: string,
  documents: Record<DocumentType, File | null>
): Promise<{ urls: string[]; errors: string[] }> {
  const uploadedUrls: string[] = [];
  const errors: string[] = [];

  for (const [docType, file] of Object.entries(documents)) {
    if (!file) continue;

    const result = await uploadDocument(profileId, docType as DocumentType, file);

    if (result.success && result.url) {
      uploadedUrls.push(result.url);
    } else if (result.error) {
      errors.push(`${docType}: ${result.error}`);
    }
  }

  return { urls: uploadedUrls, errors };
}
