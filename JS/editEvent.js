// /JS/editEvent.js
import { getEventById, updateEvent } from '../Api/eventsApi.js';

const form = document.getElementById('editEventForm');
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

if (!eventId) {
  alert("Event ID not found in URL.");
  window.location.href = "/Pages/Organizer/homePage.html";
}

// שליפת אירוע קיים לפי ID
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const event = await getEventById(eventId);

    document.getElementById('title').value = event.title || '';
    document.getElementById('date').value = event.date?.slice(0, 10) || '';
    document.getElementById('startTime').value = event.startTime || '';
    document.getElementById('city').value = event.city || '';
    document.getElementById('streetName').value = event.streetName || '';
    document.getElementById('streetNumber').value = event.streetNumber || '';
    document.getElementById('handsNeeded').value = event.handsNeeded || '';
    document.getElementById('category').value = event.category || '';
    document.getElementById('contactPhone').value = event.contactPhone || '';
    document.getElementById('contactEmail').value = event.contactEmail || '';
    document.getElementById('description').value = event.description || '';
  } catch (err) {
    console.error('Error loading event:', err);
    alert('Failed to load event details.');
  }
});

// שליחת טופס עדכון
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedEvent = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value,
    startTime: document.getElementById('startTime').value,
    city: document.getElementById('city').value,
    streetName: document.getElementById('streetName').value,
    streetNumber: document.getElementById('streetNumber').value,
    handsNeeded: document.getElementById('handsNeeded').value,
    category: document.getElementById('category').value,
    contactPhone: document.getElementById('contactPhone').value,
    contactEmail: document.getElementById('contactEmail').value,
    description: document.getElementById('description').value,
  };

  try {
    await updateEvent(eventId, updatedEvent);
    alert("Event updated successfully!");
    window.location.href = '/Pages/Organizer/homePage.html';
  } catch (err) {
    console.error('Error updating event:', err);
    alert('Failed to update event.');
  }
});