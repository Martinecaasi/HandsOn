//טעינת פרטי הארגון והצגת טופס עדכון
const form = document.getElementById('editOrgForm');
const imageInput = document.getElementById('orgImageInput');
const imagePreview = document.getElementById('orgAvatarPreview');

//שליפת הארגון המחובר מה-localStorage
const org = JSON.parse(localStorage.getItem('loggedInUser'));
if (!org || !org._id) {
  alert('No organization is currently logged in');
  window.location.href = '/pages/Organizer/loginOrg.html'; // התאימי לנתיב שלך
}

//מילוי נתונים קיימים בטופס
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('orgName').value = org.name || '';
  document.getElementById('speciality').value = org.speciality || '';
  document.getElementById('phone').value = org.phoneNumber || '';
  document.getElementById('email').value = org.email || '';
  document.getElementById('handsNeeded').value = org.handsNeeded || '';
  document.getElementById('streetName').value = org.streetName || '';
  document.getElementById('streetNumber').value = org.streetNumber || '';
  document.getElementById('apartmentNumber').value = org.apartmentNumber || '';
  document.getElementById('apartmentFloor').value = org.apartmentFloor || '';
  document.getElementById('citySelect').value = org.city || '';
  document.getElementById('aboutOrg').value = org.about || '';
  if (org.profileImage) {
    imagePreview.src = org.profileImage;
  }
});

// תצוגה מקדימה לתמונה חדשה
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  }
});

//שליחת טופס עדכון
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('orgName').value);
  formData.append('speciality', document.getElementById('speciality').value);
  formData.append('phoneNumber', document.getElementById('phone').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('handsNeeded', document.getElementById('handsNeeded').value);
  formData.append('streetName', document.getElementById('streetName').value);
  formData.append('streetNumber', document.getElementById('streetNumber').value);
  formData.append('apartmentNumber', document.getElementById('apartmentNumber').value);
  formData.append('apartmentFloor', document.getElementById('apartmentFloor').value);
  formData.append('city', document.getElementById('citySelect').value);
  formData.append('about', document.getElementById('aboutOrg').value);
  if (imageInput.files.length > 0) {
    formData.append('profileImage', imageInput.files[0]);
  }

  try {
    const res = await fetch(`https://handsonserver-new.onrender.com/api/organizations/${org._id}`, {
      method: 'PUT',
      body: formData
    });

    if (!res.ok) throw new Error('Failed to update organization');

    const updated = await res.json();

    // עדכון localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(updated.organization));

    alert('הפרופיל עודכן בהצלחה!');
    window.location.href = '/pages/Organizer/orgHome.html';
  } catch (err) {
    console.error('שגיאה בעדכון הארגון:', err);
    alert(`אירעה שגיאה: ${err.message}`);
  }
});