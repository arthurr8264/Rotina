# Rotina

App pessoal de escala de treino, dieta, sono e registro diário.
Site estático de arquivo único — sem build, sem dependências.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O app inteiro (HTML + CSS + JS) |
| `sw.js` | Service worker — faz abrir offline |
| `manifest.webmanifest` | Metadados de PWA |
| `icon.svg` | Ícone da tela inicial |
| `GUIA.md` | Como editar o conteúdo |

## Editar

Todo o conteúdo está no objeto `PLANO`, no começo do `<script>` do `index.html`.
Ver `GUIA.md`.

Ao publicar uma versão nova, suba o número em `sw.js`:
`const CACHE = "rotina-v3"` → `"rotina-v4"`.

## Rodar local

Duplo clique no `index.html`. O service worker não funciona em `file://` —
para testar o offline, use um servidor local:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Dados

As marcações de treino e dieta ficam no `localStorage` do navegador,
apenas no aparelho. Nada é enviado para servidor nenhum.
