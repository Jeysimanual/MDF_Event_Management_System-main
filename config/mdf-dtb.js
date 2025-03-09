import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getStorage, ref as storageReference, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUCju69zFIrVonaCsQqr1xChNjWY8oaj0",
    authDomain: "ticket-mate-d4c52.firebaseapp.com",
    databaseURL: "https://ticket-mate-d4c52-default-rtdb.firebaseio.com",
    projectId: "ticket-mate-d4c52",
    storageBucket: "ticket-mate-d4c52.appspot.com",
    messagingSenderId: "330882875782",
    appId: "1:330882875782:web:1376682db18cda8401ec07",
    measurementId: "G-SH4T1L3B29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export Firebase modules
export { app, auth, db, realtimeDb, storage, ref, set, push, onValue, storageReference, uploadBytes, getDownloadURL };
