document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerVolunteerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // יצירת אובייקט FormData
    const formData = new FormData();

    // הוספת שדות לטופס
    formData.append('fullName', document.getElementById('fullName').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('phoneNumber', document.getElementById('phoneNumber').value);
    formData.append('birthdate', document.getElementById('birthdate').value);
    formData.append('aboutMe', document.getElementById('aboutMe').value);

    // קובץ תמונת פרופיל
    const imageFile = document.getElementById('profileImageInput').files[0];
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    try {
      const response = await fetch('https://handsonserver-new.onrender.com/api/volunteers/register', {
        method: 'POST',
        body: formData 
      });

      const data = await response.json();

      if (response.ok) {
        alert('נרשמת בהצלחה!');
        window.location.href = '/login.html';
      } else {
        alert(data.message || 'אירעה שגיאה בהרשמה');
      }
    } catch (err) {
      console.error('שגיאה בשליחת הטופס:', err);
      alert('שגיאה בעת שליחת הנתונים לשרת');
    }
  });
});
