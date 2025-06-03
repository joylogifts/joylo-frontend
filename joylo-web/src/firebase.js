// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBivB8KGXuzQXxISLkg4gO7ZfAAyzEHqHo",
  authDomain: "joylo-4594a.firebaseapp.com",
  projectId: "joylo-4594a",
  storageBucket: "joylo-4594a.firebasestorage.app",
  messagingSenderId: "461579001815",
  appId: "1:461579001815:web:358deb5c2bc03a61fd7592",
  measurementId: "G-VXTE3ZK51P",
};

export const initialize = () => {
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  return messaging;
};

export const isFirebaseSupported = async () => {
  return await isSupported();
};
