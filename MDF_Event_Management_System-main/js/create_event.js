// Import Firebase modules from mdf-dtb.js
import { realtimeDb, ref, set, push } from "../config/mdf-dtb.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#eventForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh

        // Get form input values
        const eventName = document.querySelector("input[name='eventName']").value.trim();
        const eventDescription = document.querySelector("textarea[name='eventDescription']").value.trim();
        const venue = document.querySelector("input[name='venue']").value.trim();
        const activationDate = document.querySelector("input[name='activationDate']").value.trim();
        const activationTime = document.querySelector("input[name='activationTime']").value.trim();
        const startDate = document.querySelector("input[name='startDate']").value.trim();
        const endDate = document.querySelector("input[name='endDate']").value.trim();
        const startTime = document.querySelector("input[name='startTime']").value.trim();
        const endTime = document.querySelector("input[name='endTime']").value.trim();
        const eventSpan = document.querySelector("select[name='eventSpan']").value;
        const ticketType = document.querySelector("select[name='ticketType']").value;

        if (!eventName || !eventDescription || !venue || !activationDate || !activationTime ||
            !startDate || !endDate || !startTime || !endTime || !eventSpan || !ticketType) {
            alert("Please fill in all fields.");
            return;
        }

        // Get the current date in "MM/DD/YYYY" format
        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, "0")}/${String(
            currentDate.getDate()
        ).padStart(2, "0")}/${currentDate.getFullYear()}`;

        // 🔹 Save event in Firebase Realtime Database
        const eventsRef = ref(realtimeDb, "events"); // Reference to the 'events' collection
        const newEventRef = push(eventsRef); // Generate unique ID for the event

        set(newEventRef, {
            eventName,
            eventDescription,
            venue,
            activationDate,
            activationTime,
            startDate,
            endDate,
            startTime,
            endTime,
            eventSpan,
            ticketType,
            createdAt: formattedDate, // Store the formatted date
        })
        .then(() => {
            alert("Event created successfully!");
            form.reset();
        })
        .catch((error) => {
            console.error("Error saving event:", error);
            alert("Error creating event: " + error.message);
        });
    });
});
