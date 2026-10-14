import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../shared/components/empty-state.component';

/**
 * Tela 7 — Detalhe da Observação (IMP-037/041/042/044).
 * Dono: foto/dados, resultado persistido (sem chamar o VLM de novo), curadoria, Aprender, publicar/despublicar.
 * Outro usuário: somente published, sem GPS; foto via get-observation-image (URL 60 s).
 */
@Component({
  selector: 'app-observation-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, EmptyStateComponent],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/minhas" text="" />
        </ion-buttons>
        <ion-title>Observação</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- TODO(IMP-037): buscar observação {{ id() }} respeitando RLS; 404/403 → "indisponível". -->
      <app-empty-state emoji="🔎" title="Observação indisponível" message="O detalhe será implementado na IMP-037." />
    </ion-content>
  `,
})
export class ObservationDetailPage {
  /** Vem da rota `observacao/:id` (withComponentInputBinding). */
  readonly id = input.required<string>();
}
