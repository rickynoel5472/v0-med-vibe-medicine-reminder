const CACHE_NAME = "medvibe-v1"
const urlsToCache = ["/", "/dashboard", "/onboarding", "/settings", "/history", "/refills", "/caregiver"]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("MedVibe: Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("MedVibe: Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
      })
      .catch(() => {
        // Return offline page if available
        return caches.match("/")
      }),
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Time to take your medicine!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    tag: "medvibe-reminder",
    requireInteraction: true,
    actions: [
      { action: "take", title: "Take Now" },
      { action: "snooze", title: "Snooze 10min" },
    ],
  }

  event.waitUntil(self.registration.showNotification("MedVibe Reminder", options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  if (event.action === "take") {
    event.waitUntil(clients.openWindow("/dashboard?action=take"))
  } else if (event.action === "snooze") {
    // Handle snooze - could trigger another notification in 10 min
    event.waitUntil(clients.openWindow("/dashboard?action=snooze"))
  } else {
    event.waitUntil(clients.openWindow("/dashboard"))
  }
})
