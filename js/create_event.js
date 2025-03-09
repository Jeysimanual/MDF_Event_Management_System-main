// Import Firebase modules from mdf-dtb.js
import { realtimeDb, ref, set, push, storage, storageReference, uploadBytes, getDownloadURL } from "../config/mdf-dtb.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#eventForm");

    // Handle "Other" event type input visibility
    const eventTypeSelect = document.querySelector("#eventType");
    const otherEventTypeGroup = document.querySelector("#otherEventTypeGroup");
    const otherEventTypeInput = document.querySelector("#otherEventType");

    eventTypeSelect.addEventListener("change", function () {
        if (eventTypeSelect.value === "other") {
            otherEventTypeGroup.style.display = "block"; // Show input
            otherEventTypeInput.setAttribute("required", "true"); // Make it required
        } else {
            otherEventTypeGroup.style.display = "none"; // Hide input
            otherEventTypeInput.removeAttribute("required"); // Remove required attribute
            otherEventTypeInput.value = ""; // Clear value
        }
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page refresh

        // Get form input values
        const eventName = document.querySelector("#eventName").value.trim();
        const eventDescription = document.querySelector("#eventDescription").value.trim();
        let eventType = document.querySelector("#eventType").value;
        if (eventType === "other") {
            eventType = document.querySelector("#otherEventType").value.trim();
        }
        const venue = document.querySelector("#venue").value.trim();
        const startDate = document.querySelector("#startDate").value.trim();
        const endDate = document.querySelector("#endDate").value.trim();
        const startTime = document.querySelector("#startTime").value.trim();
        const endTime = document.querySelector("#endTime").value.trim();
        const eventSpan = document.querySelector("#eventSpan").value;
        const ticketType = document.querySelector("#ticketType").value;
        const ticketActivationTime = document.querySelector("#ticketActivationTime").value.trim();
        const graceTime = document.querySelector("#graceTime").value.trim();
        const eventPhoto = document.querySelector("#eventPhoto").files[0];

        if (!eventName || !eventDescription || !eventType || !venue || !startDate || !endDate ||
            !startTime || !endTime || !eventSpan || !ticketType || !ticketActivationTime || !graceTime || !eventPhoto) {
            alert("Please fill in all fields.");
            return;
        }

        const eventsRef = ref(realtimeDb, "events");
        const newEventRef = push(eventsRef);
        const eventId = newEventRef.key;

        // Format the current date to "March 07, 2025"
        function formatDate(date) {
            const options = { year: "numeric", month: "long", day: "2-digit" };
            return new Intl.DateTimeFormat("en-US", options).format(date);
        }

        const eventData = {
            eventName,
            eventDescription,
            eventType, // Store selected event type or custom input
            venue,
            startDate,
            endDate,
            startTime,
            endTime,
            eventSpan,
            ticketType,
            ticketActivationTime,
            graceTime,
            dateCreated: formatDate(new Date()), // Store formatted event creation timestamp
        };

        try {
            const imageUrl = await uploadEventPhoto(eventPhoto, eventName);
            eventData.eventPhotoUrl = imageUrl;
            await set(newEventRef, eventData);

            alert("Event created successfully!");
            form.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to create event: " + error.message);
        }
    });

    async function uploadEventPhoto(file, eventName) {
        // Format event name to create a valid folder name
        const sanitizedEventName = eventName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
        const fileExtension = file.name.split('.').pop(); // Get file extension (e.g., png, jpg)
        const uniqueSuffix = Date.now(); // Unique timestamp to prevent overwriting
        const fileName = `${uniqueSuffix}.${fileExtension}`; // Create a unique filename

        // Save inside a folder named after the event (without "event_photos/" prefix)
        const fileRef = storageReference(storage, `${sanitizedEventName}/${fileName}`);
        const snapshot = await uploadBytes(fileRef, file);
        return getDownloadURL(snapshot.ref);
    }
});
