import { getAllVolunteers } from "../../Api/volunteersApi.js";
import { getAllOrganizations } from "../../Api/organizationsApi.js";

const volunteersTBody = document.getElementById('volunteersTableBody');
const orgsTBody = document.getElementById('orgsTableBody');

document.addEventListener('DOMContentLoaded', loadUsers);
async function loadUsers() {
  try {
    const volunteers = await getAllVolunteers();
    const organizations = await getAllOrganizations();

    renderVolunteers(volunteers);
    renderOrganizations(organizations);
  } catch (error) {
    console.error('Error loading users:', error);
    volunteersTBody.innerHTML = '<tr><td colspan="3">Failed to load volunteers</td></tr>';
    orgsTBody.innerHTML = '<tr><td colspan="3">Failed to load organizations</td></tr>';
  }
}

function renderVolunteers(volunteers) {
  volunteersTBody.innerHTML = '';
  volunteers.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.fullName || ''} ${v.user_lstName || ''}</td>
      <td>${v.email || ''}</td>
      <td>${v.password || ''}</td>
    `;
    volunteersTBody.appendChild(tr);
  });
}

function renderOrganizations(orgs) {
  orgsTBody.innerHTML = '';
  orgs.forEach(o => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${o.organizationName || ''} ${o.user_lstName || ''}</td>
      <td>${o.email || ''}</td>
      <td>${o.password || ''}</td>
    `;
    orgsTBody.appendChild(tr);
  });
}