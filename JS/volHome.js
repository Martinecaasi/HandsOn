document.addEventListener('DOMContentLoaded', async () => {
  const eventList = document.querySelector('.event-list');
  const searchInput = document.getElementById('searchInput');
  const API = 'https://handsonserver-new.onrender.com/api/events';

  let allEvents = [];  
  let debouncer = null;

  // פונקציית עזר: פורמט תאריך
  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB');
    } catch {
      return '';
    }
  };

  const buildLocation = (ev) => {
    const city = ev.city || '';
    const street = ev.street || ev.streetName || '';
    const num = ev.buildingNumber || ev.streetNumber || '';
    const streetFull = [street, num].filter(Boolean).join(' ');
    return [city, streetFull].filter(Boolean).join(', ');
  };

  // רינדור כרטיסים לרשימה
  const renderEvents = (events) => {
    eventList.innerHTML = '';

    if (!events || events.length === 0) {
      eventList.innerHTML = '<p>No matching events found.</p>';
      return;
    }

    events.forEach(ev => {
      const dateStr = fmtDate(ev.date);
      const timeStr = ev.time || '';
      const locStr  = buildLocation(ev);

      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <p><strong>Title:</strong> ${ev.title || ''}</p>
        <p><strong>Date & Time:</strong> ${dateStr}${timeStr ? ' | ' + timeStr : ''}</p>
        <p><strong>Location:</strong> ${locStr}</p>
        <p class="more">
          <a href="/pages/volunteer/eventPage.html?id=${ev._id}">click Here For More</a>
        </p>
      `;
      eventList.appendChild(card);
    });
  };

  // סינון לפי שאילתה חופשית (כותרת/עיר/רחוב/תיאור/תאריך)
  const applySearch = () => {
    const q = (searchInput?.value || '').trim().toLowerCase();

    if (!q) {
      renderEvents(allEvents);
      return;
    }

    const filtered = allEvents.filter(ev => {
      const haystack = [
        ev.title,
        ev.city,
        ev.street,
        ev.streetName,
        ev.description,
        fmtDate(ev.date)
      ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

      return haystack.includes(q);
    });

    renderEvents(filtered);
  };

  // שליפת אירועים מהשרת + רינדור ראשוני
  try {
    const res = await fetch(API);
    const data = await res.json();

    if (!Array.isArray(data)) {
      eventList.innerHTML = '<p>No events found.</p>';
      return;
    }

    allEvents = data;
    renderEvents(allEvents);
  } catch (err) {
    console.error('Error fetching events:', err);
    eventList.innerHTML = '<p>There was an error loading events.</p>';
  }

  // חיפוש בזמן אמת עם debounce עדין
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debouncer);
      debouncer = setTimeout(applySearch, 120);
    });
  }

  // לחיצה על אייקון החיפוש → פוקוס לשדה
  const searchIcon = document.querySelector('.filter-container img[alt="Search"]');
  if (searchIcon && searchInput) {
    searchIcon.addEventListener('click', () => searchInput.focus());
  }
});
