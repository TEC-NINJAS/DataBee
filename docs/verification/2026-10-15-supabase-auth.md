# Verificação inicial de autenticação — sessão de 15–16/10/2026

Projeto dev adotado pela equipe: DataBee, referência `uqfuuahziwgxwjymtwil`, organização `TEC-NINJAS's Org`, Canadá Central (`ca-central-1`). A mudança do projeto anteriormente registrado foi autorizada nesta conversa; registro de D13 no Notion ainda pendente.

## Responsáveis e origem da evidência

- Equipe TEC_NINJAS: execução manual do roteiro no navegador e confirmação nesta conversa. Nome do executor/revisor não informado.
- Codex: conferência técnica da configuração pública, navegador isolado e documentação.
- Contas identificadas apenas como A/B, conforme o roteiro da equipe. E-mails, senhas, tokens e IDs não foram coletados. A distinção dos IDs não foi conferida automaticamente.

## Ações, esperado e observado

| Ação | Esperado | Observado | Resultado / fonte |
|---|---|---|---|
| Consultar configuração de Auth com chave pública do projeto esperado | Resposta HTTP 200 | HTTP 200 | Pass — agente |
| Abrir `/login` em Chrome isolado, 390×844 | Sem aviso de prévia, botão Entrar liberado | Ambos confirmados, sem exceções de execução ou rolagem horizontal; screenshot inspecionada | Pass — agente |
| Entrar no app com a conta rotulada A | Abrir Início | Equipe respondeu "Deu certo" após o roteiro | Pass — relato humano |
| Na tela Início, usar Sair | Voltar ao login | Equipe confirmou o roteiro de saída e troca de conta | Pass — relato humano |
| Entrar com a conta rotulada B | Abrir Início | Equipe respondeu "Deu certo também" após o roteiro | Pass — relato humano |
| `npm.cmd run check` após preencher a chave pública | Lint e build de produção sem erros/warnings | Ambos passaram | Pass — agente, antes dos testes humanos |
| `npm.cmd run supabase -- projects list` | Listar projetos para conferir a referência | `AccessTokenRequiredError` | Fail — autenticação administrativa da CLI pendente |

## O que acontece por baixo

### Atualização de 16/10 — conexão da ferramenta do terminal

A tentativa administrativa teve `Transport error`. Consulta pública, sem credenciais, à API mostrou falha de certificado (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`) no Node padrão; com as CAs confiáveis do Windows, houve HTTP 401, esperado sem autenticação. Isso identifica um problema local de confiança de certificados compatível com o erro informado; não prova que o login da CLI foi concluído.

`scripts/supabase.mjs` agora prepara as CAs do Windows para o executável da CLI. Sintaxe, versão, ajuda, propagação de erro e remoção do temporário passaram; `npm.cmd run check` passou novamente após essa mudança de código. Uma nova tentativa interativa foi aberta, com sucesso final ainda pendente de confirmação. URLs/códigos temporários do login não fazem parte desta evidência.

### Fluxo do app

E-mail e senha digitados no app → Supabase Auth confere a conta → o app recebe a autorização do usuário e abre Início. As contas ficam no Auth do projeto. A chave pública identifica o app; ela não substitui a senha do usuário. A configuração local fica fora do Git, e nenhuma credencial foi incluída neste registro.

Sair encerra a sessão desta instalação e volta ao login. Sessão é a autorização temporária de quem já entrou, como uma pulseira de acesso. O código usa saída local; um token já emitido pode valer até expirar, conforme a limitação prevista na IMP-034. Este teste confirmou a navegação observada, sem medir a expiração do token.

Entrar no app e entrar na ferramenta de administração são acessos separados. A ferramenta do terminal ainda precisa do login da conta que administra o projeto para que o agente confira a referência e faça o vínculo.

## Limites e pendências

Cadastro pelo app, confirmação por e-mail, Redirect URLs, restauração ao reabrir, perda de sessão, tratamento de credenciais incorretas e Android não foram confirmados neste roteiro. As contas foram preparadas pelo fluxo administrativo orientado à equipe; não houve confirmação de teste do cadastro pelo app.

Trocar A/B no login não comprova isolamento de registros/fotos. A matriz A/B/anônimo depende das tabelas e permissões das tasks correspondentes; nenhuma tabela/policy foi criada pelo agente nesta etapa.

IMP-010 ainda requer identificação do responsável por acessos/custos, evidência no Notion, revisão por pessoa e checkpoint oral. IMP-012 ainda requer login/vínculo reais da CLI e sua revisão. Critérios completos de IMP-016/033/034 não foram fornecidos nesta conversa; este registro não declara essas tasks concluídas.

## Checkpoint para a equipe

<details>
<summary>A chave pública autentica uma pessoa?</summary>
Não. Ela identifica o app. Supabase Auth verifica a conta do usuário e cria sua sessão.
</details>

<details>
<summary>Por que usar duas contas nos testes?</summary>
Para testar entradas separadas e, quando o banco estiver preparado, conferir se uma pessoa consegue acessar somente os dados permitidos. A troca de login, sozinha, não comprova essa proteção.
</details>

<details>
<summary>O login no app já autoriza a ferramenta do terminal?</summary>
Não. O app usa contas de usuários; a ferramenta precisa da autorização da conta administradora do Supabase para listar e vincular projetos.
</details>

As respostas acima são material de apoio; a explicação oral e a revisão humana ainda não foram registradas.
