# Guia — Capacitor 8 + Android

Plugins instalados (versões exatas no lockfile): `@capacitor/core|cli|android 8.5.x`, `@capacitor/camera 8.2.x`, `@capacitor/geolocation 8.2.x`, `app`, `haptics`, `keyboard`, `status-bar`. appId: `com.tecninjas.databee`. minSdk 24, target/compileSdk 36. Requer **JDK 21** e Android SDK 36.

## 1. Fluxo de build (sempre nesta ordem)
```bash
npm run build          # gera www/
npx cap sync android   # copia www/ + plugins para android/  (ou: npm run android:sync)
npx cap open android   # Android Studio → Run ▶ no aparelho (USB debugging ligado)
```
- Alterou código web? Precisa `build` + `sync` de novo; o APK não se atualiza sozinho.
- Instalou/removeu plugin? `npx cap sync android` obrigatório.
- Live reload no aparelho (opcional, mesma rede Wi-Fi): `npm run start:lan` e `npx cap run android -l --external`. **APK de entrega nunca usa live reload** (IMP-058).
- A pasta `android/` é versionada (contém manifest/config). Não edite arquivos gerados em `android/app/src/main/assets/`.

## 2. Câmera (`core/device/photo.service.ts`)
- API desta versão: `Camera.takePhoto()` e `Camera.chooseFromGallery()`. **`getPhoto`/`pickImages` estão deprecated** — não use tutoriais que os usam.
- `saveToGallery: false` → não pedimos permissão de armazenamento nem `CAMERA` extra no manifest.
- Toda foto passa por `reencodeJpeg` (canvas): corrige orientação, limita a 2048 px, gera JPEG sem EXIF/GPS, garante ≤ 5 MB.
- Cancelamento (`OS-PLUG-CAMR-0006` ou "cancelled") não é erro para o usuário: manter a tela utilizável.
- No navegador o plugin usa `<input type="file">` (fallback web) — é assim que testamos sem aparelho.

## 3. Localização (`core/device/location.service.ts`)
- Só depois do consentimento explícito na tela 4 (D10). Leitura única (`getCurrentPosition`, `enableHighAccuracy`, `timeout 20s`, `maximumAge 0`). **Proibido** `watchPosition`/background.
- Manifest já declara `ACCESS_COARSE_LOCATION` + `ACCESS_FINE_LOCATION` e `uses-feature gps required=false`. Não adicione `ACCESS_BACKGROUND_LOCATION`.
- Erros mapeados (OS-PLUG-GLOC-0003 negado, 0007/0009/0017 GPS desligado, 0010 timeout). Negar nunca bloqueia salvar; nunca inventar coordenada.
- Salvar `accuracy` (metros) junto; mostrar ao usuário.

## 4. Testes no aparelho (manual — registrar no Notion "Technical Test Runs and Bugs")
Para qualquer mudança em câmera/GPS/permissões/navegação: permitir, negar, negar e tentar de novo, GPS desligado, cancelar câmera, foto da galeria, botão voltar do Android, girar a tela, app em segundo plano e retorno. Registre modelo/Android/build (commit).

## 5. Problemas comuns
| Sintoma | Causa provável |
|---|---|
| `JAVA_HOME is not set` / Gradle exige Java 21 | Instalar JDK 21 e definir `JAVA_HOME` (ver `docs/SETUP.md`). |
| `SDK location not found` | Abrir o projeto uma vez no Android Studio ou criar `android/local.properties` com `sdk.dir` (arquivo não versionado). |
| Tela branca no APK | Esqueceu `npm run build` antes do `sync`, ou erro JS — use `chrome://inspect` no PC com o aparelho conectado. |
| Login não persiste | Use sempre o `SupabaseService`; não crie outro client. |
| `PKIX path building failed` (Gradle/Java) | Antivírus (Avast) inspeciona HTTPS. Em `~/.gradle/gradle.properties` (do PC, não do repo): `systemProp.javax.net.ssl.trustStoreType=Windows-ROOT`. |
| Download do Gradle `Read timed out` | Rede lenta/antivírus. Aumente timeouts em `~/.gradle/gradle.properties` (`systemProp.org.gradle.internal.http.socketTimeout=120000`) ou baixe o zip oficial e confira o SHA-256. |
| `Your project path contains non-ASCII characters` | Pasta com acento (`Usuário`). Já há `android.overridePathCheck=true` em `android/gradle.properties`; se ainda falhar, clone o repo num caminho sem acento (ex.: `E:\dev\DataBee`). |
| Requisições falham só no aparelho | Sem internet no aparelho ou URL `localhost` (aparelho não enxerga o PC). |
