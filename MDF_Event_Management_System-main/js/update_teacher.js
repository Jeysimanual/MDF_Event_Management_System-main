import { realtimeDb } from "../config/mdf-dtb.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Get teacher UID from URL
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');

const sectionsData = {
    '7': ['Mabait', 'Masipag', 'Matulungin'],
    '8': ['Maayos', 'Mapagmahal', 'Magalang'],
    '9': ['Matapang', 'Malakas', 'Matalino'],
    '10': ['Matiyaga', 'Maparaan', 'Mabuting-loob'],
    '11': ['Maalalahanin', 'Mapagbigay', 'Mapagkumbaba'],
    '12': ['Mapanuri', 'Masigasig', 'Mahusay']
};

if (uid) {
    const teacherRef = ref(realtimeDb, `teachers/${uid}`);

    // Fetch teacher data and fill the form
    get(teacherRef).then((snapshot) => {
        if (snapshot.exists()) {
            const teacher = snapshot.val();
            document.getElementById('firstname').value = teacher.firstname;
            document.getElementById('lastname').value = teacher.lastname;
            document.getElementById('email').value = teacher.email;
            document.getElementById('contact_number').value = teacher.contact_number;
            document.getElementById('year_level').value = teacher.year_level_advisor;
            loadSections(teacher.year_level_advisor, teacher.section);
        } else {
            alert("Teacher not found");
            window.location.href = 'teacher_list.html';
        }
    }).catch((error) => console.error("Error fetching teacher data: ", error));
}

// Load sections based on selected year level
function loadSections(yearLevel, selectedSection = '') {
    const sectionSelect = document.getElementById('section');
    sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';

    const sections = sectionsData[yearLevel];
    if (sections) {
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            if (section === selectedSection) option.selected = true;
            sectionSelect.appendChild(option);
        });
    } else {
        console.warn("No sections found for this year level");
    }
}

// Listen for year level change
document.getElementById('year_level').addEventListener('change', (e) => {
    loadSections(e.target.value);
});

// Restrict contact number input to digits only
const contactInput = document.getElementById('contact_number');
contactInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, ''); // Remove non-numeric characters
});

// Update teacher data
document.getElementById('update-teacher-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const contactRegex = /^09\d{9}$/;
    const contact_number = document.getElementById('contact_number').value;

    if (!contactRegex.test(contact_number)) {
        alert("Invalid contact number. It must start with '09' and be exactly 11 digits.");
        return;
    }

    const updatedData = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        contact_number,
        year_level_advisor: document.getElementById('year_level').value,
        section: document.getElementById('section').value
    };

    update(ref(realtimeDb, `teachers/${uid}`), updatedData)
        .then(() => {
            alert("Teacher information updated successfully!");
            window.location.href = 'teacher_list.html';
        })
        .catch((error) => console.error("Error updating teacher data: ", error));
});
