import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { constructOutline } from 'ionicons/icons';

import { AuthService } from '../../core/auth/auth.service';

/** Aviso fixo quando o Supabase não está configurado (modo pré-visualização). */
@Component({
  selector: 'app-preview-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, IonText],
  template: `
    @if (auth.previewMode()) {
      <div class="banner" role="status">
        <ion-icon name="construct-outline" aria-hidden="true" />
        <ion-text>
          <strong>Modo pré-visualização.</strong>
          Supabase não configurado: login e salvamento ficam indisponíveis. Veja docs/SETUP.md.
        </ion-text>
      </div>
    }
  `,
  styles: `
    .banner {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      padding: 10px 14px;
      font-size: 0.85rem;
      background: var(--ion-color-warning-tint);
      color: var(--ion-color-warning-contrast);
    }
    ion-icon {
      flex: none;
      margin-top: 2px;
    }
  `,
})
export class PreviewBannerComponent {
  protected readonly auth = inject(AuthService);

  constructor() {
    addIcons({ constructOutline });
  }
}
