/**
 * API utilities for soil analysis
 */

import { SoilAnalysisResponse, SoilAnalysisError } from '@/types/soil';

const API_ENDPOINT = 'https://fatima423-Swinnet.hf.space/predict';
const REQUEST_TIMEOUT = 30000; // 30 seconds

export class SoilAnalysisApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'SoilAnalysisApiError';
  }
}

/**
 * Analyzes soil image using the Hugging Face API
 * @param imageFile - The soil image file to analyze
 * @returns Promise with soil analysis results
 * @throws SoilAnalysisApiError if the request fails
 */
export async function analyzeSoilImage(
  imageFile: File
): Promise<SoilAnalysisResponse> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(imageFile.type)) {
    throw new SoilAnalysisApiError(
      'Invalid file type. Please upload a JPG or PNG image.',
      400
    );
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (imageFile.size > maxSize) {
    throw new SoilAnalysisApiError(
      'File size too large. Please upload an image smaller than 10MB.',
      400
    );
  }

  // Create FormData
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = 'Failed to analyze soil image';
      let errorDetail: string | undefined;

      try {
        const errorData: SoilAnalysisError = await response.json();
        errorMessage = errorData.error || errorMessage;
        errorDetail = errorData.detail;
      } catch {
        // If error response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new SoilAnalysisApiError(
        errorMessage,
        response.status,
        errorDetail
      );
    }

    const data: SoilAnalysisResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof SoilAnalysisApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new SoilAnalysisApiError(
          'Request timeout. Please try again.',
          408
        );
      }

      throw new SoilAnalysisApiError(
        `Network error: ${error.message}`,
        0
      );
    }

    throw new SoilAnalysisApiError(
      'An unexpected error occurred. Please try again.',
      500
    );
  }
}

/**
 * Format soil class name for display
 * @param className - Raw class name from API
 * @returns Formatted class name
 */
export function formatSoilClassName(className: string): string {
  return className
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get confidence level description
 * @param confidence - Confidence score (0-1)
 * @returns Confidence level description
 */
export function getConfidenceLevel(confidence: number): {
  level: string;
  color: string;
} {
  if (confidence >= 0.9) {
    return { level: 'Very High', color: 'emerald' };
  } else if (confidence >= 0.75) {
    return { level: 'High', color: 'green' };
  } else if (confidence >= 0.6) {
    return { level: 'Moderate', color: 'yellow' };
  } else {
    return { level: 'Low', color: 'orange' };
  }
}