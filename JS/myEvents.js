// /JS/myEvents.js
import { getRegisteredEvents } from "../Api/eventsApi.js";

// בדיקת התחברות
const volunteer = JSON.parse(localStorage.getItem("loggedInUser"));

if (!volunteer || !volunteer._id) {
  alert("You must be logged in to view your events.");
  window.location.href = "/pages/volunteer/loginVol.html";
}

const container = document.querySelector("#eventsContainer");

// פונקציה ליצירת כרטיס אירוע
function createEventCard(event) {
  const card = document.createElement("div");
  card.classList.add("event-card");

  const start = event.startTime || "09:00";
  const end = event.endTime || "15:00";

  card.innerHTML = `
    <h2>${event.title}</h2>
    <p>${new Date(event.date).toDateString()}</p>
    <p>${start}–${end}</p>
    <p>${event.city}, ${event.streetName} ${event.streetNumber}</p>
    <p>${event.contactName || "Contact"} – ${event.contactPhone || ""}</p>
    <div class="event-footer">
      <span class="approved">APPROVED</span>
      <a class="calendar-link" 
         target="_blank"
         href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=20250224T070000Z/20250224T130000Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.city + ' ' + event.streetName)}">
        Add To Calendar
      </a>
    </div>
  `;

  return card;
}

// טעינת האירועים מהשרת
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const events = await getRegisteredEvents(volunteer._id);

    if (!events || events.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "You haven’t registered to any events yet.";
      empty.style.textAlign = "center";
      container.appendChild(empty);
      return;
    }

    events.forEach(event => {
      const card = createEventCard(event);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading events:", err);
    alert("Failed to load your events.");
  }
});