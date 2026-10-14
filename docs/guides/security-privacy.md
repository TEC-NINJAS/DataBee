# Guia — Segurança e privacidade (obrigatório para dados, fotos, GPS e chaves)

Base: D09, D10, D13, D21, D22 e Notion → "Security Checklist e matriz A/B/anon".

## 1. Classificação dos dados
| Dado | Quem lê | Onde |
|---|---|---|
| Coordenadas exatas + accuracy + origem da localização | Só o dono | `observation_private_locations` (RLS owner) |
| Foto original | Só o dono | Storage privado `<user_id>/...` |
| Cópia compartilhada da foto | Autenticados, via URL assinada 60 s | `shared/...` gerado pelo backend |
| Observação publicada: região ampla, data, sugestão IA, status curadoria, display_name | Autenticados (D09) | `observations` (published) + `profiles` |
| E-mail | Só o próprio usuário (Auth) | `auth.users` — nunca em `profiles`/feed |
| Resultado da IA | Dono; outros se published | `ai_identifications` (escrita só backend) |

Anônimo (sem login) não lê nada além da tela de login.

## 2. Regras práticas
- Nunca logar (console/`console.log`) token, sessão, coordenadas, e-mail ou blob de foto. Logs de erro: código + mensagem curta.
- Nunca colocar dados pessoais/GPS em URL, query string, nome de arquivo ou path de Storage.
- Região pública: só os dois rótulos de D10. Nunca município específico da RMC, endereço ou ponto.
- Foto: reencode no cliente (`PhotoService`) **e** verificação no servidor (MIME/bytes/limites) antes de publicar. Avise o usuário que o conteúdo visual da foto pode revelar o local.
- Despublicar impede novas URLs; não revoga cópias já baixadas (limitação documentada).
- `innerHTML`/`bypassSecurityTrust*` proibidos com conteúdo de usuário (comentários são texto puro; Angular já escapa interpolação).
- Participantes de testes codificados (P01, P02…), sem nome/contato/escola (D17).

## 3. Segredos
- Frontend: só URL + publishable key. `APP_CONFIG` bloqueia `sb_secret_`/`service_role`.
- `.gitignore` cobre `supabase.config.ts`, `.env*`. **`.gitignore` não apaga segredo já commitado**: se vazar, o responsável rotaciona a chave no Dashboard/OpenAI imediatamente e depois limpa o histórico com o orientador.
- Antes de cada commit: `git diff --staged` procurando `sb_secret_`, `service_role`, `sk-`, `eyJ` (JWT), senhas.

## 4. Matriz A/B/anon (testar com o cliente, não com SQL admin)
Para toda tabela/bucket/function nova: A lê/escreve o próprio ✔ · B lê/escreve o de A ✖ (exceto published permitido) · anon ✖ · A forja `user_id` de B ✖ · A altera campo protegido (status IA, curadoria, public fields) ✖. Registrar em "Technical Test Runs and Bugs".
