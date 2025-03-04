// Import Firebase modules from mdf-dtb.js
import { auth, realtimeDb } from "../config/mdf-dtb.js";
import { ref, set, push } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        // Get form input values
        const fullname = document.querySelector("input[name='fullname']").value.trim();
        const email = document.querySelector("input[name='email']").value.trim();
        const username = document.querySelector("input[name='username']").value.trim();
        const year_level_advisor = document.querySelector("input[name='yearl_level_advisor']").value.trim();
        const password = document.querySelector("input[name='password']").value.trim();

        if (!fullname || !email || !username || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // 🔹 Register user in Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user; // Get user details from Firebase Auth
                const uid = user.uid; // Unique user ID assigned by Firebase

                // 🔹 Save user details (excluding password) in Realtime Database
                const userRef = ref(realtimeDb, `users/${uid}`); // Store user data under their UID
                return set(userRef, {
                    fullname,
                    email,
                    username,
                    year_level_advisor
                });
            })
            .then(() => {
                alert("User registered successfully!");
                form.reset();
            })
            .catch((error) => {
                console.error("Error: ", error);
                alert(error.message);
            });
    });
});
