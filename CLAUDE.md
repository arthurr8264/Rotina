# Rotina — contexto do projeto

App pessoal de escala de treino, dieta, sono e registro diário.
Uso: PWA na tela inicial do celular, aberto várias vezes ao dia, às vezes offline.

## Arquitetura

Site estático de arquivo único. **Sem build, sem dependências, sem framework.**

| Arquivo | Papel |
|---|---|
| `index.html` | O app inteiro — HTML, CSS e JS num arquivo só |
| `sw.js` | Service worker (cache offline) |
| `manifest.webmanifest` | Metadados de PWA |
| `icon.svg` | Ícone |
| `GUIA.md` | Guia de edição para o dono do projeto |

Publicado no Netlify (`rotina-arthurrr.netlify.app`), deploy automático a cada push na `main`.
Build command vazio, publish directory `.`.

## Regras que não devem ser quebradas

1. **Não introduzir build step, bundler, npm ou framework.** O valor do projeto é editar um arquivo e dar push. Se uma sugestão exige `npm install`, ela está errada para este projeto.
2. **Todo conteúdo vive no objeto `PLANO_PADRAO`**, no início da tag `<script>`. Nunca escreva textos de conteúdo direto no HTML — sempre passe pelo modelo, porque é ali que o dono edita. As telas leem `PLANO`, que é `PLANO_PADRAO` com o plano do usuário (se houver) por cima.
3. **Ao alterar `index.html`, `sw.js` ou qualquer asset, suba a versão do cache** em `sw.js`: `const CACHE = "rotina-v9"` → `"rotina-v10"`. Sem isso o navegador serve a versão antiga e a mudança parece não ter funcionado.
4. **Nada de armazenamento remoto.** Marcações, cargas por exercício e peso corporal ficam em `localStorage`, protegidos por `try/catch` com degradação silenciosa. Não adicionar backend, conta ou sincronização.
5. **Mobile-first.** Viewport de ~390px é o alvo. Testar mentalmente nessa largura antes de sugerir layout.

## Estrutura do JS

Numerada por seções comentadas dentro do `<script>`:

1. `PLANO_PADRAO` — modelo de dados (treinos, dias, refeições, sono, apetite)
2. `LOG`, `CARGAS`, `PESO`, `PLANO_USUARIO` — persistência em localStorage; no fim da seção, `PLANO` é montado
3. Utilitários de data, número e o helper `grafico()` (SVG à mão, sem biblioteca)
4. `renderHoje` — timeline do dia, estilo diagrama de rota de ônibus
5. `CRON` — cronômetro de descanso, barra fixa e pop-up de fim
6. `renderTreino` — os 4 treinos, registro de carga, progressão, técnica
7. `renderDieta` — macros e refeições
8. `renderRegistro` — estatísticas, calendário de 6 semanas, gráficos de carga e peso
9. `renderMais` — escala, sono, apetite
10. Editor do plano — painel de tela cheia, formulários sobre um rascunho
11. Compartilhar e receber plano — link com o plano no `#`, boas-vindas
12. Navegação de 5 abas

Cada render escreve em `innerHTML` de uma `<section class="view">`. As telas são reconstruídas por inteiro, não atualizadas parcialmente — é simples e rápido o bastante nesta escala.

Duas exceções deliberadas, ambas comentadas no código:

- **Salvar carga não re-renderiza a aba Treino** — só troca a linha daquele exercício. Um render completo fecharia os `<details>` abertos no meio da série.
- **Cronômetro, pop-up, editor e convite vivem fora das `.view`**, como irmãos do `<nav>`, senão o primeiro render os apagaria.

O cronômetro conta pelo **instante de término** (`Date.now() + seg*1000`), nunca decrementando um contador: o navegador congela timers em segundo plano, mas o relógio do aparelho não. Ao voltar para o app, o alarme dispara atrasado em vez de sumir.

Carga é indexada pelo **nome do exercício normalizado** — renomear no `PLANO` começa um histórico novo.

## Plano próprio de cada usuário

O app é usado por mais de uma pessoa, cada uma no seu aparelho. `PLANO_PADRAO` é o plano de fábrica; quem quiser o seu salva um JSON em `localStorage` (`rotina:plano:v1`), e `PLANO` sai da mescla:

```js
const PLANO = Object.assign({}, PLANO_PADRAO, PLANO_USUARIO.dados());
```

