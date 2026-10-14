import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PreviewBannerComponent } from '../../shared/components/preview-banner.component';

/**
 * Tela 8 — Feed/Comunidade (IMP-041/044, D09/D10).
 * Somente autenticados; só observações published; região ampla; nunca GPS/endereço/e-mail.
 */
@Component({
  selector: 'app-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, EmptyStateComponent, PreviewBannerComponent],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Comunidade</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-preview-banner />
      <!-- TODO(IMP-041): listar observações publicadas (cards com região ampla, foto via Function, status da identificação). -->
      <app-empty-state
        emoji="👥"
        title="Feed vazio"
        message="Observações publicadas pela comunidade aparecerão aqui."
      />
    </ion-content>
  `,
})
export class FeedPage {}
