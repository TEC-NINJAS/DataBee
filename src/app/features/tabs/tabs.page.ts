import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircle, home, images, people } from 'ionicons/icons';

/** Navegação principal: Início · Registrar · Minhas · Feed (IMP-009). */
@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="inicio">
          <ion-icon name="home" aria-hidden="true" />
          <ion-label>Início</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="registrar">
          <ion-icon name="add-circle" aria-hidden="true" />
          <ion-label>Registrar</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="minhas">
          <ion-icon name="images" aria-hidden="true" />
          <ion-label>Minhas</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="feed">
          <ion-icon name="people" aria-hidden="true" />
          <ion-label>Feed</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor() {
    addIcons({ home, addCircle, images, people });
  }
}
