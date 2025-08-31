import { getEventById, updateEvent } from "../../Api/eventsApi.js";

const form = document.getElementById('editEventForm');
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const event = await getEventById(eventId);
    document.getElementById('title').value = event.title || '';
    document.getElementById('date').value = event.date?.slice(0, 10) || '';
    document.getElementById('startTime').value = event.time || '';
    document.getElementById('city').value = event.city || '';
    document.getElementById('streetName').value = event.street || '';
    document.getElementById('streetNumber').value = event.buildingNumber || '';
    document.getElementById('contactPhone').value = event.contactPhone || '';
    document.getElementById('contactEmail').value = event.contactEmail || '';
    document.getElementById('description').value = event.description || '';
  } catch (err) {
    console.error('Error loading event:', err);
    alert('Failed to load event.');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedEvent = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value,
    time: document.getElementById('startTime').value,
    city: document.getElementById('city').value,
    street: document.getElementById('streetName').value,
    buildingNumber: document.getElementById('streetNumber').value,
    contactPhone: document.getElementById('contactPhone').value,
    contactEmail: document.getElementById('contactEmail').value,
    description: document.getElementById('description').value,
  };

  try {
    await updateEvent(eventId, updatedEvent);
    alert("Event updated successfully!");
    window.location.href = '/Pages/Admin/manageEvents.html';
  } catch (err) {
    console.error('Error updating event:', err);
    alert('Failed to update event.');
  }
});
