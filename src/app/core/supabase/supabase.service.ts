import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { APP_CONFIG } from '../config/app-config';
import { AppError } from '../errors/app-error';

/**
 * Único ponto de criação do cliente Supabase (singleton).
 * - Usa apenas URL + publishable key (públicas). Autorização real = JWT do usuário + RLS.
 * - Quando o projeto ganhar tabelas, gere tipos com `npm run supabase -- gen types typescript --linked > src/app/core/supabase/database.types.ts`
 *   e troque para `createClient<Database>(...)`.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly _client: SupabaseClient | null = APP_CONFIG.isSupabaseConfigured
    ? createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;

  get isConfigured(): boolean {
    return this._client !== null;
  }

  /** Retorna o cliente ou lança `config_missing` (nunca retorna null). */
  get client(): SupabaseClient {
    if (!this._client) {
      throw new AppError(
        'config_missing',
        'Supabase ainda não configurado. Preencha src/environments/supabase.config.ts (veja docs/SETUP.md).',
      );
    }
    return this._client;
  }
}
