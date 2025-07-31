// orgRegister.js

document.addEventListener('DOMContentLoaded', () => {
  // הגדרת הטופס והאלמנטים
  const form = document.querySelector('.signup-form');
  const imageInput = document.getElementById('orgImageInput');
  const preview = document.getElementById('orgAvatarPreview');
  const submitBtn = form.querySelector('button[type="submit"]');

  // --- תצוגה מקדימה של תמונת פרופיל ---
  imageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // --- שליחת טופס ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // שינוי כפתור לטעינה
    submitBtn.disabled = true;
    submitBtn.textContent = 'שולח...';

    // יצירת אובייקט FormData
    const formData = new FormData();
    formData.append('orgName', document.getElementById('orgName').value);
    formData.append('phoneNumber', document.getElementById('phone').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('streetName', document.getElementById('streetName').value);
    formData.append('streetNumber', document.getElementById('streetNumber').value);
    formData.append('apartmentNumber', document.getElementById('apartmentNumber').value);
    formData.append('apartmentFloor', document.getElementById('apartmentFloor').value);
    formData.append('city', document.getElementById('citySelect').value);
    formData.append('about', document.getElementById('about').value);

    const imageFile = imageInput.files[0];
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    try {
      const response = await fetch('https://handsonserver.onrender.com/api/organizations', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('הארגון נרשם בהצלחה!');
        form.reset(); // ניקוי טופס
        preview.src = '/Images/profile.svg'; // החזרת תמונת ברירת מחדל
        window.location.href = '/login.html';
      } else {
        alert(data.message || 'שגיאה בהרשמה');
      }

    } catch (err) {
      console.error('שגיאה בשליחת הטופס:', err);
      alert('אירעה שגיאה, נסה שוב מאוחר יותר.');
    } finally {
      // החזרת כפתור למצב רגיל
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
});
