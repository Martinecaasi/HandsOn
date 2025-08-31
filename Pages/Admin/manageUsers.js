import { 
  getAllVolunteers, deleteVolunteer 
} from "../../Api/volunteersApi.js";

import { 
  getAllOrganizations, deleteOrganization 
} from "../../Api/organizationsApi.js";

const volunteersTBody = document.getElementById('volunteersTableBody');
const orgsTBody = document.getElementById('orgsTableBody');

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();

  // Delete Volunteer
  volunteersTBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete');
    if (!btn) return;
    const id = btn.dataset.id;

    if (!id) return;
    if (!confirm('Delete this volunteer?')) return;

    btn.disabled = true;
    try {
      await deleteVolunteer(id);
      btn.closest('tr')?.remove();
    } catch (err) {
      console.error('Failed to delete volunteer:', err);
      alert('Delete failed for volunteer.');
    } finally {
      btn.disabled = false;
    }
  });

  // Delete Organization
  orgsTBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete');
    if (!btn) return;
    const id = btn.dataset.id;

    if (!id) return;
    if (!confirm('Delete this organization?')) return;

    btn.disabled = true;
    try {
      await deleteOrganization(id);
      btn.closest('tr')?.remove();
    } catch (err) {
      console.error('Failed to delete organization:', err);
      alert('Delete failed for organization.');
    } finally {
      btn.disabled = false;
    }
  });

  // Edit buttons (event delegation)
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const type = editBtn.dataset.type; // volunteer / organization
      window.location.href = `/Pages/Admin/editUser.html?id=${id}&type=${type}`;
    }
  });
});

async function loadUsers() {
  try {
    const [volunteers, organizations] = await Promise.all([
      getAllVolunteers(),
      getAllOrganizations()
    ]);

    renderVolunteers(volunteers || []);
    renderOrganizations(organizations || []);
  } catch (error) {
    console.error('Error loading users:', error);
    volunteersTBody.innerHTML = '<tr><td colspan="3">Failed to load volunteers</td></tr>';
    orgsTBody.innerHTML = '<tr><td colspan="3">Failed to load organizations</td></tr>';
  }
}

function renderVolunteers(volunteers) {
  volunteersTBody.innerHTML = '';
  if (!volunteers.length) {
    volunteersTBody.innerHTML = '<tr><td colspan="3">No volunteers</td></tr>';
    return;
  }

  volunteers.forEach(v => {
    const id = v._id || v.id || v.user_id;
    const name = v.fullName || `${v.user_firstName || ''} ${v.user_lstName || ''}`.trim();
    const email = v.email || '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>
        <button type="button" class="btn-edit" data-id="${id}" data-type="volunteer">✏️ Edit</button>
        <button type="button" class="btn-delete" data-id="${id}">🗑️ Delete</button>
      </td>
    `;
    volunteersTBody.appendChild(tr);
  });
}

function renderOrganizations(orgs) {
  orgsTBody.innerHTML = '';
  if (!orgs.length) {
    orgsTBody.innerHTML = '<tr><td colspan="3">No organizations</td></tr>';
    return;
  }

  orgs.forEach(o => {
    const id = o._id || o.id || o.user_id;
    const name = o.organizationName || '';
    const email = o.email || '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>
        <button type="button" class="btn-edit" data-id="${id}" data-type="organization">✏️ Edit</button>
        <button class="btn-delete" data-id="${id}">🗑️ Delete</button>
      </td>
    `;
    orgsTBody.appendChild(tr);
  });
}