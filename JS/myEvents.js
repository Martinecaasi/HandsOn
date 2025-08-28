import { getRegisteredEvents } from "../Api/eventsApi.js";

// בדיקת התחברות
const volunteer = JSON.parse(localStorage.getItem("loggedInUser"));

if (!volunteer || !volunteer._id) {
  alert("You must be logged in to view your events.");
  window.location.href = "/pages/logIn.html";
}

const container = document.querySelector("#eventsContainer");

// פונקציה ליצירת כרטיס אירוע
function createEventCard(event) {
  const card = document.createElement("div");
  card.classList.add("event-card");

  const start = event.time || "09:00";
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
document.addEventListener('DOMContentLoaded', async () => {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const loggedInUser = localStorage.getItem('loggedInUser');
  const userRole = localStorage.getItem('userRole');

  if (!loggedInUser || userRole !== 'organizer') {
    window.location.href = '/Pages/login.html';
    return;
  }

  const organizer = JSON.parse(loggedInUser);
  const titleElement = document.querySelector('.title');
  const eventsContainer = document.getElementById('eventsContainer');

  const nameToShow = organizer.fullName || organizer.name || organizer.organizationName || 'Organizer';
  if (titleElement) {
    titleElement.textContent = `Welcome, ${nameToShow}! Upcoming Events`;
  }

  if (!organizer._id) {
    eventsContainer.innerHTML = "<p>You must be logged in as an organization.</p>";
    return;
  }

  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/events');
    const allEvents = await res.json();

    const orgEvents = allEvents.filter(event => event.createdBy?._id === organizer._id);

    if (orgEvents.length === 0) {
      eventsContainer.innerHTML = `
        <p style="text-align: center; margin-top: 60px; font-size: 18px; color: #888;">
          You haven't created any events yet.
        </p>
      `;
    } else {
      orgEvents.forEach(event => {
        const formattedDate = formatDate(event.date);
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
          <p class="event-name">${event.title}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>City:</strong> ${event.city}</p>
          <p><strong>Participants:</strong> ${event.participants?.length || 0}</p>
        `;
        eventsContainer.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    eventsContainer.innerHTML = "<p>Error loading events.</p>";
  }
});
