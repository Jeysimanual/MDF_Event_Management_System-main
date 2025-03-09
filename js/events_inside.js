// Import Firebase modules from mdf-dtb.js
import { realtimeDb, ref } from "../config/mdf-dtb.js";
import { onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; // Import directly

document.addEventListener("DOMContentLoaded", function () {
    const eventDetailsContainer = document.querySelector("#eventDetails");

    // Get eventId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");

    if (!eventId) {
        console.error("Event ID not found in the URL.");
        eventDetailsContainer.innerHTML = `<p>Error: Event not found.</p>`;
        return;
    }

    // Reference to the selected event in Firebase
    const eventRef = ref(realtimeDb, `events/${eventId}`);

    // Fetch event data from Firebase
    onValue(eventRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Event data received:", snapshot.val()); // Debugging log

            const event = snapshot.val();

            eventDetailsContainer.innerHTML = `
                <h2>${event.eventName || "No Title"}</h2>
                <p><strong>Description:</strong> ${event.eventDescription || "N/A"}</p>
                <p><strong>Type:</strong> ${event.eventType || "N/A"}</p>
                <p><strong>Venue:</strong> ${event.venue || "N/A"}</p>
                <p><strong>Start Date:</strong> ${event.startDate || "N/A"}</p>
                <p><strong>End Date:</strong> ${event.endDate || "N/A"}</p>
                <p><strong>Start Time:</strong> ${event.startTime || "N/A"}</p>
                <p><strong>End Time:</strong> ${event.endTime || "N/A"}</p>
                <p><strong>Event Span:</strong> ${event.eventSpan || "N/A"}</p>
                <p><strong>Ticket Type:</strong> ${event.ticketType || "N/A"}</p>
                <p><strong>Ticket Activation Time:</strong> ${event.ticketActivationTime || "N/A"}</p>
                <p><strong>Grace Time:</strong> ${event.graceTime || "N/A"}</p>
                <p><strong>Created At:</strong> ${event.dateCreated || "N/A"}</p>
                ${event.eventPhotoUrl ? `<img src="${event.eventPhotoUrl}" alt="Event Photo" style="max-width:100%; height:auto;">` : ""}
            `;
        } else {
            console.warn("Event not found in database.");
            eventDetailsContainer.innerHTML = `<p>Error: Event not found.</p>`;
        }
    }, (error) => {
        console.error("Error fetching event:", error);
        eventDetailsContainer.innerHTML = `<p>Error fetching event details.</p>`;
    });
});
