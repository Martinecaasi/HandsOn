import { getAllVolunteers, deleteVolunteer } from "../../Api/volunteersApi.js";
import { getAllOrganizations, deleteOrganization } from "../../Api/organizationsApi.js";

const volunteersTBody = document.getElementById('volunteersTableBody');
const orgsTBody = document.getElementById('orgsTableBody');

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    // האזנת קליקים באמצעות האצלת אירועים (Event Delegation)
    volunteersTBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-delete');
        if (!btn) return;
        const id = btn.dataset.id;
        console.log('volunteer id:', id, v);
        console.log('Clicked delete', id);
        e.preventDefault(); // גם זה עוזר למנוע רענון
        e.stopPropagation();

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
        volunteersTBody.innerHTML = '<tr><td colspan="4">Failed to load volunteers</td></tr>';
        orgsTBody.innerHTML = '<tr><td colspan="4">Failed to load organizations</td></tr>';
    }
}

function renderVolunteers(volunteers) {
    volunteersTBody.innerHTML = '';
    if (!volunteers.length) {
        volunteersTBody.innerHTML = '<tr><td colspan="4">No volunteers</td></tr>';
        return;
    }
    volunteers.forEach(v => {
        const id = v._id || v.id || v.user_id;
        console.log('volunteer id:', id, v);
        const name = v.fullName || `${v.user_firstName || ''} ${v.user_lstName || ''}`.trim();
        const email = v.email || v.user_email || '';
        const password = v.password || v.user_password || '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${password}</td>
      <td>
       <button type="button" class="btn-delete" data-id="${id}">Delete</button>
      </td>
    `;
        volunteersTBody.appendChild(tr);
    });
}

function renderOrganizations(orgs) {
    orgsTBody.innerHTML = '';
    if (!orgs.length) {
        orgsTBody.innerHTML = '<tr><td colspan="4">No organizations</td></tr>';
        return;
    }
    orgs.forEach(o => {
        const id = o._id || o.id || o.user_id;
        const name = o.organizationName || `${o.user_firstName || ''} ${o.user_lstName || ''}`.trim();
        const email = o.email || o.user_email || '';
        const password = o.password || o.user_password || '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${password}</td>
      <td>
        <button class="btn-delete" data-id="${id}" aria-label="Delete organization">Delete</button>
      </td>
    `;
        orgsTBody.appendChild(tr);
    });
}
