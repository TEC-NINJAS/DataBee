# HANDOFF — estado atual do DataBee

> **Obrigatório:** todo agente ou pessoa que alterar o projeto atualiza este arquivo ao final (protocolo em `docs/guides/workflow.md` §4). Mantenha curto e atual; apague o que ficou velho.

**Atualizado em:** 2026-10-14 · **Por:** Claude (Claude Code) · **Semana:** 2 (14–16/10) · **Próximo gate:** Gate 1 (IMP-047) atrasado → Gate 2 (IMP-038)

## Estado atual (o que funciona agora)
- App Ionic 9.0.8 + Angular 22.2.2 (standalone, signals, zoneless) + Capacitor 8 na raiz do repo. `npm run check` (lint + build) passa sem warnings; `npm audit --omit=dev` = 0 vulnerabilidades; cópia limpa dos arquivos versionados faz `npm ci` + build — verificado em 2026-10-14.
- `npm start` → http://localhost:4200. Sem chave Supabase roda em **modo pré-visualização** (aviso amarelo, login/salvar desabilitados). Verificado no navegador: navegação nas abas, Início, login, Registrar → galeria → preview (reencode 3000×2000 PNG → 2048×1365 JPEG 27 KB) → Dados → recusar localização. Sem erros no console.
- Código pronto (aguardando chave/validação humana):
  - Auth: login, cadastro com `display_name`, logout local, restauração de sessão, guards, volta ao login ao perder sessão (IMP-016/033/034 — **não testado contra o Supabase real**, falta publishable key).
  - Foto: câmera/galeria com API v8 (`takePhoto`/`chooseFromGallery`), reencode JPEG sem EXIF ≤ 2048 px/5 MB, cancelar não quebra (IMP-018/019 — falta teste no Android real).
  - GPS: consentimento explícito, leitura única com accuracy, erros mapeados, recusar não bloqueia (IMP-020 — GPS real não testado; no navegador do agente não foi concedida permissão).
- Telas 5–8 (Resultado, Minhas, Detalhe, Feed) são placeholders com estados vazios e `TODO(IMP-xxx)`.
- Android: plataforma `android/` criada (appId `com.tecninjas.databee`, permissões de localização). `./gradlew assembleDebug` → **BUILD SUCCESSFUL** (`android/app/build/outputs/apk/debug/app-debug.apk`, ~9 MB). **Ainda não instalado em aparelho.**
- Supabase: `supabase/config.toml` (init), pastas `migrations/` e `functions/` vazias. **Nenhuma migration/tabela/function criada.** Catálogo transcrito do Notion em `supabase/catalog/catalog-v1.draft.json` (rascunho para IMP-070).
- Documentação para agentes: `AGENTS.md` (contexto, links do Notion, protocolo de início, autonomia, Conventional Commits, comunicação com alunos), `CLAUDE.md`, `docs/guides/*` (inclui `student-communication.md`), `docs/SETUP.md`, `docs/ARCHITECTURE.md`.
- Repositório oficial: https://github.com/TEC-NINJAS/DataBee (D13 atualizada no Notion).

## Ambiente desta máquina (PC da equipe)
Node 24.19, npm 11.17, Git 2.56, VS Code 1.141, Microsoft OpenJDK 21.0.12 (`C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot`), Android Studio (winget) + Android SDK em `%LOCALAPPDATA%\Android\Sdk` (platform-tools, platforms;android-36, build-tools;36.0.0); `JAVA_HOME`/`ANDROID_HOME` definidos no usuário. **Avast intercepta HTTPS**: Gradle usa `systemProp.javax.net.ssl.trustStoreType=Windows-ROOT` em `~/.gradle/gradle.properties`. Caminho com acento (`Usuário`) → `android.overridePathCheck=true` em `android/gradle.properties`. Supabase CLI 2.121 via npm. Docker não instalado (não necessário).

