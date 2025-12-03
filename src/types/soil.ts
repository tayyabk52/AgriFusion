/**
 * Type definitions for soil analysis feature
 */

export interface SoilProbabilities {
    alluvial: number;
    black: number;
    cinder: number;
    clay: number;
    laterite: number;
    peat: number;
    red: number;
    sandy: number;
    yellow: number;
}

export interface SoilAnalysisResponse {
    class: string;
    class_id: number;
    confidence: number;
    probabilities: SoilProbabilities;
}

export interface SoilAnalysisError {
    error: string;
    detail?: string;
}

export type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
