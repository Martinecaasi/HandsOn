document.addEventListener('DOMContentLoaded', async () => {
  // אימות הרשאות
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userRole = localStorage.getItem('userRole');

  if (!loggedInUser || userRole !== 'organizer') {
    window.location.href = '/Pages/login.html';
    return;
  }

  const organizer = JSON.parse(loggedInUser);
  const titleEl = document.querySelector('.title');
  const eventsContainer = document.getElementById('eventsContainer');

  // כותרת דו-שורתית: Welcome, <שם>  +  Upcoming Events
  const nameToShow = organizer.fullName || organizer.name || organizer.organizationName || 'Organizer';
  if (titleEl) {
    titleEl.innerHTML = `
      <span class="welcome-line">Welcome, ${nameToShow}</span><br>
      <span class="subtitle-line">Upcoming Events</span>
    `;
  }

  if (!organizer._id) {
    eventsContainer.innerHTML = `<p style="text-align:center;margin-top:40px;">You must be logged in as an organization.</p>`;
    return;
  }

  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/events');
    const allEvents = await res.json();

    // אירועים שנוצרו ע"י הארגון
    const orgEvents = allEvents.filter(e => e.createdBy?._id === organizer._id);

    if (!orgEvents.length) {
      eventsContainer.innerHTML = `
        <p style="text-align:center;margin-top:40px;color:#777;">
          You haven't created any events yet.
        </p>`;
      return;
    }

    // בניית כרטיסים בסגנון המוקטאפ
    eventsContainer.innerHTML = ''; // ניקוי
    orgEvents.forEach(e => {
      const count = Array.isArray(e.participants) ? e.participants.length : 0;
      const card = document.createElement('div');
      card.className = 'event-pill';
      card.innerHTML = `
        <p class="event-title">${e.title || 'Untitled Event'}</p>
        <p class="event-participants">Total Participants: ${count}</p>
      `;
      eventsContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    eventsContainer.innerHTML = "<p style='text-align:center;color:#c00;'>Error loading events.</p>";
  }
});
