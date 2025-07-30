const API_BASE = 'http://localhost:5000/api/volunteers';

// בדיקה שה-API זמין
export async function testVolunteer() {
  const res = await fetch(`${API_BASE}/test`);
  return res.text();
}

// רישום מתנדב חדש
export async function registerVolunteer(volunteerData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(volunteerData)
  });
  if (!res.ok) throw new Error('Failed to register volunteer');
  return res.json();
}

// התחברות מתנדב
export async function loginVolunteer(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

// שליפת כל המתנדבים
export async function getAllVolunteers() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch volunteers');
  return res.json();
}

// שליפת מתנדב לפי ID
export async function getVolunteerById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch volunteer');
  return res.json();
}

// עדכון מתנדב
export async function updateVolunteer(id, updatedData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update volunteer');
  return res.json();
}

// מחיקת מתנדב
export async function deleteVolunteer(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete volunteer');
  return res.json();
}