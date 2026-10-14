import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonText } from '@ionic/angular';

/** Estado vazio padrão: emoji + título + texto + ação opcional via <ng-content>. */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonText],
  template: `
    <div class="empty">
      <div class="emoji" aria-hidden="true">{{ emoji() }}</div>
      <h2>{{ title() }}</h2>
      <ion-text color="medium">
        <p>{{ message() }}</p>
      </ion-text>
      <ng-content />
    </div>
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 48px 24px;
    }
    .emoji {
      font-size: 3rem;
    }
    h2 {
      margin: 12px 0 4px;
      font-size: 1.15rem;
    }
  `,
})
export class EmptyStateComponent {
  readonly emoji = input('🐝');
  readonly title = input.required<string>();
  readonly message = input('');
}
