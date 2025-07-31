const API_BASE = 'https://handsonserver-new.onrender.com/api/admins';

// בדיקה
export async function testAdmin() {
  const res = await fetch(`${API_BASE}/test`);
  return res.text();
}

// רישום אדמין חדש
export async function registerAdmin(adminData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adminData)
  });
  if (!res.ok) throw new Error('Failed to register admin');
  return res.json();
}

// התחברות אדמין
export async function loginAdmin(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

// קבלת כל האדמינים
export async function getAllAdmins() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch admins');
  return res.json();
}

// עדכון אדמין לפי ID
export async function updateAdmin(id, updatedData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update admin');
  return res.json();
}

// מחיקת אדמין לפי ID
export async function deleteAdmin(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete admin');
  return res.json();
}
