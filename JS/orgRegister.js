//קובץ orgRegister.js – רישום ארגון כולל שמירת משתמש

const form = document.querySelector('.signup-form');
const imageInput = document.getElementById('orgImageInput');
const imagePreview = document.getElementById('orgAvatarPreview');

// תצוגה מקדימה של התמונה שנבחרה
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  }
});

// שליחת טופס רישום ארגון
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // הכנת הנתונים עם FormData כולל תמונה
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

  // אם יש תמונה – נוסיף גם אותה
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

    //שמירת פרטי הארגון המחובר
    localStorage.setItem('loggedInUser', JSON.stringify(result.organization));

    alert('הארגון נרשם בהצלחה!');
    console.log('Organization created:', result);

    //הפנייה לעמוד הבית של הארגון
    window.location.href = '/pages/Organizer/homePage.html';
  } catch (err) {
    console.error('שגיאה בשליחת הטופס:', err);
    alert(`אירעה שגיאה: ${err.message}`);
  }
});
