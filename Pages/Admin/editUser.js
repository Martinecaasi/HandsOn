import { getVolunteerById, updateVolunteer } from "../../Api/volunteersApi.js";
import { getOrganizationById, updateOrganization } from "../../Api/organizationsApi.js";

const form = document.getElementById('editUserForm');
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
const userType = urlParams.get('type'); // volunteer / organization

window.addEventListener('DOMContentLoaded', async () => {
  try {
    let user;
    if (userType === 'volunteer') {
      user = await getVolunteerById(userId);
      document.getElementById('name').value = user.fullName || '';
    } else {
      user = await getOrganizationById(userId);
      document.getElementById('name').value = user.organizationName || '';
    }
    document.getElementById('email').value = user.email || '';
  } catch (err) {
    console.error('Error loading user:', err);
    alert('Failed to load user.');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    if (userType === 'volunteer') {
      await updateVolunteer(userId, { fullName: name, email, password });
    } else {
      await updateOrganization(userId, { organizationName: name, email, password });
    }
    alert("User updated successfully!");
    window.location.href = '/Pages/Admin/manageUsers.html';
  } catch (err) {
    console.error('Error updating user:', err);
    alert('Failed to update user.');
  }
});
