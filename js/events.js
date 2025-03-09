// Import Firebase modules from mdf-dtb.js
import { realtimeDb, ref } from "../config/mdf-dtb.js";
import { onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; // Import directly

document.addEventListener("DOMContentLoaded", function () {
    const eventsContainer = document.querySelector("#eventsContainer");

    // Reference to the "events" collection in Firebase Realtime Database
    const eventsRef = ref(realtimeDb, "events");

    // Fetch events from Firebase
    onValue(eventsRef, (snapshot) => {

        if (snapshot.exists()) {
            console.log("Events data received:", snapshot.val()); // Debugging log

            const events = snapshot.val();
            eventsContainer.innerHTML = ""; // Clear previous content before adding new events

            Object.keys(events).forEach((eventId) => {
                const event = events[eventId];

                // Create a new event box
                const eventBox = document.createElement("div");
                eventBox.classList.add("event-box");
                eventBox.dataset.eventId = eventId;
                eventBox.addEventListener("click", () => {
                    window.location.href = `events_inside.html?eventId=${eventId}`;
                });

                eventBox.innerHTML = `
                    <h3>${event.eventName || "No Title"}</h3>
                    <p><strong>Posted:</strong> ${event.dateCreated || "N/A"}</p>
                `;

                eventsContainer.appendChild(eventBox);
            });
        } else {
            console.warn("No events found in database.");
            eventsContainer.innerHTML = `<p>No events found.</p>`;
        }
    }, (error) => {
        console.error("Error fetching events:", error);
    });
});
