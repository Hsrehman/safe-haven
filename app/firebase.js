// Import Firebase and Firestore libraries
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDezwPmIta4uGKVf7ZYcwfNgnsBNV9Oi30",
    authDomain: "safe-haven-fc424.firebaseapp.com",
    projectId: "safe-haven-fc424",
    storageBucket: "safe-haven-fc424.firebasestorage.app",
    messagingSenderId: "120397105762",
    appId: "1:120397105762:web:6767bf70cb81bda3c05f3b",
    measurementId: "G-NRTYSBYJDN"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore methods
export { db, collection, addDoc };
