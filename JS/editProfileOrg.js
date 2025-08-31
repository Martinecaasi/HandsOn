
const form = document.getElementById('editOrgForm');
const imageInput = document.getElementById('orgImageInput');
const imagePreview = document.getElementById('orgAvatarPreview');
const citySelect = document.getElementById('citySelect');

// שמירת מצב מקורי להשוואה – נשלח לשרת רק מה שהשתנה
let original = null;

// עזרי גישה/כתיבה לשדות
const getVal = (id) => document.getElementById(id)?.value ?? '';
const setVal = (id, v) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = v ?? '';
};

// --- טעינת ערים (אם יש לך API פעיל) ---
async function loadCities() {
  try {
    const res = await fetch('https://handsonserver-new.onrender.com/api/cities');
    if (!res.ok) return;
    const cities = await res.json();
    // נקה אפשרויות קיימות (חוץ מהברירת מחדל)
    citySelect.querySelectorAll('option:not(:first-child)').forEach(o => o.remove());
    cities.forEach(c => {
      const name = c?.name ?? c;
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      citySelect.appendChild(opt);
    });
  } catch (e) {
    console.warn('טעינת ערים נכשלה, ממשיכים בלי:', e);
  }
}

// --- טעינת הארגון מה־localStorage וריענון מהשרת ---
async function loadOrganization() {
  const cachedStr = localStorage.getItem('loggedInUser');
  if (!cachedStr) {
    alert('לא נמצא ארגון מחובר. אנא התחברי שוב.');
    window.location.href = '/Pages/login.html';
    return;
  }

  let org;
  try { org = JSON.parse(cachedStr); } catch { org = null; }

  const orgId = org?._id || org?.id;
  if (!orgId) {
    alert('פרטי משתמש שגויים. התחברי מחדש.');
    window.location.href = '/Pages/login.html';
    return;
  }

  // נסה לרענן מהשרת (עדכני יותר)
  try {
    const res = await fetch(`https://handsonserver-new.onrender.com/api/organizations/${orgId}`);
    if (res.ok) {
      const fresh = await res.json();
      org = { ...org, ...fresh };
      localStorage.setItem('loggedInUser', JSON.stringify(org));
    }
  } catch (e) {
    console.warn('רענון מהשרת נכשל, משתמשים במידע המקומי:', e);
  }

  // בוני "מקור" להשוואה (התאמה לשמות השדות שלך)
  original = {
    organizationName: org.organizationName || org.name || '',
    speciality: org.speciality || '',
    phoneNumber: org.phoneNumber || '',
    email: org.email || '',
    handsNeeded: Number(org.handsNeeded ?? '') || '',
    streetName: org.streetName || '',
    streetNumber: org.streetNumber ?? '',
    apartmentNumber: org.apartmentNumber || '',
    apartmentFloor: org.apartmentFloor || '',
    city: org.city || '',
    about: org.about || org.aboutOrg || '',
    profileImageUrl: org.profileImageUrl || org.profileImage || ''
  };

  // מלאי את השדות בטופס לפי ה־HTML שסיפקת
  setVal('orgName', original.organizationName);
  setVal('speciality', original.speciality);
  setVal('phone', original.phoneNumber);
  setVal('email', original.email);
  setVal('handsNeeded', original.handsNeeded);
  setVal('streetName', original.streetName);
  setVal('streetNumber', original.streetNumber);
  setVal('apartmentNumber', original.apartmentNumber);
  setVal('apartmentFloor', original.apartmentFloor);

  await loadCities();
  setVal('citySelect', original.city);

  setVal('aboutOrg', original.about);

  if (original.profileImageUrl) {
    imagePreview.src = original.profileImageUrl;
  }
}

// --- תצוגה מקדימה לתמונה חדשה ---
imageInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  }
});

// --- שליחת עדכון ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!original) return;

  const cached = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const orgId = cached._id || cached.id;
  if (!orgId) {
    alert('אין מזהה ארגון. התחברי מחדש.');
    window.location.href = '/Pages/login.html';
    return;
  }

  // ערכים נוכחיים מהטופס
  const current = {
    organizationName: getVal('orgName').trim(),
    speciality: getVal('speciality').trim(),
    phoneNumber: getVal('phone').trim(),
    email: getVal('email').trim().toLowerCase(),
    handsNeeded: getVal('handsNeeded') ? Number(getVal('handsNeeded')) : '',
    streetName: getVal('streetName').trim(),
    streetNumber: getVal('streetNumber') ? Number(getVal('streetNumber')) : '',
    apartmentNumber: getVal('apartmentNumber').trim(),
    apartmentFloor: getVal('apartmentFloor').trim(),
    city: citySelect?.value || '',
    about: getVal('aboutOrg').trim()
  };

  // נבנה FormData רק עם מה שהשתנה
  const formData = new FormData();
  Object.entries(current).forEach(([key, value]) => {
    const prev = (original[key] ?? '').toString();
    const now = (value ?? '').toString();
    if (prev !== now) {
      formData.append(key, value);
    }
  });

  // תמונה?
  const hasNewImage = imageInput.files && imageInput.files.length > 0;
  if (hasNewImage) {
    formData.append('profileImage', imageInput.files[0]); // שם שדה כמו ברישום
  }

  if ([...formData.keys()].length === 0) {
    alert('לא בוצעו שינויים.');
    return;
  }

  try {
    const res = await fetch(`https://handsonserver-new.onrender.com/api/organizations/${orgId}`, {
      method: 'PUT',           // אם בצד שרת מימשת PATCH – החליפי כאן
      body: formData
      // אם יש JWT: headers: { Authorization: `Bearer ${token}` } (אבל לא עם multipart boundary)
    });

    const txt = await res.text();
    let result;
    try { result = JSON.parse(txt); }
    catch { throw new Error(`Server returned non-JSON: ${txt}`); }

    if (!res.ok) {
      throw new Error(result.message || `Error ${res.status}`);
    }

    if (result.organization) {
      localStorage.setItem('loggedInUser', JSON.stringify(result.organization));
    }
    alert('הפרופיל עודכן בהצלחה!');
    window.location.href = '/Pages/Organizer/orgProfile.html';
  } catch (err) {
    console.error('שגיאה בעדכון פרופיל:', err);
    alert(`אירעה שגיאה: ${err.message}`);
  }
});

// אתחול
loadOrganization();
