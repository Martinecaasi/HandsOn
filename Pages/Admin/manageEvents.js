import { getAllEvents, getOrganizationById } from "../../Api/eventsApi.js";

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

async function renderEvents(events) {
  eventsTBody.innerHTML = '';

  if (!events || !events.length) {
    eventsTBody.innerHTML = '<tr><td colspan="5">No events found</td></tr>';
    return;
  }

  for (const event of events) {
    const tr = document.createElement('tr');
    let creatorName = '';

    try {
      const orgData = await getOrganizationById(event.createdBy);
      creatorName = orgData.name || orgData.organization_name || 'Organization';
    } catch (err) {
      console.error('Error fetching organization:', err);
      creatorName = 'Unknown';
    }

    tr.innerHTML = `
      <td>${event.title || ''}</td>
      <td>${event.date || ''} ${event.time || ''}</td>
      <td>${event.city || ''}</td>
      <td>${creatorName}</td>
      <td><button class="btn-delete" data-id="${event._id}">Delete</button></td>
    `;
    eventsTBody.appendChild(tr);
  }
}
