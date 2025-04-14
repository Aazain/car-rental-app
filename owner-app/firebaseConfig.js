// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPTp6n5k7ULMDFINb0bQBPyNI97_eOEc4",
    authDomain: "car-rental-app-d8bad.firebaseapp.com",
    projectId: "car-rental-app-d8bad",
    storageBucket: "car-rental-app-d8bad.firebasestorage.app",
    messagingSenderId: "291130184883",
    appId: "1:291130184883:web:f6442a127f2064362c4cc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
