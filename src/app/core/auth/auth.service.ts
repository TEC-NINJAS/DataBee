import { computed, inject, Injectable, signal } from '@angular/core';
import { isAuthError, Session, User } from '@supabase/supabase-js';

import { AppError } from '../errors/app-error';
import { SupabaseService } from '../supabase/supabase.service';

export interface SignUpResult {
  /** true quando o projeto exige confirmação por e-mail (D16) e ainda não há sessão. */
  needsEmailConfirmation: boolean;
}

/**
 * Estado de autenticação do app (signals) + operações de login/cadastro/logout.
 * Regras (IMP-016/033/034):
 * - Sessão restaurada no boot por `init()` (chamado em app.config.ts).
 * - Logout limpa a sessão local; um JWT já emitido pode valer até expirar (limitação documentada).
 * - Sem Supabase configurado o app entra em modo pré-visualização (`previewMode`).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);

  private readonly _session = signal<Session | null>(null);
  private readonly _initialized = signal(false);

  readonly session = this._session.asReadonly();
  readonly initialized = this._initialized.asReadonly();
  readonly user = computed<User | null>(() => this._session()?.user ?? null);
  readonly isAuthenticated = computed(() => this._session() !== null);
  readonly previewMode = computed(() => !this.supabase.isConfigured);
  /** Nome exibível vindo do cadastro; profiles (IMP-032) passa a ser a fonte quando existir. */
  readonly displayName = computed(() => {
    const meta = this.user()?.user_metadata as { display_name?: string } | undefined;
    return meta?.display_name?.trim() || null;
  });

  async init(): Promise<void> {
    if (!this.supabase.isConfigured) {
      this._initialized.set(true);
      return;
    }
    const auth = this.supabase.client.auth;
    try {
      const { data } = await auth.getSession();
      this._session.set(data.session);
    } catch (error) {
      console.warn('[auth] Falha ao restaurar sessão', error);
      this._session.set(null);
    } finally {
      this._initialized.set(true);
    }
    auth.onAuthStateChange((_event, session) => this._session.set(session));
  }

  async signIn(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw mapAuthError(error);
    this._session.set(data.session);
  }

  async signUp(email: string, password: string, displayName: string): Promise<SignUpResult> {
    const { data, error } = await this.supabase.client.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() } },
    });
    if (error) throw mapAuthError(error);
    this._session.set(data.session);
    return { needsEmailConfirmation: data.session === null };
  }

  async signOut(): Promise<void> {
    if (this.supabase.isConfigured) {
      // scope 'local': encerra esta instalação; não depende de rede para limpar o estado.
      const { error } = await this.supabase.client.auth.signOut({ scope: 'local' });
      if (error) console.warn('[auth] signOut retornou erro; sessão local removida mesmo assim', error);
    }
    this._session.set(null);
  }
}

function mapAuthError(error: unknown): AppError {
  if (!isAuthError(error)) {
    return new AppError('network', 'Sem conexão com o servidor. Tente novamente.', error);
  }
  switch (error.code) {
    case 'invalid_credentials':
      return new AppError('auth_invalid_credentials', 'E-mail ou senha incorretos.', error);
    case 'email_not_confirmed':
      return new AppError('auth_email_not_confirmed', 'Confirme seu e-mail antes de entrar.', error);
    case 'weak_password':
      return new AppError('auth_weak_password', 'Senha fraca. Use pelo menos 8 caracteres.', error);
    case 'user_already_exists':
    case 'email_exists':
      return new AppError('auth_user_exists', 'Já existe uma conta com este e-mail.', error);
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return new AppError('auth_rate_limited', 'Muitas tentativas. Aguarde alguns minutos.', error);
    default:
      return new AppError('unknown', 'Não foi possível concluir a autenticação. Tente novamente.', error);
  }
}
