import { createVolunteer } from "../../Api/volunteersApi.js";
import { createOrganization } from "../../Api/organizationsApi.js";

const form = document.getElementById('userForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userType = document.getElementById('userType').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    if (userType === 'volunteer') {
      await createVolunteer({ fullName: name, email, password });
    } else if (userType === 'organization') {
      await createOrganization({ organizationName: name, email, password });
    }

    alert("User added successfully!");
    window.location.href = '/Pages/Admin/manageUsers.html';
  } catch (err) {
    console.error('Error creating user:', err);
    alert("Failed to create user.");
  }
});
