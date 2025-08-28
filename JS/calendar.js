// Organizer Calendar – list all events on selected day with full details

document.addEventListener('DOMContentLoaded', initCalendar);

async function initCalendar(){
  const calendar = document.getElementById("calendar");
  const selectedDateEl = document.getElementById("selectedDate");
  const dayEventsPanel = document.getElementById("dayEventsPanel");

  // --- Auth check ---
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

  // Month context
  const today = new Date();
  const month = today.getMonth();
  const year  = today.getFullYear();

  const toDateKey = (dLike) => {
    const d = new Date(dLike);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  };

  // Fetch & group by date
  let eventsByDate = {};
  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/events');
    const allEvents = await res.json();
    const myEvents = allEvents.filter(ev => ev?.createdBy?._id === organizer._id);
    myEvents.forEach(ev => {
      const key = toDateKey(ev.date);
      (eventsByDate[key] ??= []).push(ev);
    });
  } catch (e) {
    console.error('Error fetching events:', e);
    dayEventsPanel.hidden = false;
    dayEventsPanel.innerHTML = `<p class="date-title" style="color:#c00">Error loading events.</p>`;
  }

  renderCalendarGrid(calendar, year, month, eventsByDate, onDayClick);

  // ==== helpers ====

  function renderCalendarGrid(container, year, month, eventsMap, onClick){
    container.innerHTML = '';

    const weekDays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    weekDays.forEach(d => {
      const h = document.createElement('div');
      h.textContent = d;
      h.className = 'weekday-cell';
      container.appendChild(h);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < (firstDay + 6) % 7; i++) {
      const pad = document.createElement('div');
      pad.className = 'pad-cell';
      container.appendChild(pad);
    }

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

  function onDayClick(dateKey, d, m, y){
    document.querySelectorAll('#calendar .day').forEach(el => el.classList.remove('selected'));
    const cell = Array.from(document.querySelectorAll('#calendar .day'))
      .find(c => Number(c.textContent) === d);
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
        </div>`;
      return;
    }

    dayEventsPanel.innerHTML = `
      <p class="date-title">On This Date: ${readable}</p>
      ${list.map(ev => eventCardHTML(ev)).join('')}
    `;

    // pass full descriptions for show more/less
    list.forEach((ev, i) => {
      const card   = dayEventsPanel.querySelectorAll('.event-card')[i];
      const toggle = card?.querySelector('.toggle-more');
      const desc   = (ev.description || ev.about || ev.details || ev.summary || '').toString();
      if (toggle) toggle.dataset.desc = desc;
      card.__desc = desc;
    });
    hydrateDescriptions(dayEventsPanel);
  }

  // ----- flexible field getters -----
  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
  }
  function pick(ev, paths, {joinArr = ', '} = {}) {
    for (const p of paths) {
      const v = p.includes('.') ? getPath(ev, p) : ev[p];
      if (v == null) continue;
      if (Array.isArray(v) && v.length) return v.join(joinArr);
      if (typeof v === 'string' && v.trim() !== '') return v.trim();
      if (typeof v === 'number') return v;
    }
    return '';
  }
  function fmtTime(ev) {
    const direct = pick(ev, ['time','startTime','start_time']);
    if (direct) return direct;
    const dStr = pick(ev, ['date','startDate','start_date']);
    const d = dStr ? new Date(dStr) : null;
    if (d && !isNaN(d)) {
      const hh = String(d.getHours()).padStart(2,'0');
      const mm = String(d.getMinutes()).padStart(2,'0');
      if (hh !== '00' || mm !== '00') return `${hh}:${mm}`;
    }
    return '';
  }

  function eventCardHTML(ev){
    const title = pick(ev, ['title','name']) || 'Untitled Event';
    const time  = fmtTime(ev);
    const locationName = pick(ev, ['location.name','venue','place']);
    const city  = pick(ev, ['city','location.city','address.city','location']);
    const address = pick(ev, ['address.full','address','location.address','street']);
    const participants = Array.isArray(ev.participants) ? ev.participants.length
                       : (pick(ev, ['participantsCount','participants_count']) || 0);
    const maxParticipants = pick(ev, ['maxParticipants','capacity']);
    const desc = pick(ev, ['description','about','details','summary','body']);

    const lines = [];
    if (city || address || locationName) {
      const locParts = [locationName, city, address].filter(Boolean);
      lines.push(`<p class="event-line"><strong>Location:</strong> ${locParts.join(' – ')}</p>`);
    }
    lines.push(`<p class="event-line"><strong>Participants:</strong> ${participants}${maxParticipants ? ` / ${maxParticipants}` : ''}</p>`);

    return `
      <div class="event-card">
        <p class="event-title">✔️ ${title}${time ? ` • ${time}` : ''}</p>
        ${lines.join('')}
        ${desc ? `
          <div class="event-desc">
            <span class="desc-short"></span>
            <span class="desc-full" hidden></span>
            <button class="toggle-more" type="button" aria-expanded="false">Show more</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function hydrateDescriptions(container){
    container.querySelectorAll('.event-card').forEach((card) => {
      const toggle = card.querySelector('.toggle-more');
      const shortEl = card.querySelector('.desc-short');
      const fullEl  = card.querySelector('.desc-full');

      const text = (toggle?.dataset?.desc || card.__desc || '').toString();
      if (!text) { toggle?.remove(); return; }

      const LIMIT = 220;
      const safeText = text.replace(/\r\n/g, '\n');
      const shortText = safeText.length > LIMIT ? safeText.slice(0, LIMIT) + '…' : safeText;

      shortEl.textContent = shortText;
      fullEl.textContent  = safeText;

      if (safeText.length <= LIMIT) {
        toggle.remove();
        fullEl.hidden = false;
        shortEl.hidden = true;
      } else {
        toggle.addEventListener('click', () => {
          const expanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!expanded));
          if (!expanded) {
            shortEl.hidden = true;
            fullEl.hidden = false;
            toggle.textContent = 'Show less';
          } else {
            shortEl.hidden = false;
            fullEl.hidden = true;
            toggle.textContent = 'Show more';
          }
        });
      }
    });
  }
}