A mescla é **por chave de primeiro nível**, de propósito: quem salva `dias` troca os sete dias inteiros. Mesclar dia a dia produziria um dia meio do usuário, meio padrão — que não corresponde à rotina de ninguém. Na prática isso deixa quem quiser trocar só `meta` trocar só `meta`.

Quatro defesas, porque o plano agora vem de fora:

- **`validaPlano()`** roda antes de qualquer plano entrar, na importação e no carregamento. Devolve lista de problemas em português. Não pode depender de nada da seção 3 — roda antes dela existir.
- **Só `<em>`, `<b>`, `<strong>` e `<small>` passam** nos textos. Os campos do plano vão para a tela como HTML (é o que faz `<em>` destacar item de refeição), e o plano agora pode vir de um link de outra pessoa.
- **Plano salvo inválido é ignorado**, o app cai no padrão e avisa na aba Registro.
- **`?padrao=1` na URL** ignora o plano salvo. `boot()` recorre a isso sozinho se o primeiro render quebrar, para o app nunca ficar sem saída.

Ao adicionar chave nova no `PLANO_PADRAO`, considere se ela precisa de regra no `validaPlano()` — chave desconhecida no plano do usuário já é recusada automaticamente.

### O editor (seção 10)

Painel de tela cheia que trabalha num `rascunho` — cópia profunda do `PLANO` em vigor — e grava a cada alteração. Só mexe nas chaves de `CHAVES_EDITAVEIS`; o resto é teoria e só muda colando um plano.

Decisões que não devem ser desfeitas sem motivo:

- **Os campos são ligados por caminho** (`data-caminho="treinos.upperA.ex.0.1"`), com um `change` e um `click` delegados no container. Sem isso seriam centenas de listeners.
- **Só mudança estrutural re-renderiza o editor** (`data-estrutural`). Re-renderizar a cada tecla tiraria o foco do campo — a mesma lição do salvar carga.
- **`salvarRascunho()` guarda apenas o que difere do `PLANO_PADRAO`**, comparando por `JSON.stringify`. Quem mexeu só nas metas fica com um plano de três linhas, que cabe num link.
- **`sincronizaRota()` mantém a parada `g:1` igual ao que a Escala diz.** `dia.hora` e a parada do treino são a mesma informação em dois lugares; sem sincronizar, divergem — já divergiram antes na história deste projeto.
- **O selo de status vive fora do render** (`seloEstado`), senão o "Salvo" some no mesmo quadro em que aparece.

### Compartilhar (seção 11)

O plano viaja no `#` do endereço, comprimido com `CompressionStream` quando existe (7,5 KB de JSON viram um link de ~3,3 KB) e em base64 URL-safe quando não. Plano vindo de link **nunca é aplicado sozinho** — mostra resumo e pergunta, porque do outro lado pode haver um plano já montado. `hashchange` também é ouvido: com o app já aberto na tela inicial, tocar num link só troca o `#`.

## Design

Vocabulário visual de sinalização de transporte, derivado do Guia de Mobilidade da universidade: linhas de rota, pontos de parada, placar de partidas.

Cores em `:root`:
- `--line1: #2BB3C0` ciano — dieta, destaques, parada importante
- `--line2: #E8A33D` âmbar — treino
- `--signal: #E2574C` vermelho — momento atual, alertas
- Fundo escuro (`--ink: #0D141B`), porque o app é aberto às 5h30

Tipografia: Barlow Condensed para horários e rótulos (vibe de tabela de horários), IBM Plex Sans para corpo.

Manter essa direção ao adicionar telas. Não introduzir gradientes, sombras coloridas ou emoji.

## Contexto do dono

Estudante de Engenharia de Computação na UFRPE (Unidade Acadêmica de Belo Jardim), 2º período.
Mora em outra cidade e depende do ônibus universitário para voltar — por isso os horários de treino são tão específicos e frágeis. Ida de mototáxi (~10 min, horário livre); volta só de ônibus.

A academia abre 5h-12h e 14h-21h30, fechada entre 12h e 14h — é essa janela morta que define os horários de treino.

A escala atual: Lower A (seg 10h45), Upper A (ter 19h15), Upper B (qui 14h), Lower B (sex 6h).
Quarta, sábado e domingo são descanso.

O ônibus das 10h15 (chega em casa ~10h40) é o que viabiliza o treino da segunda, nos dias em que a aula termina às 10h.

Objetivo: hipertrofia com superávit calórico (~2600 kcal). Acompanhamento com nutricionista à parte.

## Idioma

Todo texto de interface, comentário de código e mensagem de commit em **português do Brasil**.
