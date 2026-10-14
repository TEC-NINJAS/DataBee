import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../shared/components/empty-state.component';

/**
 * Tela 5 — Resultado + Aprender (IMP-030, D22/D24).
 * Regras: até 3 candidatos por rank (sem %), nível taxonômico, status "Sugerido", limitações da IA,
 * inconclusivo/no_match ≠ erro técnico, cartão educativo vindo do catálogo curado (nunca gerado pela IA).
 * Reabrir esta tela lê ai_identifications (cache) e NUNCA chama o provedor.
 */
@Component({
  selector: 'app-analysis-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, EmptyStateComponent],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="'/observacao/' + id()" text="" />
        </ion-buttons>
        <ion-title>Resultado</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- TODO(IMP-030): renderizar BeeAnalysisV2 salvo + cartão "Sobre esta abelha"/"Sobre as abelhas" (D24). -->
      <app-empty-state
        emoji="🤖"
        title="Não analisada"
        message="A identificação assistida chega na semana 3 (IMP-023 a IMP-031). Sugestão de IA não é validação científica."
      />
    </ion-content>
  `,
})
export class AnalysisResultPage {
  readonly id = input.required<string>();
}
