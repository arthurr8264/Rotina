/* =========================================================
   Service worker — faz o app abrir sem internet.
   Ao publicar uma versão nova do index.html, suba o número
   em CACHE (v8 -> v9). Isso força o navegador a buscar os
   arquivos novos em vez de servir o cache antigo.
   ========================================================= */

const CACHE = "rotina-v8";

const ESSENCIAIS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg"
];

/* instala: guarda a casca do app */
self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ESSENCIAIS))
      .then(() => self.skipWaiting())
  );
});

/* ativa: apaga caches de versões anteriores */
self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(
        chaves.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* busca: cache primeiro, rede como reforço.
   Fontes do Google entram no cache na primeira visita online. */
self.addEventListener("fetch", evento => {
  const req = evento.request;
  if (req.method !== "GET") return;

  evento.respondWith(
    caches.match(req).then(guardado => {
      if (guardado) return guardado;

      return fetch(req).then(resposta => {
        const vaiPraCache =
          resposta.ok &&
          (req.url.startsWith(self.location.origin) || req.url.includes("fonts.g"));

        if (vaiPraCache) {
          const copia = resposta.clone();
          caches.open(CACHE).then(c => c.put(req, copia));
        }
        return resposta;
      }).catch(() => {
        /* offline e não está no cache: devolve a página principal */
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
