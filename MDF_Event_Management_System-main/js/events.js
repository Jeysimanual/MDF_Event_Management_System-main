// Import Firebase modules from mdf-dtb.js
import { realtimeDb, ref } from "../config/mdf-dtb.js";
import { onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  // Import directly

document.addEventListener("DOMContentLoaded", function () {
    const eventsContainer = document.querySelector("#eventsContainer");

    // Reference to the "events" collection in Firebase Realtime Database
    const eventsRef = ref(realtimeDb, "events");

    // Fetch events from Firebase
    onValue(eventsRef, (snapshot) => {

        if (snapshot.exists()) {
            console.log("Events data received:", snapshot.val()); // Debugging log

            const events = snapshot.val();
            
            Object.keys(events).forEach((eventId) => {
                const event = events[eventId];

                // Create a new event box
                const eventBox = document.createElement("div");
                eventBox.classList.add("event-box");

                eventBox.innerHTML = `
                    <h3>${event.eventName || "No Title"}</h3>
                    <p><strong>Description:</strong> ${event.eventDescription || "N/A"}</p>
                    <p><strong>Venue:</strong> ${event.venue || "N/A"}</p>
                    <p><strong>Activation Date:</strong> ${event.activationDate || "N/A"}</p>
                    <p><strong>Activation Time:</strong> ${event.activationTime || "N/A"}</p>
                    <p><strong>Start Date:</strong> ${event.startDate || "N/A"}</p>
                    <p><strong>End Date:</strong> ${event.endDate || "N/A"}</p>
                    <p><strong>Start Time:</strong> ${event.startTime || "N/A"}</p>
                    <p><strong>End Time:</strong> ${event.endTime || "N/A"}</p>
                    <p><strong>Event Span:</strong> ${event.eventSpan || "N/A"}</p>
                    <p><strong>Ticket Type:</strong> ${event.ticketType || "N/A"}</p>
                    <p><strong>Created At:</strong> ${event.createdAt || "N/A"}</p>
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
