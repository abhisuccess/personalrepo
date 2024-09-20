// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object from the console
const firebaseConfig = {
  apiKey: "AIzaSyBNCsigJhmhoYwzpLHRMQbg-Z64BLCXBgQ",
  authDomain: "proposalmy-4c3fd.firebaseapp.com",
  projectId: "proposalmy-4c3fd",
  storageBucket: "proposalmy-4c3fd.appspot.com",
  messagingSenderId: "98522329525",
  appId: "1:98522329525:web:daf8edd284d36ed25969fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (database)
const db = getFirestore(app);

export { db };
