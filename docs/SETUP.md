# Setup do ambiente (Windows) — DataBee

Verificado em 14/10/2026 no PC de desenvolvimento da equipe (Windows 10).

## 1. Ferramentas e versões
| Ferramenta | Versão | Para quê | Instalação |
|---|---|---|---|
| Node.js | 24.19 (aceito: ^22.22.3 ou ^24.15) | Angular/Capacitor/CLI | https://nodejs.org (LTS) |
| npm | 11.17 | dependências | vem com o Node |
| Git | 2.56 | versionamento | https://git-scm.com |
| VS Code | 1.141 | editor | https://code.visualstudio.com |
| JDK | Microsoft OpenJDK 21 | build Android (Capacitor 8 exige 21) | `winget install --id Microsoft.OpenJDK.21 -e --source winget` |
| Android Studio + SDK | SDK Platform 36, Build-Tools, Platform-Tools | build/instalar APK | `winget install --id Google.AndroidStudio -e --source winget` |
| Supabase CLI | 2.121 (devDependency) | migrations/functions | já vem no `npm install` (`npm run supabase -- --version`) |
Docker **não** é necessário (usamos o projeto Supabase hospedado).

Pacotes do app (exatos no `package-lock.json`): Angular 22.2, Ionic 9.0, Capacitor 8.5 (camera 8.2, geolocation 8.2), supabase-js 2.117, TypeScript 6.0.

## 2. Primeira vez no projeto
```bash
git clone <url do repositório>
cd DataBee
npm ci                 # instala exatamente o lockfile
npm start              # abre http://localhost:4200
```
O `npm start` cria `src/environments/supabase.config.ts` (ignorado pelo Git) a partir do exemplo. Sem a publishable key o app roda em **modo pré-visualização**.

Avisos `npm warn allow-scripts` sobre `lmdb`, `msgpackr-extract` e `@parcel/watcher` são esperados: o npm 11 não executa scripts de instalação não aprovados; esses pacotes usam binários pré-compilados e o build funciona. `esbuild` e `supabase` já estão aprovados em `package.json → allowScripts`.

## 3. Conectar ao Supabase (adulto responsável / IMP-010/011)
Projeto adotado para o recomeço em 15/10/2026: `DataBee`, ref `uqfuuahziwgxwjymtwil`, organização `TEC-NINJAS's Org`, região Canadá Central (`ca-central-1`), plano Free conforme as imagens do painel enviadas pela equipe. O acesso ao projeto anteriormente registrado em São Paulo não foi localizado. A troca foi autorizada nesta conversa; atualizar D13 no Notion ainda está pendente.

1. [Dashboard do DataBee](https://supabase.com/dashboard/project/uqfuuahziwgxwjymtwil) → Project Settings → API Keys → copie a **Publishable key** (`sb_publishable_...`).
2. Cole em `src/environments/supabase.config.ts` → `publishableKey`. **Nunca** a secret key.
3. Reinicie `npm start`. O aviso amarelo some e o login passa a funcionar.
4. Authentication → URL Configuration: adicionar `http://localhost:4200` às Redirect URLs (confirmação de e-mail em dev).
5. CLI (ferramenta de terminal para migrations/functions): o responsável executa `npm.cmd run supabase -- login --agent no --output-format text` no PowerShell. Pressione Enter para abrir o navegador, entre na conta que acessa o projeto e preencha o código de verificação somente no terminal. O agente confere `npm.cmd run supabase -- projects list` e então executa `npm.cmd run supabase -- link --project-ref uqfuuahziwgxwjymtwil`.
6. Em Authentication → Users, crie duas contas de teste distintas (A/B), com e-mails controlados e confirmação administrativa para o teste inicial. Guarde as credenciais em meio privado. Registre no Notion somente existência, responsável, data e revisão.

No PowerShell, `npm.cmd` evita o bloqueio de execução de `npm.ps1`. As opções `--agent no --output-format text` permitem as perguntas do login quando o terminal foi aberto pelo agente. Se aparecer `Verification code is required`, confira se o terminal ainda aguarda o código; se voltou ao início da linha (`PS ...>`), execute o login novamente e siga o novo fluxo no navegador. Acesso ao painel no navegador e login da CLI são autorizações separadas.

Se o login retornar `Transport error`, o comando `npm.cmd run supabase -- ...` já inclui a adaptação dos certificados confiáveis do Windows para este PC com Avast (`scripts/supabase.mjs`). Ela usa somente certificados públicos do próprio sistema e um arquivo temporário, removido ao encerrar a ferramenta. Continue usando o comando do projeto para receber essa adaptação; detalhes e diagnóstico em `docs/guides/supabase.md` §2. Depois de uma tentativa com erro, inicie um novo login e use o novo código temporário somente no terminal.

## 4. Android
1. Abra o Android Studio uma vez e conclua o assistente (Standard) — ele baixa o SDK em `%LOCALAPPDATA%\Android\Sdk`. Em SDK Manager confirme **Android 16 (API 36)**, Build-Tools e Platform-Tools.
2. Variáveis de ambiente (Configurações do Windows → Variáveis de ambiente do usuário):
   - `JAVA_HOME` = pasta do JDK 21 (ex.: `C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot`)
   - `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`
   - Adicionar ao `Path`: `%ANDROID_HOME%\platform-tools`
3. Celular: Configurações → Sobre → tocar 7× em "Número da versão" → Opções do desenvolvedor → Depuração USB. Conectar via USB e aceitar a chave RSA.
4. Rodar:
```bash
npm run android:sync     # build web + cap sync
npm run android:open     # Android Studio → selecione o aparelho → Run ▶
```
APK debug: Android Studio → Build → Build App Bundle(s)/APK(s) → Build APK(s) (`android/app/build/outputs/apk/debug/`).

## 5. Verificação rápida
```bash
node --version && npm --version && git --version && java -version
npm run check            # lint + build
npm run supabase -- --version
```
Registrar a matriz de versões no Notion (IMP-006 / "Documentação oficial e checklist de compatibilidade").
