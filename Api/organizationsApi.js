const API_BASE = 'https://handsonserver-new.onrender.com/api/organizations';

// בדיקה שה־API זמין
export async function testOrganization() {
  const res = await fetch(`${API_BASE}/test`);
  return res.text();
}

// רישום ארגון חדש
export async function registerOrganization(formData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) throw new Error('Failed to register organization');
  return res.json();
}

// התחברות ארגון
export async function loginOrganization(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

// שליפת כל הארגונים
export async function getAllOrganizations() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch organizations');
  return res.json();
}

// עדכון ארגון לפי ID
export async function updateOrganization(id, updatedData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update organization');
  return res.json();
}

// מחיקת ארגון לפי ID
export async function deleteOrganization(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete organization');
  return res.json();
}
