import { getAllVolunteers } from "../../Api/volunteersApi.js";
import { getAllOrganizations} from "../../Api/organizationsApi.js";

const tableBody = document.getElementById('eventTableBody');

async function loadUsers() {
  try {
    const [volunteers, organizations] = await Promise.all([
      getAllVolunteers(),
      getAllOrganizations()
    ]);

    const allUsers = [
      ...volunteers.map(user => ({ ...user, role: 'Volunteer' })),
      ...organizations.map(user => ({ ...user, role: 'Organization' }))
    ];

    renderUsers(allUsers);
  } catch (error) {
    console.error('Error loading users:', error);
    tableBody.innerHTML = '<tr><td colspan="4">Failed to load users</td></tr>';
  }
}

function renderUsers(users) {
  tableBody.innerHTML = ''; 

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.user_firstName || ''} ${user.user_lstName || ''}</td>
      <td>${user.user_email || ''}</td>
      <td>${user.user_password || ''}</td>
      <td>${user.role}</td>
    `;
    tableBody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', loadUsers);