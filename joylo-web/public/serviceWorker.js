/// <reference lib="webworker" />
/* eslint-disable no-undef */

// ✅ Firebase Scripts for background messaging
importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js");

// ✅ Workbox Scripts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';


// ✅ Firebase Config
firebase.initializeApp({
  apiKey: "AIzaSyBivB8KGXuzQXxISLkg4gO7ZfAAyzEHqHo",
  authDomain: "joylo-4594a.firebaseapp.com",
  projectId: "joylo-4594a",
  storageBucket: "joylo-4594a.firebasestorage.app",
  messagingSenderId: "461579001815",
  appId: "1:461579001815:web:358deb5c2bc03a61fd7592",
  measurementId: "G-VXTE3ZK51P",
});

// ✅ Get messaging instance
const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  
  console.log(" message recieved ",payload)
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/192.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

precacheAndRoute(self.__WB_MANIFEST);

// precacheAndRoute([
//   { url: '/', revision: 'v1' },
//   { url: '/offline.html', revision: 'v1' }
// ]);

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl;

  if (redirectUrl) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === redirectUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirectUrl);
        }
      })
    );
  }
})


// ✅ Cache GraphQL Queries
registerRoute(
  ({ url, request }) =>
    url.pathname.includes('/graphql') && request.method === 'GET',
  new NetworkFirst({
    cacheName: 'graphql-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  }),
);

// ✅ Cache static resources
registerRoute(
  ({ request }) =>
    request.method === 'GET' &&
    (
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'document'
    ),
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);


registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/'),
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);


// self.addEventListener('install', (event) => {
//   console.log('[Service Worker] Installing...');

//   console.log("[Service Worker] Installing...');",event)
//   event.waitUntil(
//     (async () => {
//       console.log("hereee i am ")
//       self.skipWaiting(); // Forces the waiting SW to become active
//     })()
//   );
// });

// self.addEventListener('activate', (event) => {
//   console.log('[Service Worker] Activating...');
//   event.waitUntil(
//     (async () => {

//       console.log("here in activation ")
//       await self.clients.claim(); // Take control of open pages
//     })()
//   );
// });