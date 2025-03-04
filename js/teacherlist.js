// Import Firebase modules
import { realtimeDb } from "../config/mdf-dtb.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    const teacherList = document.getElementById("teacher-list");

    const teacherRef = ref(realtimeDb, "teachers");
    onValue(teacherRef, (snapshot) => {
        teacherList.innerHTML = ""; // Clear the list before updating
        if (snapshot.exists()) {
            const teachers = snapshot.val();
            for (const uid in teachers) {
                const teacher = teachers[uid];
                if (teacher.role === "teacher") {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${teacher.fullname}</td>
                        <td>${teacher.email}</td>
                        <td>${teacher.username}</td>
                        <td>Grade ${teacher.year_level_advisor}</td>
                    `;
                    teacherList.appendChild(row);
                }
            }
        } else {
            teacherList.innerHTML = "<tr><td colspan='4'>No teachers found.</td></tr>";
        }
    }, (error) => {
        console.error("Error fetching teacher data: ", error);
        teacherList.innerHTML = "<tr><td colspan='4'>Failed to load teacher data.</td></tr>";
    });
});
