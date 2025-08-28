// JS/myEvents.js

// בדיקת התחברות
const volunteer = JSON.parse(localStorage.getItem("loggedInUser"));
const userRole = localStorage.getItem("userRole");

if (!volunteer || !volunteer._id || userRole !== "volunteer") {
  alert("You must be logged in as a volunteer to view your events.");
  window.location.href = "/pages/login.html";
}

const container = document.querySelector("#eventsContainer");

// פונקציה לעיצוב תאריך
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// פונקציה לעיצוב שעה
function formatTime(timeStr) {
  if (!timeStr) return "Not defined";
  const [hour, minute] = timeStr.split(":");
  return `${hour}:${minute}`;
}

// פונקציה ליצירת כרטיס אירוע
function createEventCard(event) {
  const card = document.createElement("div");
  card.classList.add("event-card");

  const start = formatTime(event.time || "09:00");
  const end = formatTime(event.endTime || "15:00");
  const dateFormatted = formatDate(event.date);

  card.innerHTML = `
    <h2>${event.title}</h2>
    <p><strong>Date:</strong> ${dateFormatted}</p>
    <p><strong>Time:</strong> ${start}–${end}</p>
    <p><strong>Location:</strong> ${event.city}, ${event.streetName} ${event.streetNumber}</p>
    <p><strong>Contact:</strong> ${event.contactPhone || "N/A"} | ${event.contactEmail || "N/A"}</p>
    <div class="event-footer">
      <a class="calendar-link" 
         target="_blank"
         href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=20250224T070000Z/20250224T130000Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.city + ' ' + event.streetName)}">
        📅 Add to Calendar
      </a>
    </div>
  `;

  return card;
}

// שליפת האירועים מהשרת
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://handsonserver-new.onrender.com/api/events");
    const allEvents = await res.json();

    const registeredEvents = allEvents.filter(event =>
      event.participants?.some(p => p._id === volunteer._id)
    );

    if (registeredEvents.length === 0) {
      container.innerHTML = `
        <p style="text-align: center; margin-top: 60px; font-size: 18px; color: #888;">
          You haven't registered for any events yet.
        </p>
      `;
    } else {
      registeredEvents.forEach(event => {
        const card = createEventCard(event);
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error("Error fetching events:", err);
    container.innerHTML = "<p>Error loading events. Please try again later.</p>";
  }
});
