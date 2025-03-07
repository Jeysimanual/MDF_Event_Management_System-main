// Import Firebase modules
import { auth } from "../config/mdf-dtb.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const logoutButton = document.getElementById("logout-btn");

logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "../index.html"; // Redirect to login page
    } catch (error) {
        console.error("Logout error: ", error);
        alert("Failed to log out. Please try again.");
    }
});