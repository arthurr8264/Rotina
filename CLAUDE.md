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
4. **Nada de armazenamento remoto.** O registro de treino/dieta fica em `localStorage`, protegido por `try/catch` com degradação silenciosa. Não adicionar backend, conta ou sincronização.
5. **Mobile-first.** Viewport de ~390px é o alvo. Testar mentalmente nessa largura antes de sugerir layout.

## Estrutura do JS

Numerada por seções comentadas dentro do `<script>`:

1. `PLANO` — modelo de dados (treinos, dias, refeições, sono, apetite)
2. `LOG` — persistência em localStorage
3. Utilitários de data e hora
4. `renderHoje` — timeline do dia, estilo diagrama de rota de ônibus
5. `renderTreino` — os 4 treinos, progressão de carga, técnica
6. `renderDieta` — macros e refeições
7. `renderRegistro` — estatísticas e calendário de 6 semanas
8. `renderMais` — escala, sono, apetite
9. Navegação de 5 abas

Cada render escreve em `innerHTML` de uma `<section class="view">`. As telas são reconstruídas por inteiro, não atualizadas parcialmente — é simples e rápido o bastante nesta escala.

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

A escala atual: Upper A (ter 13h15), Lower A (qua 6h), Upper B (qui 13h30), Lower B (sex 6h).
Segunda, sábado e domingo são descanso.

Objetivo: hipertrofia com superávit calórico (~2600 kcal). Acompanhamento com nutricionista à parte.

## Idioma

Todo texto de interface, comentário de código e mensagem de commit em **português do Brasil**.
