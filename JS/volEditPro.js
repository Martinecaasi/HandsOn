document.addEventListener('DOMContentLoaded', function () {
  const volunteerId = localStorage.getItem('volunteerId');

  if (!volunteerId) {
    alert("Volunteer ID not found. Please login again.");
    window.location.href = '/pages/login.html';
    return;
  }

  const form = document.querySelector('.signup-form');
  const nameInput = form.querySelector('input[placeholder="Full Name"]');
  const emailInput = form.querySelector('input[placeholder="Email Address"]');
  const phoneInput = form.querySelector('input[placeholder="Phone Number"]');
  const birthdateInput = form.querySelector('input[placeholder="Birthdate"]');
  const currentPasswordInput = form.querySelector('input[placeholder="Current Password"]');
  const newPasswordInput = form.querySelector('input[placeholder="New Password"]');
  const aboutInput = form.querySelector('textarea');
  const profileInput = document.getElementById('profileImageInput');
  const avatarPreview = document.getElementById('avatarPreview');
  const backArrow = document.querySelector('.back-arrow');

  // 🠔 ניווט חזור
  if (backArrow) {
    backArrow.style.cursor = 'pointer';
    backArrow.addEventListener('click', () => {
      window.location.href = '/pages/volunteer/settingsPage.html';
    });
  }

  //שליפת נתוני מתנדב
  async function loadProfile() {
    try {
      const res = await fetch(`/api/volunteers/${volunteerId}`);
      if (!res.ok) throw new Error('Volunteer not found');
      const data = await res.json();

      nameInput.value = data.fullName || '';
      emailInput.value = data.email || '';
      phoneInput.value = data.phoneNumber || '';
      birthdateInput.value = data.birthdate?.substring(0, 10) || '';
      aboutInput.value = data.aboutMe || '';

      if (data.profileImage) {
        avatarPreview.src = data.profileImage;
      }
    } catch (err) {
      console.error('❌ Failed to load profile:', err);
      alert("Couldn't load profile details.");
    }
  }

  // שמירת פרופיל
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', nameInput.value);
    formData.append('email', emailInput.value);
    formData.append('phoneNumber', phoneInput.value);
    formData.append('birthdate', birthdateInput.value);
    formData.append('aboutMe', aboutInput.value);

    if (currentPasswordInput.value && newPasswordInput.value) {
      formData.append('currentPassword', currentPasswordInput.value);
      formData.append('password', newPasswordInput.value);
    }

    if (profileInput.files[0]) {
      formData.append('profileImage', profileInput.files[0]);
    }

    try {
      const res = await fetch(`/api/volunteers/${volunteerId}`, {
        method: 'PUT',
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Profile updated successfully');
        window.location.href = "/pages/volunteer/profileVol.html";
      } else {
        alert(result.message || '❌ Error updating profile');
      }
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      alert("Something went wrong while updating.");
    }
  });

  // 🖼️ תצוגה מקדימה של תמונה
  profileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        avatarPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  //הפעלת שליפה
  loadProfile();
});


const backArrow = document.querySelector('.back-arrow');

if (backArrow) {
  backArrow.style.cursor = 'pointer'; // שינוי עכבר ליד
  backArrow.addEventListener('click', () => {
    window.location.href = '/pages/volunteer/settingsPage.html';
  });
}