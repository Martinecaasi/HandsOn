import { getAllEvents, deleteEvent } from "../../Api/eventsApi.js";

const eventsTBody = document.getElementById('eventTableBody');

document.addEventListener('DOMContentLoaded', loadEvents);

async function loadEvents() {
  try {
    const events = await getAllEvents();
    renderEvents(events);
  } catch (error) {
    console.error('Error loading events:', error);
    eventsTBody.innerHTML = '<tr><td colspan="5">Failed to load events</td></tr>';
  }
}

function renderEvents(events) {
  eventsTBody.innerHTML = '';
  if (!events || !events.length) {
    eventsTBody.innerHTML = '<tr><td colspan="5">No events found</td></tr>';
    return;
  }

  events.forEach(event => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${event.title || ''}</td>
      <td>${event.date || ''} ${event.time || ''}</td>
      <td>${event.city || ''}</td>
      <td>${event.createdBy?.organizationName || 'Unknown'}</td>
      <td>
        <button class="btn-edit" onclick="window.location.href='/Pages/Admin/editEvent.html?id=${event._id}'">✏️ Edit</button>
        <button class="btn-delete" data-id="${event._id}">🗑️ Delete</button>
      </td>
    `;
    eventsTBody.appendChild(tr);

    tr.querySelector('.btn-delete').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this event?')) {
        try {
          await deleteEvent(event._id);
          tr.remove();
        } catch (err) {
          alert('Failed to delete event.');
        }
      }
    });
  });
}