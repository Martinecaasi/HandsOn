const API_BASE = "https://handsonserver-new.onrender.com/api/events";

// 1. שליפת כל האירועים
export async function getAllEvents() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

// 2. שליפת אירוע לפי מזהה
export async function getEventById(eventId) {
  const res = await fetch(`${API_BASE}/${eventId}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}

// 3. יצירת אירוע חדש
export async function createEvent(eventData) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(eventData)
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

// 4. עדכון אירוע
export async function updateEvent(eventId, updatedData) {
  const res = await fetch(`${API_BASE}/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

// 5. מחיקת אירוע
export async function deleteEvent(eventId) {
  const res = await fetch(`${API_BASE}/${eventId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
}

// 6. הצטרפות לאירוע
export async function joinEvent(eventId, userId) {
  const res = await fetch(`${API_BASE}/${eventId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error("Failed to join event");
  return res.json();
}

// 7. יציאה מאירוע
export async function leaveEvent(eventId, userId) {
  const res = await fetch(`${API_BASE}/${eventId}/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error("Failed to leave event");
  return res.json();
}

// 8. שליפת משתתפים לאירוע
export async function getParticipants(eventId) {
  const res = await fetch(`${API_BASE}/${eventId}/participants`);
  if (!res.ok) throw new Error("Failed to fetch participants");
  return res.json();
}

// 9. שליפת כל האירועים שמשתמש נרשם אליהם
export async function getRegisteredEvents(userId) {
  const res = await fetch(`${API_BASE}/registered/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch registered events");
  return res.json();
}
