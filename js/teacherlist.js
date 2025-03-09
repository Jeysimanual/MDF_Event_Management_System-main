import { realtimeDb } from "../config/mdf-dtb.js";
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    const teacherList = document.getElementById("teacher-list");

    const teacherRef = ref(realtimeDb, "teachers");
    onValue(teacherRef, (snapshot) => {
        teacherList.innerHTML = ""; // Clear the list before updating
        if (snapshot.exists()) {
            const teachers = snapshot.val();
            const verifiedTeachers = Object.entries(teachers)
                .filter(([_, teacher]) => teacher.role === "teacher" && teacher.verified);

            if (verifiedTeachers.length > 0) {
                verifiedTeachers.forEach(([uid, teacher]) => {
                    const fullname = `${teacher.firstname} ${teacher.lastname}`.trim();
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${fullname}</td>
                        <td>${teacher.email}</td>
                        <td>${teacher.contact_number}</td>
                        <td>Grade ${teacher.year_level_advisor}</td>
                        <td>${teacher.section}</td>
                        <td>
                            <button class="action-btn update-btn" onclick="updateTeacher('${uid}')">Update</button>
                            <button class="action-btn delete-btn" onclick="deleteTeacher('${uid}')">Delete</button>
                        </td>
                    `;
                    teacherList.appendChild(row);
                });
            } else {
                teacherList.innerHTML = "<tr><td colspan='6'>No verified teachers found.</td></tr>";
            }
        } else {
            teacherList.innerHTML = "<tr><td colspan='6'>No teachers found.</td></tr>";
        }
    }, (error) => {
        console.error("Error fetching teacher data: ", error);
        teacherList.innerHTML = "<tr><td colspan='6'>Failed to load teacher data.</td></tr>";
    });
});

window.deleteTeacher = function(uid) {
    const teacherRef = ref(realtimeDb, `teachers/${uid}`);
    if (confirm("Are you sure you want to delete this teacher?")) {
        remove(teacherRef)
            .then(() => alert("Teacher deleted successfully!"))
            .catch((error) => console.error("Error deleting teacher: ", error));
    }
};

window.updateTeacher = function(uid) {
    window.location.href = `update_teacher.html?uid=${uid}`;
};
