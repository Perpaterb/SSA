// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
//   };
  
// export default firebaseConfig;


// const firebaseConfig = {
//     apiKey: "AIzaSyATmUAYQ9NrusnOXsBJeUsDQj84OH--WlI",
//     authDomain: "game1-a7212.firebaseapp.com",
//     projectId: "game1-a7212",
//     storageBucket: "game1-a7212.appspot.com",
//     messagingSenderId: "912975645528",
//     appId: "1:912975645528:web:02e1e43f7b72fd4651332d",
//     measurementId: "G-NJ1JL142V1",
// };


// src/database/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase config from environment variables
const firebaseConfig = {
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID,
    // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    apiKey: "AIzaSyATmUAYQ9NrusnOXsBJeUsDQj84OH--WlI",
    authDomain: "game1-a7212.firebaseapp.com",
    projectId: "game1-a7212",
    storageBucket: "game1-a7212.appspot.com",
    messagingSenderId: "912975645528",
    appId: "1:912975645528:web:02e1e43f7b72fd4651332d",
    measurementId: "G-NJ1JL142V1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firestore and Auth for use in components
export { db, auth };


