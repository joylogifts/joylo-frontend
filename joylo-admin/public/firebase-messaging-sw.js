/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyBivB8KGXuzQXxISLkg4gO7ZfAAyzEHqHo',
  authDomain: 'joylo-4594a.firebaseapp.com',
  projectId: 'joylo-4594a',
  storageBucket: 'joylo-4594a.firebasestorage.app',
  messagingSenderId: '461579001815',
  appId: '1:461579001815:web:358deb5c2bc03a61fd7592',
  measurementId: 'G-VXTE3ZK51P',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background Notification Received:', payload);

  const { title, body, redirectUrl } = payload.data;

  if (!title || !body) {
    console.error('🚨 Missing notification payload:', payload);
    return;
  }

  const notificationOptions = {
    body,
    icon: 'https://e7.pngegg.com/pngimages/875/651/png-clipart-background-brush-texture-brush-black.png',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'rider-updated',
    data: { redirectUrl },
    actions: [{ action: 'open', title: 'View Details' }],
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(() => {
      // Otherwise, open a new window/tab
      return clients.openWindow(redirectUrl);
    })
  );
});
