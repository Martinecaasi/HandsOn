const form = document.querySelector('.signup-form');
const imageInput = document.getElementById('orgImageInput');
const imagePreview = document.getElementById('orgAvatarPreview');

// תצוגה מקדימה של תמונה
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('organizationName', document.getElementById('orgName').value.trim());
  formData.append('email', document.getElementById('email').value.trim().toLowerCase());
  formData.append('password', document.getElementById('password').value);
  formData.append('phoneNumber', document.getElementById('phone').value.trim());
  formData.append('streetName', document.getElementById('streetName').value.trim());
  formData.append('streetNumber', Number(document.getElementById('streetNumber').value));
  formData.append('apartmentNumber', document.getElementById('apartmentNumber').value.trim());
  formData.append('apartmentFloor', document.getElementById('apartmentFloor').value.trim());
  formData.append('city', document.getElementById('citySelect').value);
  formData.append('about', document.getElementById('about').value.trim());

  if (imageInput.files.length > 0) {
    formData.append('profileImage', imageInput.files[0]);
  }

  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/organizations/register', {
      method: 'POST',
      body: formData
    });

    const text = await res.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(`Server returned non-JSON error: ${text}`);
    }

    if (!res.ok) {
      throw new Error(result.message || `Error ${res.status}`);
    }

    localStorage.setItem('loggedInUser', JSON.stringify(result.organization));
    window.location.href = '/pages/Organizer/homePage.html';

  } catch (err) {
    console.error('שגיאה ברישום:', err);
    alert(`אירעה שגיאה: ${err.message}`);
  }
});