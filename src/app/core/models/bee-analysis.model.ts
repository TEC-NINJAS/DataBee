/**
 * Contrato BeeAnalysisV2 (schema_version 2.0, prompt bee-v2) — somente leitura no frontend.
 * Quem gera e valida é a Edge Function analyze-observation (IMP-023/028/029).
 * Sem porcentagem/score/confiança numérica: `rank` apenas ordena (1..3).
 */

export type TaxonomicLevel = 'family' | 'genus' | 'species';
export type BeeAnalysisStatus = 'possible_match' | 'inconclusive' | 'no_match';

export interface BeeMatch {
  taxonId: string;
  rank: number;
  taxonomicLevel: TaxonomicLevel;
  visualEvidence: string[];
}

export interface BeeAnalysisV2 {
  status: BeeAnalysisStatus;
  matches: BeeMatch[];
  imageQuality: 'adequate' | 'poor';
  limitations: string[];
}

/** Envelope de sucesso de POST analyze-observation. */
export interface AnalyzeObservationResponse {
  observation_id: string;
  status: string;
  analysis: BeeAnalysisV2;
}

/** Envelope de erro sanitizado (401/403/404/400/409/429/502/504). */
export interface AnalyzeObservationError {
  error: { code: string; message: string };
  observation_id?: string;
}

export const TAXONOMIC_LEVEL_LABEL: Record<TaxonomicLevel, string> = {
  family: 'Família',
  genus: 'Gênero',
  species: 'Espécie',
};
