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
2. **Todo conteúdo vive no objeto `PLANO`**, no início da tag `<script>`. Nunca escreva textos de conteúdo direto no HTML — sempre passe pelo `PLANO`, porque é ali que o dono edita.
3. **Ao alterar `index.html`, `sw.js` ou qualquer asset, suba a versão do cache** em `sw.js`: `const CACHE = "rotina-v3"` → `"rotina-v4"`. Sem isso o navegador serve a versão antiga e a mudança parece não ter funcionado.
4. **Nada de armazenamento remoto.** Marcações, cargas por exercício e peso corporal ficam em `localStorage`, protegidos por `try/catch` com degradação silenciosa. Não adicionar backend, conta ou sincronização.
5. **Mobile-first.** Viewport de ~390px é o alvo. Testar mentalmente nessa largura antes de sugerir layout.

## Estrutura do JS

Numerada por seções comentadas dentro do `<script>`:

1. `PLANO` — modelo de dados (treinos, dias, refeições, sono, apetite)
2. `LOG`, `CARGAS`, `PESO` — persistência em localStorage
3. Utilitários de data, número e o helper `grafico()` (SVG à mão, sem biblioteca)
4. `renderHoje` — timeline do dia, estilo diagrama de rota de ônibus
5. `CRON` — cronômetro de descanso, barra fixa e pop-up de fim
6. `renderTreino` — os 4 treinos, registro de carga, progressão, técnica
7. `renderDieta` — macros e refeições
8. `renderRegistro` — estatísticas, calendário de 6 semanas, gráficos de carga e peso
9. `renderMais` — escala, sono, apetite
10. Navegação de 5 abas

Cada render escreve em `innerHTML` de uma `<section class="view">`. As telas são reconstruídas por inteiro, não atualizadas parcialmente — é simples e rápido o bastante nesta escala.

Duas exceções deliberadas, ambas comentadas no código:

- **Salvar carga não re-renderiza a aba Treino** — só troca a linha daquele exercício. Um render completo fecharia os `<details>` abertos no meio da série.
- **A barra do cronômetro e o pop-up vivem fora das `.view`**, como irmãos do `<nav>`, senão o primeiro render os apagaria.

O cronômetro conta pelo **instante de término** (`Date.now() + seg*1000`), nunca decrementando um contador: o navegador congela timers em segundo plano, mas o relógio do aparelho não. Ao voltar para o app, o alarme dispara atrasado em vez de sumir.

Carga é indexada pelo **nome do exercício normalizado** — renomear no `PLANO` começa um histórico novo.

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
