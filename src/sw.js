const CACHE_NAME = "appweb-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/hospitais.html",
  "/menu.html",
  "/hospitais.css",
  "/menu.css",
  "/login.css",
  "/site.css",
  "/Imagens/hpmg1.png",
  "/Imagens/logo.png"
];

// Instalando o Service Worker e adicionando os arquivos ao cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log("Cache aberto");
      try {
        await cache.addAll(urlsToCache);
        console.log("Arquivos adicionados ao cache com sucesso.");
      } catch (error) {
        console.error("Erro ao adicionar arquivos ao cache:", error);
      }
    })
  );
});

// Interceptando requisições e servindo os arquivos do cache
self.addEventListener("fetch", event => {
  // Ignorar requisições data URLs
  if (event.request.url.startsWith("data:")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna o arquivo do cache ou faz a requisição para a rede
      return response || fetch(event.request);
    })
  );
});

// Atualizando o Service Worker e removendo caches antigos
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
