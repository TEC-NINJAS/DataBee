# 🐝 DataBee

Plataforma colaborativa de **ciência cidadã** para registro e catalogação de abelhas em Curitiba e Região Metropolitana: o usuário fotografa uma abelha, registra a localização (privada) e recebe uma **sugestão** de identificação por IA — família, gênero ou espécie, ou "inconclusivo" — que depois pode ser discutida e validada por pessoas.

Projeto da equipe **TEC_NINJAS** para a FIRST LEGO League — temporada BIOGLOW. Planejamento, decisões e tasks: [Notion — DataBee](https://app.notion.com/p/2d5d3425eae482d5aa0f0102b42db87e) (guia de execução: [Implementação do MVP](https://app.notion.com/p/0dfd3425eae482429f1b810626c44b39)).

## Stack
Ionic 9 + Angular 22 · Capacitor 8 (Android) · Supabase (Auth, Postgres + RLS, Storage, Edge Functions) · VLM remoto via Edge Function (OpenAI, Structured Outputs).

## Começar
```bash
npm ci
npm start            # http://localhost:4200
```
Sem chave do Supabase o app abre em modo pré-visualização. Configuração completa (Supabase, JDK, Android Studio, celular): [docs/SETUP.md](docs/SETUP.md).

| Comando | O que faz |
|---|---|
| `npm start` | servidor de desenvolvimento |
| `npm run check` | lint + build de produção (rodar antes de todo commit) |
| `npm run android:sync` | build + copia para o projeto Android |
| `npm run android:open` | abre no Android Studio |
| `npm run supabase -- <cmd>` | Supabase CLI (migrations, functions) |

## Documentação
- [docs/HANDOFF.md](docs/HANDOFF.md) — **estado atual e próximos passos** (leia primeiro)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — mapa do código e das 8 telas
- [docs/SETUP.md](docs/SETUP.md) — instalação do ambiente
- [AGENTS.md](AGENTS.md) — regras obrigatórias para agentes de IA (Claude/Codex): contexto, links do Notion, autonomia, commits
- [docs/guides/](docs/guides) — boas práticas por tecnologia e fluxo de trabalho

> Alunos: abram o Claude Code ou o Codex nesta pasta e peçam em português — "qual o próximo passo?", "roda o app", "gera o APK", "faz a próxima task". O agente executa e explica.

## Estrutura
```
src/app/core/        serviços globais (config, supabase, auth, câmera, GPS, erros, modelos)
src/app/features/    telas por funcionalidade
src/app/shared/      componentes visuais reutilizáveis
supabase/            config da CLI, migrations, functions, catálogo
android/             projeto nativo gerado pelo Capacitor
docs/                setup, arquitetura, guias e handoff
```

## Princípios
A IA sugere, não valida. GPS exato nunca é público. Nenhuma chave secreta no app. O registro funciona sem IA. Simplicidade antes de sofisticação.
