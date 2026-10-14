import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { AuthService } from './core/auth/auth.service';
import { RegistrationDraftStore } from './features/register/registration-draft.store';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly draft = inject(RegistrationDraftStore);

  constructor() {
    // Sessão encerrada (logout, expiração, outro dispositivo): limpa dados locais e volta ao login.
    effect(() => {
      if (!this.auth.initialized() || this.auth.previewMode() || this.auth.isAuthenticated()) return;
      this.draft.reset();
      if (!this.router.url.startsWith('/login')) {
        void this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }
}