## Tasks no Notion (snapshot 2026-10-14 — confirme no Notion, que é a fonte oficial)
- **Done:** IMP-001, IMP-006, IMP-007, IMP-008, IMP-009, IMP-018 (com "🎓 Explicação para a equipe" na página).
- **Review:** IMP-002. **Ready:** IMP-010 (humano: chave + contas A/B).
- **In progress:** IMP-012 (falta `supabase login/link`), IMP-016 (login — testar com chave), IMP-017 (APK pronto — instalar no celular), IMP-019 (câmera — testar no celular), IMP-020 (GPS — testar no celular), IMP-070 (catálogo — rascunho JSON).
- **Blocked:** IMP-011 (falta publishable key).
- **Not started (próximas Core):** IMP-003/004 (decisões já registradas D06–D12 — equipe pode fechar), IMP-005, IMP-032, IMP-033, IMP-034, IMP-047 (Gate 1), IMP-013…015, IMP-069, IMP-021, IMP-022, IMP-035…038 (Gate 2).
- Tarefa técnica para conquistas (D23) e conteúdo educativo (D24) ainda não existe no Notion — criar quando a equipe aprovar.

## Próximos passos (ordem sugerida)
1. **Humano (adulto):** colar publishable key em `src/environments/supabase.config.ts`; Redirect URL `http://localhost:4200`; criar contas de teste A/B (IMP-010). Depois testar login/cadastro/logout (IMP-016/033/034) e registrar no Notion.
2. **Humano:** abrir o Android Studio uma vez (assistente), ligar depuração USB no Galaxy S25 FE, `npm run android:sync` + `npm run android:open` → Run (IMP-017). Testar câmera/GPS no aparelho (IMP-019/020/021).
3. **Agente + aluno:** IMP-012 (`supabase login`/`link` — humano) → IMP-032 profiles+trigger → IMP-070 catálogo (revisar rascunho, resolver C05) → Gate 1 IMP-047.
4. **Agente + aluno (Semana 2):** IMP-013 observations + localização privada (incluir campos D21/D22) → IMP-014 → IMP-015 bucket → IMP-069 → IMP-022 upload/draft → IMP-035 salvar → IMP-036/037 → Gate 2 IMP-038.

## Pendências e bloqueios
- **Publishable key** do Supabase não fornecida → login/dados não testados (responsável: Prof. Rafaella/equipe).
- **D15** modelo/conta/orçamento OpenAI em aberto → `OPENAI_API_KEY`/`OPENAI_MODEL` não configurados (bloqueia IMP-025/028, não bloqueia Gates 1–2).
- **D16** SMTP: o SMTP padrão só envia confirmação para e-mails da equipe do projeto Supabase.
- **D14** matriz de versões já preenchida em "Documentação oficial e checklist"; falta a equipe registrar a decisão na linha D14.
- **Conflito C05:** catálogo humano traz tribo (Meliponini/Euglossini/Bombini) na coluna família/gênero — confirmar com Prof. Rodrigo antes de importar níveis family/genus.
- **D24:** textos educativos curados (com fonte) ainda não existem para as 12 espécies.
- **Foto da galeria + GPS:** hoje a tela avisa que o GPS atual pode não ser o local da foto; decidir na IMP-020/D21 se para galeria a localização deve ser `user_informed`/omitida.
- Avisos `npm warn allow-scripts` (lmdb, msgpackr-extract, @parcel/watcher) são esperados e inofensivos.

## Última sessão
2026-10-14 (4ª parte) — Claude: criada no Notion a página "📘 Explicação do setup inicial" (https://app.notion.com/p/3f9d3425eae4812b81ffc11a375d32b5), linkada no Guia de execução e nas IMP-006/007/008/009/018; AGENTS.md e student-communication.md passam a pedir uma página consolidada por marco.
2026-10-14 (3ª parte) — Claude: fluxo Git otimizado — agente faz PR **e merge** em `main` após check verde e autorrevisão (AGENTS.md §8, workflow §2–3, Notion Git Workflow). PR #1 (foundation) mesclado.
2026-10-14 (2ª parte) — Claude: explicações didáticas no Notion e Done em IMP-006/007/008/009/018 (autorizado pela equipe); IMP-010 → Ready; D13/IMP-005 com o repo oficial; AGENTS.md reescrito com autonomia e comunicação; Git Workflow do Notion migrado para Conventional Commits; foundation commitada.
2026-10-14 (1ª parte) — Claude: setup do ambiente (JDK 21, Android Studio), scaffold do app, serviços core, 8 rotas, guias para agentes, handoff; Notion atualizado: Review = IMP-006/007/008/009/018; In progress = IMP-012/016/017/019/020/070; Blocked = IMP-011 (chave); notas em IMP-010/033/034; matriz de versões preenchida em "Documentação oficial e checklist". Verificação: `npm run check`, navegador (modo pré-visualização), APK debug compilado. Não verificado: Supabase real, Android real, GPS real.
