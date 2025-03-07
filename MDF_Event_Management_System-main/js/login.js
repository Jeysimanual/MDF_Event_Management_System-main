// Import Firebase modules from mdf-dtb.js
import { auth } from "../config/mdf-dtb.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const email = document.querySelector("input[name='email']").value.trim();
        const password = document.querySelector("input[name='password']").value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                if (user.emailVerified) {
                    console.log("Login successful, user:", user);
                    window.location.href = "html/dashboard.html";
                } else {
                    alert("Please verify your email before logging in.");
                    auth.signOut();
                }
            })
            .catch((error) => {
                console.error("Login error: ", error);
                alert(error.message);
            });
    });
});
