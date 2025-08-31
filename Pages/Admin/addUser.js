import { registerVolunteer } from "../../Api/volunteersApi.js";
import { registerOrganization } from "../../Api/organizationsApi.js";

const form = document.getElementById('userForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userType = document.getElementById('userType').value;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!userType || !name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (userType !== 'volunteer' && userType !== 'organization') {
      alert("Invalid user type.");
      return;
    }

    try {
      if (userType === 'volunteer') {
        await registerVolunteer({ fullName: name, email, password });
      } else {
        await registerOrganization({ organizationName: name, email, password });
      }

      alert("User added successfully!");
      window.location.href = '/Pages/Admin/manageUsers.html';
    } catch (err) {
      console.error('Error creating user:', err);
      alert("Failed to create user.");
    }
  });
} else {
  console.error("User form not found on page.");
}