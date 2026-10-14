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
1. Dashboard do projeto `DataBee` (ref `bupyzsifhsqbwgxtendy`) → Project Settings → API Keys → copie a **Publishable key** (`sb_publishable_...`).
2. Cole em `src/environments/supabase.config.ts` → `publishableKey`. **Nunca** a secret key.
3. Reinicie `npm start`. O aviso amarelo some e o login passa a funcionar.
4. Authentication → URL Configuration: adicionar `http://localhost:4200` às Redirect URLs (confirmação de e-mail em dev).
5. CLI (para migrations/functions): `npm run supabase -- login` e `npm run supabase -- link --project-ref bupyzsifhsqbwgxtendy`.

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
