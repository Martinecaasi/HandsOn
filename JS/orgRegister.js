// ✅ קובץ orgRegister.js – רישום ארגון עם שליחת תמונה

const form = document.querySelector('.signup-form');
const imageInput = document.getElementById('orgImageInput');
const imagePreview = document.getElementById('orgAvatarPreview');

// הצגת preview לתמונה
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  }
});

// האזנה לשליחת הטופס
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // יצירת FormData כדי לשלוח קובץ ותוכן
  const formData = new FormData();
  formData.append('name', document.getElementById('orgName').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('password', document.getElementById('password').value);
  formData.append('phoneNumber', document.getElementById('phone').value);
  formData.append('streetName', document.getElementById('streetName').value);
  formData.append('streetNumber', document.getElementById('streetNumber').value);
  formData.append('apartmentNumber', document.getElementById('apartmentNumber').value);
  formData.append('apartmentFloor', document.getElementById('apartmentFloor').value);
  formData.append('city', document.getElementById('citySelect').value);
  formData.append('about', document.getElementById('about').value);

  // הוספת תמונה אם קיימת
  if (imageInput.files.length > 0) {
    formData.append('profileImage', imageInput.files[0]);
  }

  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/organizations/register', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'שגיאה ברישום הארגון');
    }

    const result = await res.json();
    alert('הארגון נרשם בהצלחה!');
    console.log('Organization created:', result);


     window.location.href = '/homePage.html';
  } catch (err) {
    console.error('שגיאה בשליחת הטופס:', err);
    alert(`אירעה שגיאה: ${err.message}`);
  }
});
