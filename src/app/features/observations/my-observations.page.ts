import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PreviewBannerComponent } from '../../shared/components/preview-banner.component';

/** Tela 6 — Minhas Observações (IMP-036). Lista somente as observações do próprio usuário (RLS). */
@Component({
  selector: 'app-my-observations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    RouterLink,
    EmptyStateComponent,
    PreviewBannerComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Minhas observações</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-preview-banner />
      <!-- TODO(IMP-036): carregar observações (lifecycle=saved) do usuário com loading, erro+retry e pull-to-refresh. -->
      <app-empty-state
        emoji="📷"
        title="Nenhuma observação ainda"
        message="Quando você salvar um registro, ele aparece aqui."
      >
        <ion-button routerLink="/tabs/registrar">Registrar abelha</ion-button>
      </app-empty-state>
    </ion-content>
  `,
})
export class MyObservationsPage {}
