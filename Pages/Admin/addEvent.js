import { createEvent } from "../../Api/eventsApi.js";

const form = document.getElementById('eventForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const eventData = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value,
    time: document.getElementById('startTime').value,
    city: document.getElementById('city').value,
    street: document.getElementById('streetName').value,
    buildingNumber: document.getElementById('streetNumber').value,
    contactPhone: document.getElementById('contactPhone').value,
    contactEmail: document.getElementById('contactEmail').value,
    description: document.getElementById('description').value,
    createdByModel: "Admin"
  };

  try {
    await createEvent(eventData);
    alert("Event added successfully!");
    window.location.href = '/Pages/Admin/manageEvents.html';
  } catch (err) {
    console.error('Error creating event:', err);
    alert("Failed to create event.");
  }
});