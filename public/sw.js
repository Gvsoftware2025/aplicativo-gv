self.addEventListener("install", (event) => {
  console.log("[v0] Service Worker instalado")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[v0] Service Worker ativado")
  event.waitUntil(clients.claim())
})

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request))
})
