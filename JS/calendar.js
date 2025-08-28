document.addEventListener('DOMContentLoaded', initCalendar);

async function initCalendar(){
  const calendar = document.getElementById("calendar");
  const selectedDateEl = document.getElementById("selectedDate");
  const dayEventsPanel = document.getElementById("dayEventsPanel");

  // --- אימות משתמש ---
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userRole = localStorage.getItem('userRole');

  if (!loggedInUser || userRole !== 'organizer') {
    window.location.href = '/Pages/login.html';
    return;
  }

  const organizer = JSON.parse(loggedInUser);
  if (!organizer?._id) {
    dayEventsPanel.hidden = false;
    dayEventsPanel.innerHTML = `<p class="date-title" style="color:#c00">You must be logged in as an organization.</p>`;
    return;
  }

  // --- נתוני חודש נוכחי ---
  const today = new Date();
  const month = today.getMonth(); // 0-11
  const year  = today.getFullYear();

  // עוזר: המרה ל־YYYY-MM-DD (לפי local time)
  const toDateKey = (dateLike) => {
    const d = new Date(dateLike);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  // --- שליפת אירועים וקיבוץ לפי תאריך ---
  let eventsByDate = {};
  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/events');
    const allEvents = await res.json();

    const myEvents = allEvents.filter(ev => ev?.createdBy?._id === organizer._id);

    myEvents.forEach(ev => {
      const key = toDateKey(ev.date);       // מניחים ששדה date קיים
      (eventsByDate[key] ??= []).push(ev);  // קיבוץ לפי תאריך
    });
  } catch (e) {
    console.error('Error fetching events:', e);
    dayEventsPanel.hidden = false;
    dayEventsPanel.innerHTML = `<p class="date-title" style="color:#c00">Error loading events.</p>`;
  }

  // --- רינדור לוח החודש ---
  renderCalendarGrid(calendar, year, month, eventsByDate, onDayClick);

  // ===== פונקציות עזר =====

  // רינדור רשת הימים
  function renderCalendarGrid(container, year, month, eventsMap, onClick){
    container.innerHTML = '';

    // ימי השבוע
    const weekDays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    weekDays.forEach(d => {
      const h = document.createElement('div');
      h.textContent = d;
      h.className = 'weekday-cell';
      container.appendChild(h);
    });

    // חישובי תחילת חודש
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // ריפוד לפני היום הראשון
    for (let i = 0; i < (firstDay + 6) % 7; i++) {
      const pad = document.createElement('div');
      pad.className = 'pad-cell';
      container.appendChild(pad);
    }

    // יצירת תאי ימים
    for (let day = 1; day <= daysInMonth; day++){
      const cell = document.createElement('div');
      cell.className = 'day';
      cell.textContent = day;

      const key = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      if (eventsMap[key]?.length) cell.classList.add('has-events');

      cell.addEventListener('click', () => onClick(key, day, month, year));
      container.appendChild(cell);
    }
  }

  // בעת לחיצה על יום – מציג רשימת אירועים של אותו תאריך
  function onDayClick(dateKey, d, m, y){
    // סימון בחירה
    document.querySelectorAll('#calendar .day').forEach(el => el.classList.remove('selected'));
    const cells = Array.from(document.querySelectorAll('#calendar .day'));
    const cell = cells.find(c => Number(c.textContent) === d);
    if (cell) cell.classList.add('selected');

    const readable = `${String(d).padStart(2,'0')}/${String(m+1).padStart(2,'0')}/${y}`;
    if (selectedDateEl) selectedDateEl.textContent = readable;

    const list = eventsByDate[dateKey] ?? [];

    dayEventsPanel.hidden = false;

    if (!list.length){
      dayEventsPanel.innerHTML = `
        <p class="date-title">On This Date: ${readable}</p>
        <div class="event-card">
          <p class="event-title">No events</p>
          <p class="event-line muted">You have zero events on this date.</p>
        </div>
      `;
      return;
    }

    // בניית כרטיסים
    dayEventsPanel.innerHTML = `
      <p class="date-title">On This Date: ${readable}</p>
      ${list.map(ev => eventCardHTML(ev)).join('')}
    `;
  }

  // כרטיס אירוע בודד – שם, שעה, מיקום, משתתפים, תיאור קצר
  function eventCardHTML(ev){
    const title = ev.title || 'Untitled Event';
    const time  = ev.time  || '';                       // אם יש שדה time
    const city  = ev.city  || ev.location || '';        // לפי הסכמה שלך
    const desc  = (ev.description || ev.about || '').toString().trim();
    const participants = Array.isArray(ev.participants) ? ev.participants.length : 0;

    const shortDesc = desc.length > 160 ? desc.slice(0,160) + '…' : desc;

    return `
      <div class="event-card">
        <p class="event-title">✔️ ${title}${time ? ` • ${time}` : ''}</p>
        ${city ? `<p class="event-line"><strong>Location:</strong> ${city}</p>` : ''}
        <p class="event-line"><strong>Participants:</strong> ${participants}</p>
        ${shortDesc ? `<p class="event-line muted">${shortDesc}</p>` : ''}
      </div>
    `;
  }
}