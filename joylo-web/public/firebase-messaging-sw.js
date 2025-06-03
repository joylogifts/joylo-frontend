/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js"
);
const app = firebase.initializeApp({
  apiKey: "AIzaSyBivB8KGXuzQXxISLkg4gO7ZfAAyzEHqHo",
  authDomain: "joylo-4594a.firebaseapp.com",
  projectId: "joylo-4594a",
  storageBucket: "joylo-4594a.firebasestorage.app",
  messagingSenderId: "461579001815",
  appId: "1:461579001815:web:358deb5c2bc03a61fd7592",
  measurementId: "G-VXTE3ZK51P",
});
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(function (payload) {
  // Customize notification here
  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/favicon.png",
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(title, notificationOptions);
});
