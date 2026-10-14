import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/** Rotas protegidas. Em modo pré-visualização (sem Supabase) libera a navegação das telas. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated() || auth.previewMode()) return true;
  return inject(Router).createUrlTree(['/login']);
};

/** Tela de login: quem já está logado vai direto para o Início. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? inject(Router).createUrlTree(['/tabs/inicio']) : true;
};
