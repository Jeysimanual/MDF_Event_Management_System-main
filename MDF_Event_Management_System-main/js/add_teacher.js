// Import Firebase modules from mdf-dtb.js
import { auth, realtimeDb } from "../config/mdf-dtb.js";
import { ref, set, update } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const yearLevelSelect = document.getElementById('year_level');
    const sectionSelect = document.getElementById('section');

    const sections = {
        '7': ['Mabait', 'Masipag', 'Matulungin'],
        '8': ['Maayos', 'Mapagmahal', 'Magalang'],
        '9': ['Matapang', 'Malakas', 'Matalino'],
        '10': ['Matiyaga', 'Maparaan', 'Mabuting-loob'],
        '11': ['Maalalahanin', 'Mapagbigay', 'Mapagkumbaba'],
        '12': ['Mapanuri', 'Masigasig', 'Mahusay']
    };

    yearLevelSelect.addEventListener('change', function() {
        const year = yearLevelSelect.value;
        sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';
        if (sections[year]) {
            sections[year].forEach(section => {
                const option = document.createElement('option');
                option.value = section;
                option.textContent = section;
                sectionSelect.appendChild(option);
            });
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstname = document.querySelector("input[name='firstname']").value.trim();
        const lastname = document.querySelector("input[name='lastname']").value.trim();
        const email = document.querySelector("input[name='email']").value.trim();
        const contact_number = document.querySelector("input[name='contact_number']").value.trim();
        const year_level_advisor = document.querySelector("select[name='year_level_advisor']").value;
        const section = document.querySelector("select[name='section']").value;
        const password = document.querySelector("input[name='password']").value.trim();

        if (!firstname || !lastname || !email || !contact_number || !year_level_advisor || !section || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const contactRegex = /^09\d{9}$/;
        if (!contactRegex.test(contact_number)) {
            alert("Invalid contact number. It must start with '09' and be exactly 11 digits.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid;

                sendEmailVerification(user)
                    .then(() => {
                        alert("Verification email sent! Please check your inbox.");
                    })
                    .catch((error) => {
                        console.error("Verification email error: ", error);
                        alert("Failed to send verification email.");
                    });

                const userRef = ref(realtimeDb, `teachers/${uid}`);
                return set(userRef, {
                    firstname,
                    lastname,
                    email,
                    contact_number,
                    year_level_advisor,
                    section,
                    role: "teacher",
                    verified: false
                });
            })
            .then(() => {
                form.reset();

                const checkVerification = setInterval(async () => {
                    const user = auth.currentUser;
                    if (user) {
                        await user.reload();
                        if (user.emailVerified) {
                            const userRef = ref(realtimeDb, `teachers/${user.uid}`);
                            update(userRef, { verified: true })
                                .then(() => {
                                    console.log("User verified successfully in database.");
                                    clearInterval(checkVerification);
                                })
                                .catch((error) => console.error("Error updating verification status: ", error));
                        }
                    }
                }, 5000);
            })
            .catch((error) => {
                console.error("Error: ", error);
                alert(error.message);
            });
    });

    const contactInput = document.querySelector("input[name='contact_number']");
    contactInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
});
