import { getAllEvents} from "../../Api/eventsApi.js"; 
const eventsTBody = document.getElementById('eventsTableBody');

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