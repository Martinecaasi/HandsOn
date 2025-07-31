document.addEventListener('DOMContentLoaded', () => {
  // --- תצוגה מקדימה של תמונת פרופיל ---
  const imageInput = document.getElementById('orgImageInput');
  const preview = document.getElementById('orgAvatarPreview');

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

  // --- טעינת ערים ממערך סטטי ---
  const cities = [
    'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 'אשקלון',
    'רמת גן', 'גבעתיים', 'נתניה', 'הרצליה', 'פתח תקווה', 'אילת',
    'טבריה', 'צפת', 'עכו', 'נהריה', 'מודיעין', 'ראשון לציון',
    'רחובות', 'רעננה', 'כפר סבא', 'בית שמש', 'קריית גת', 'קריית שמונה'
  ];

  const select = document.getElementById('citySelect');
  cities.sort((a, b) => a.localeCompare(b, 'he')); // מיון אלפביתי
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    select.appendChild(option);
  });

  // --- שליחת טופס רישום ---
  const form = document.querySelector('.signup-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

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


    if (!formData.get('city')) {
      alert('יש לבחור עיר מהרשימה');
      return;
    }

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
        window.location.href = '/login.html';
      } else {
        alert(data.message || 'שגיאה בהרשמה');
      }
    } catch (err) {
      console.error('שגיאה בשליחת הטופס:', err);
      alert('אירעה שגיאה, נסה שוב מאוחר יותר.');
    }
  });
});
