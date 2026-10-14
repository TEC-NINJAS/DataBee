import { environment } from '../../../environments/environment';

/** Por que o Supabase não pode ser usado (ou `null` quando está tudo certo). */
export type ConfigProblem = 'missing_url' | 'missing_key' | 'secret_key_in_frontend' | null;

function detectProblem(url: string, key: string): ConfigProblem {
  if (!url) return 'missing_url';
  if (!key) return 'missing_key';
  // Defesa extra: uma chave privilegiada no bundle daria acesso total ao banco.
  if (key.startsWith('sb_secret_') || key.includes('service_role')) return 'secret_key_in_frontend';
  return null;
}

const problem = detectProblem(environment.supabaseUrl.trim(), environment.supabasePublishableKey.trim());

if (problem === 'secret_key_in_frontend') {
  console.error(
    '[DataBee] Chave SECRETA detectada no frontend. Remova-a de supabase.config.ts e rotacione-a no Dashboard.',
  );
}

/** Configuração única e imutável do app. Leia daqui; nunca de `environment` diretamente. */
export const APP_CONFIG = Object.freeze({
  production: environment.production,
  supabaseUrl: environment.supabaseUrl.trim(),
  supabasePublishableKey: problem ? '' : environment.supabasePublishableKey.trim(),
  configProblem: problem,
  isSupabaseConfigured: problem === null,
  /** Limite do Core para a foto enviada (Data Model: bytes > 0 e ≤ 5 MB). */
  maxPhotoBytes: 5 * 1024 * 1024,
  /** Maior lado da foto após reencode no cliente. */
  maxPhotoDimension: 2048,
});
