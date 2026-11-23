import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6bsm5IOYaas5XJqKQZAZyXfbDGIu8G78",
  authDomain: "aura-jewelry-bbcb7.firebaseapp.com",
  projectId: "aura-jewelry-bbcb7",
  storageBucket: "aura-jewelry-bbcb7.firebasestorage.app",
  messagingSenderId: "652029223479",
  appId: "1:652029223479:web:bfe431b3eca98bb32b95b2",
  measurementId: "G-659ENCZ6JX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

console.log("AURA Firebase Connected!");