# Guia — Angular 22 + Ionic 9 (frontend)

Versões travadas no `package-lock.json`. Consulte a doc **da versão instalada** (`npm ls @angular/core @ionic/angular`) — tutoriais antigos usam NgModules/`*ngIf`/zone.js e estão errados para este projeto.

## 1. Estrutura de pastas (respeite)
```
src/app/
  app.config.ts         providers globais (router, Ionic, init da sessão)
  app.routes.ts         TODAS as rotas (lazy loadComponent). Mapa das 8 telas (D25)
  core/                 código sem tela, reutilizado por várias features
    config/             APP_CONFIG (única leitura de environment)
    supabase/           SupabaseService (único createClient)
    auth/               AuthService (signals) + guards
    device/             PhotoService, LocationService (Capacitor)
    errors/             AppError + toUserMessage
    models/             tipos de domínio (espelham migrations e contratos)
  features/<feature>/   páginas + serviços/stores daquela feature
  shared/components/    componentes visuais genéricos (sem regra de negócio)
```
Regra: página → serviço/store → `SupabaseService`/plugin. Página nunca chama `supabase.from(...)` nem plugin Capacitor direto.

Nomes: `kebab-case.page.ts` (rota), `kebab-case.component.ts`, `kebab-case.service.ts`, `kebab-case.store.ts`, `kebab-case.model.ts`. Classes `PascalCase` com sufixo `Page`/`Component`/`Service`/`Store`. Seletores com prefixo `app-`.

## 2. Componente/página padrão
```ts
@Component({
  selector: 'app-exemplo',
  changeDetection: ChangeDetectionStrategy.OnPush,   // sempre
  templateUrl: 'exemplo.page.html',                  // template inline só se < ~40 linhas
  styleUrls: ['exemplo.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],  // importe cada componente Ionic usado
})
export class ExemploPage {
  private readonly service = inject(ExemploService);  // inject(), nunca parâmetros no construtor
  readonly id = input.required<string>();              // parâmetro de rota via withComponentInputBinding
  protected readonly items = signal<Item[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ionViewWillEnter(): void { void this.load(); }       // Ionic mantém páginas em cache: recarregue aqui

  protected async load(): Promise<void> {
    if (this.loading()) return;                        // evita chamadas duplicadas (duplo toque)
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      this.items.set(await this.service.list());
    } catch (error) {
      this.errorMessage.set(toUserMessage(error));
    } finally {
      this.loading.set(false);                         // loading nunca fica preso
    }
  }
}
```
- Estado local = `signal`; derivado = `computed`; efeitos colaterais raros = `effect` (nunca para copiar signal em signal).
- Estado compartilhado entre telas = `*.store.ts` `@Injectable({ providedIn: 'root' })` com signals privados + `asReadonly()` (ver `registration-draft.store.ts`).
- App é **zoneless**: a tela só atualiza quando um signal muda (ou evento do template). Não use variáveis comuns para estado que aparece na tela; não use `setTimeout` para "forçar" atualização.
- Observables (raros): converta com `toSignal()`; nunca `subscribe` sem `takeUntilDestroyed()`.
- Template: `@if`, `@for (x of xs; track x.id)`, `@switch`. `track` sempre por id estável. Sem chamadas de função pesadas no template (use `computed`).
- Proibido: `any`, NgModules, `*ngIf/*ngFor`, `@Input()` decorator (use `input()`), `ElementRef` para manipular DOM, `innerHTML` com conteúdo do usuário.

## 3. Ionic
- Toda página: `ion-header` > `ion-toolbar color="primary"` > `ion-title` e `ion-content`. Páginas fora das tabs têm `ion-back-button` com `defaultHref`.
- Navegação: `routerLink` no template ou `Router.navigateByUrl()`. Depois de login/logout use `{ replaceUrl: true }`.
- Ciclo de vida Ionic (`ionViewWillEnter`, `ionViewDidLeave`) para recarregar/limpar — `ngOnInit` roda só uma vez por instância em cache.
- Feedback: `ion-spinner` durante loading, `ion-text color="danger" role="alert"` para erros, `ToastController` para confirmações curtas, `AlertController` para ações destrutivas (descartar, despublicar).
- Listas: `ion-list`/`ion-item` ou `ion-card`; pull-to-refresh com `ion-refresher` nas listas (Minhas, Feed). Estado vazio = `<app-empty-state>`.
- Formulários: Reactive Forms tipados (`NonNullableFormBuilder`), `ion-input` com `label`, `labelPlacement="floating"`, `fill="outline"`, `errorText`. Valide também no servidor (constraints/RLS).
- Ícones: `addIcons({ nome })` no construtor e `<ion-icon name="nome">`. Botão só com ícone precisa de `aria-label`.
- Estilo: cores via `color="primary|secondary|success|warning|danger|medium"` e variáveis CSS em `src/theme/variables.scss`. Nada de cores hex nas páginas. SCSS por página curto (budget: 4 kB por componente). Teste em 360–412 px de largura.

## 4. Textos e acessibilidade
- UI 100% pt-BR, frases curtas, linguagem para público leigo. Termos científicos em itálico quando nome científico.
- Nunca dizer "identificado"/"certeza" para sugestão da IA: use "Sugestão da IA", "possível", "inconclusivo".
- Imagens com `alt`; contraste do tema; botões com área de toque ≥ 44 px (padrão Ionic).

## 5. Checklist antes de entregar uma tela
- [ ] Loading, erro (com tentar de novo), vazio e sucesso tratados.
- [ ] Duplo toque não duplica ação (guard `if (busy()) return`).
- [ ] Recarregar a rota direto (F5) funciona; voltar (botão/gesto Android) funciona.
- [ ] Nenhum dado de outro usuário/GPS/e-mail aparece onde não deveria.
- [ ] `npm run check` passa.
