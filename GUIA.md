# Guia de edição — app Rotina

Tudo que aparece no app vem de um único objeto chamado `PLANO_PADRAO`, que fica no começo da tag `<script>` dentro do `index.html`. Você edita ali e a mudança aparece em todas as telas, para você e para quem usa o app sem ter montado um plano próprio.

**Nenhuma edição exige internet.** Abra o `index.html` no navegador (duplo clique) e recarregue com `Cmd + R` para ver o resultado.

> **Quer dar o app para um colega?** Ele não precisa mexer no código. Veja [Plano próprio, sem editar código](#plano-próprio-sem-editar-código) no fim deste guia.

---

## Antes de começar

Três regras que evitam 90% dos erros:

1. **Texto sempre entre aspas duplas.** `"Supino reto"` — nunca `Supino reto`.
2. **Vírgula separa itens de uma lista.** O último item da lista não leva vírgula depois.
3. **Chaves e colchetes andam em par.** Se você apagar um `[`, apague o `]` correspondente.

Se o app abrir em branco depois de uma edição, foi erro de sintaxe. Abra o console do navegador (`Cmd + Option + J` no Chrome/Brave) — ele aponta a linha.

**Faça uma cópia do arquivo antes de mexer.** `index-backup.html` já resolve.

---

## Mudanças mais comuns

### Trocar um exercício

Procure por `treinos:` e ache o treino. Cada exercício é uma linha assim:

```js
["Supino reto (barra)","4 x 8-10","Bench Press (Barbell)","",150],
```

A ordem é: **nome** · **séries x reps** · **nome no Hevy** · **dica (opcional)** · **descanso em segundos (opcional)**.

Para trocar supino reto por supino na máquina:

```js
["Supino máquina","4 x 8-10","Chest Press (Machine)"],
```

Para adicionar uma dica, acrescente um quarto texto:

```js
["Supino máquina","4 x 8-10","Chest Press (Machine)","Não trave o cotovelo no topo."],
```

### Mudar o tempo de descanso de um exercício

É o **quinto item**, em segundos. `150` são 2min30.

```js
["Supino máquina","4 x 8-10","Chest Press (Machine)","",180],
```

A dica fica como `""` quando você não quer nenhuma, mas ainda precisa do quinto item — as posições contam.

Quem não tem o quinto item usa o padrão, logo abaixo dos treinos:

```js
descansoSeg:90,
```

Esse número é o que aparece no botão ao lado de cada exercício, e é o tempo que o cronômetro conta.

### Adicionar ou remover um exercício

Adicionar: copie uma linha inteira e cole abaixo, mudando o conteúdo. Cuide para que todas as linhas tenham vírgula no fim, menos a última.

Remover: apague a linha inteira. Se apagou a última, tire a vírgula da que virou última.

### Mudar séries e repetições

Só o segundo texto:

```js
["Agachamento livre","5 x 6-8","Squat (Barbell)"],
```

### Mudar calorias e macros

Procure por `meta:` no topo:

```js
meta:{ kcal:2600, ptn:148, cho:330, gord:75, peso:56.1 },
```

Números aqui vão **sem aspas**. Se a nutricionista passar um TDEE diferente, é só trocar `kcal` e recalcular os macros.

### Mudar uma refeição

Procure por `refeicoes:`. Cada uma tem esta forma:

```js
{n:1,nome:"Café da manhã",kcal:500,quando:"ao acordar",itens:[
  "60 g de aveia em flocos",
  "1 banana média"
]},
```

`itens` é uma lista de textos. Adicione, remova ou edite as linhas. Para destacar uma palavra em âmbar, envolva com `<em>`:

```js
"200 ml de leite <em>ou</em> 30 g de leite em pó",
```

### Mudar horário de aula ou de ônibus

Procure por `dias:`. Cada dia tem uma `rota`, que é a lista de paradas:

```js
{t:"08:00",l:"Física Geral 2",k:1},
```

- `t` — horário, sempre no formato `"HH:MM"` com dois dígitos
- `l` — o que aparece na tela
- `s` — segunda linha, menor e em cinza (opcional)
- `k:1` — marca como parada importante (fica em ciano)
- `g:1` — marca como treino (fica em âmbar, maior)

Mantenha as paradas em ordem crescente de horário — o app usa essa ordem para saber onde você está no dia.

### Mudar o dia ou horário de um treino

No topo de cada dia:

```js
2:{ nome:"Terça", abbr:"Ter", treino:"upperA", hora:"19:15", ... }
```

- `treino` — precisa ser `"upperA"`, `"lowerA"`, `"upperB"`, `"lowerB"` ou `null`
- `hora` — o que aparece na escala
- `null` transforma o dia em descanso

Se mudar o treino de dia, lembre de mudar também a parada `g:1` dentro da `rota` daquele dia.

### Mudar horários de sono

```js
sono:[["Terça · Quinta","22:30","06:30"], ...]
```

Ordem: **descrição** · **dormir** · **acordar**.

### Adicionar uma regra nas listas

`sonoRegras`, `apetite` e `tecnica` são listas simples de texto. Adicione uma linha:

```js
"<b>Título em negrito.</b> Explicação normal.",
```

---

## O que o app guarda no aparelho

Três coisas, todas só no celular, nada em servidor:

| O quê | Onde se registra | Onde se vê |
|---|---|---|
| Marcação de treino e dieta | Aba Hoje ou Registro | Calendário e estatísticas |
| Qual treino foi feito no dia | Seletor que aparece ao marcar "Treinei" | Aba Treino e estatísticas |
| Carga de cada exercício | Campo `kg × reps` na aba Treino | Linha "última vez" e gráfico no Registro |
| Peso corporal | Campo na aba Registro | Gráfico e ritmo semanal |

### Treinar num dia que não estava previsto

A escala diz o que era para ser, não o que foi. Se um imprevisto derrubar o treino de segunda e você encaixá-lo na quarta, marque **Treinei** na quarta normalmente — o botão funciona em qualquer dia, inclusive nos de descanso.

Ao marcar, aparece o seletor **Qual treino foi feito**, já com o treino da escala escolhido. Troque para o que você realmente fez. Se for diferente do previsto, o app diz qual era o do dia, sem cobrar nada.

Duas coisas mudam junto:

- O treino conta nas estatísticas **no dia em que foi feito**. Remanejar deixa de aparecer como falta.
- A aba Treino abre o treino que você registrou, não o da escala — os exercícios que você vai fazer ficam à mão.

### Como funciona o registro de carga

A carga é guardada **pelo nome do exercício**. Duas consequências:

- **Renomear um exercício começa um histórico novo.** Se você trocar "Supino reto (barra)" por "Supino reto", o app passa a contar do zero. Se quiser preservar o histórico, mantenha o nome.
- **O mesmo nome em dois treinos compartilha o histórico.** "Mesa flexora" está em Lower A e Lower B, e é o mesmo exercício — então é uma linha só no gráfico, que é o comportamento certo.

Só entra **um registro por dia por exercício**: salvar de novo no mesmo dia corrige o valor em vez de duplicar. As repetições são opcionais — dá para anotar só o peso.

### Apagar dados

Na aba Registro, no fim, há dois botões separados:

- **Apagar marcações do calendário** — some com os checks de treino e dieta, mantém cargas e pesos.
- **Apagar cargas e pesos** — some com todo o histórico dos exercícios e da balança.

São separados de propósito: limpar um check esquecido não pode custar meses de progressão.

---

## Mudanças de aparência

As cores ficam no topo do arquivo, na seção `:root`:

```css
--line1:#2BB3C0;   /* ciano — dieta, destaques */
--line2:#E8A33D;   /* âmbar — treino */
--signal:#E2574C;  /* vermelho — agora, alertas */
--ink:#0D141B;     /* fundo */
```

Trocar `--line2` muda a cor de treino no app inteiro.

---

## Publicar a mudança

Depois de editar, é preciso subir o arquivo — senão só muda no seu computador.

**Importante:** toda vez que publicar uma versão nova, abra o `sw.js` e suba o número da versão:

```js
const CACHE = "rotina-v3";   →   const CACHE = "rotina-v4";
```

Sem isso, o service worker continua servindo a versão antiga do cache e você vai achar que a edição não funcionou.

Se estiver com o Netlify conectado ao Git, basta o commit:

```bash
git add .
git commit -m "ajusta treino de terça"
git push
```

O Netlify publica sozinho em ~30 segundos.

---

## Plano próprio, sem editar código

O app serve mais de uma pessoa. Cada aparelho pode ter o seu plano, salvo localmente, sem tocar no `index.html` e sem conta nenhuma.

### O caminho normal: o editor

Na aba **Registro**, seção **Meu plano**, botão **Editar meu plano**. Abre um painel com seis blocos:

| Bloco | O que muda |
|---|---|
| **Escala** | Qual treino em cada dia, a que horas, e o recado que aparece no topo da tela |
| **Metas do dia** | Calorias, macros, peso de referência e o descanso padrão entre séries |
| **Treinos** | Nome de cada treino e a lista de exercícios: nome, séries×reps, descanso, nome no Hevy e dica |
| **Rota de cada dia** | A linha do tempo da aba Hoje — horário, texto, segunda linha e se é aula. Dá para conferir o resultado sem esperar o dia chegar: na aba Hoje, toque no dia na tira de cima |
| **Refeições** | Nome, calorias, quando, e os itens (um por linha) |
| **Sono e transporte** | Horários de dormir e acordar, e os ônibus |

Tudo salva sozinho, a cada campo. O selo no topo diz **Salvo** quando gravou, ou aponta o problema em vermelho — enquanto houver problema, nada é gravado e o plano anterior continua valendo.

**A Escala manda na rota.** Trocar o treino ou o horário de um dia move sozinha a parada do treino na rota daquele dia, e renomear um treino renomeia a parada em todos os dias que o usam. Por isso a parada do treino aparece travada dentro de "Rota de cada dia" — ela vem da Escala.

### Mandar seu plano para alguém

Botão **Criar link para mandar a alguém**: gera um link com o plano dentro dele e copia. É só mandar no WhatsApp. Quem abrir vê um resumo do plano e escolhe se aplica — nunca é aplicado sozinho, porque a pessoa pode já ter montado o dela.

Não existe servidor nesse caminho: o plano viaja dentro do próprio endereço, comprimido. Se o seu plano ficar grande demais para caber num link, o app avisa e manda usar **Copiar plano**.

As marcações, cargas e pesos de cada pessoa já eram separados desde sempre — cada aparelho tem os próprios.

### O caminho manual: JSON

Dentro de **Backup e importação**:

| Botão | O que faz |
|---|---|
| **Copiar plano** | Copia o plano atual em JSON, para colar num editor |
| **Baixar arquivo** | Salva o JSON como arquivo, para backup |
| **Aplicar plano colado** | Lê o texto da caixa e passa a usá-lo |
| **Abrir arquivo** | O mesmo, a partir de um arquivo salvo |
| **Voltar ao plano padrão** | Apaga o plano do aparelho e volta ao de fábrica |

O plano é um JSON com as mesmas chaves do `PLANO_PADRAO`. **Não precisa mandar tudo**: o que você não incluir continua vindo do padrão. Quem só quer mudar as calorias manda três linhas:

```json
{ "meta": { "kcal": 2200, "ptn": 130, "cho": 250, "gord": 70, "peso": 70 } }
```

A troca é **por chave inteira**: mandar `dias` substitui os sete dias, então mande os sete, não só a segunda.

Dá para trocar por aqui: `meta`, `treinos`, `dias`, `refeicoes`, `sono`, `descansoSeg`, `onibus` — os mesmos que o editor mexe.
E também: `tecnica`, `sonoRegras`, `apetite`, `ciclo`, `incremento`, `trocas`, `ajustes` — teoria de treino e dieta, que o editor não mostra justamente por ser igual para todo mundo.

Nos textos só entram `<em>`, `<b>`, `<strong>` e `<small>`. Qualquer outra marcação é recusada, porque um plano pode chegar de fora.

### A primeira abertura

Quem abre o app pela primeira vez recebe um cartão perguntando se quer usar este plano como está, montar o seu, ou colar um que mandaram. Aparece uma vez só.

### Se o plano tiver erro

O app confere antes de aceitar e lista o que está errado em português — horário fora do formato, parada fora de ordem, treino que não existe, chave inventada. Enquanto houver erro, nada é salvo e o plano antigo continua valendo.

Se um plano salvo der problema depois, o app cai sozinho no plano padrão e avisa na aba Registro, em vez de abrir em branco. Para forçar isso à mão, abra o app acrescentando `?padrao=1` no fim do endereço:

```
https://rotina-arthurrr.netlify.app/?padrao=1
```

O plano salvo não é apagado — só ignorado nessa abertura, o suficiente para chegar ao botão de corrigir ou apagar.

### Onde isso mora

Só no aparelho, no `localStorage`, junto das marcações e das cargas. Não sobe para lugar nenhum e não sincroniza entre celular e computador. **Quem montou um plano longo deveria baixar o arquivo de vez em quando** — é o único backup que existe.

---

## Se quebrar tudo

```bash
git checkout -- index.html
```

Isso desfaz todas as alterações não commitadas e volta ao último estado que funcionava. É a maior vantagem de usar Git aqui.
