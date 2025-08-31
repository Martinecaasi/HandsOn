// קובץ: /JS/editOrgProfile.js
// טוען את פרטי הארגון, ממלא את הטופס, מציג תצוגת תמונה, ושולח עדכון רק על מה שהשתנה.

const form = document.getElementById('editOrganizerForm');
const imageInput = document.getElementById('orgImageInput');
const imagePreview = document.getElementById('orgAvatarPreview');
const removeImageCheckbox = document.getElementById('removeImage');

let original = null; // שמירת מצב מקורי להשוואות

// עזרי גישה
const getVal = (id) => document.getElementById(id)?.value ?? '';
const setVal = (id, v) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = v ?? '';
};

// תצוגה מקדימה לתמונה חדשה
imageInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) {
    removeImageCheckbox.checked = false; // אם בחרו חדשה—בטל "הסר תמונה"
    imagePreview.src = URL.createObjectURL(file);
  }
});

// טעינת פרטי הארגון (מ-localStorage, ורענון מהשרת אם אפשר)
async function loadOrganization() {
  const cachedStr = localStorage.getItem('loggedInUser');
  if (!cachedStr) {
    alert('לא נמצא ארגון מחובר. אנא התחברי מחדש.');
    return (window.location.href = '/Pages/login.html');
  }

  let org;
  try { org = JSON.parse(cachedStr); } catch { org = null; }

  const orgId = org?._id || org?.id;
  if (!orgId) {
    alert('מבנה משתמש לא תקין. התחברי מחדש.');
    return (window.location.href = '/Pages/login.html');
  }

  // ריענון מהשרת (אם יש endpoint כזה)
  try {
    const res = await fetch(`https://handsonserver-new.onrender.com/api/organizations/${orgId}`);
    if (res.ok) {
      const fresh = await res.json();
      org = { ...org, ...fresh };
      localStorage.setItem('loggedInUser', JSON.stringify(org));
    }
  } catch (e) {
    console.warn('נכשל לרענן מהשרת, משתמשים ב-cache:', e);
  }

  // ממפים לשמות השדות בטופס (orgName בצד לקוח -> organizationName בצד שרת)
  original = {
    orgName: org.organizationName || org.name || '',
    phone: org.phoneNumber || '',
    email: org.email || '',
    streetName: org.streetName || '',
    streetNumber: org.streetNumber ?? '',
    apartmentNumber: org.apartmentNumber || '',
    apartmentFloor: org.apartmentFloor || '',
    city: org.city || '',
    about: org.about || '',
    profileImageUrl: org.profileImageUrl || org.profileImage || ''
  };

  // מילוי טופס
  setVal('orgName', original.orgName);
  setVal('phone', original.phone);
  setVal('email', original.email);
  setVal('streetName', original.streetName);
  setVal('streetNumber', original.streetNumber);
  setVal('apartmentNumber', original.apartmentNumber);
  setVal('apartmentFloor', original.apartmentFloor);
  setVal('citySelect', original.city);
  setVal('about', original.about);

  if (original.profileImageUrl) {
    imagePreview.src = original.profileImageUrl;
  }
}

// שליחת עדכון (PUT multipart) – רק שדות שהשתנו
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!original) return;

  const cached = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const orgId = cached._id || cached.id;
  if (!orgId) {
    alert('אין מזהה ארגון. התחברי מחדש.');
    return (window.location.href = '/Pages/login.html');
  }

  // ערכים נוכחיים
  const current = {
    orgName: getVal('orgName').trim(),
    phone: getVal('phone').trim(),
    email: getVal('email').trim().toLowerCase(),
    streetName: getVal('streetName').trim(),
    streetNumber: getVal('streetNumber') ? Number(getVal('streetNumber')) : '',
    apartmentNumber: getVal('apartmentNumber').trim(),
    apartmentFloor: getVal('apartmentFloor').trim(),
    city: document.getElementById('citySelect')?.value || '',
    about: getVal('about').trim()
  };

  // ולידציה בסיסית (אופציונלי)
  if (!current.orgName || !current.email) {
    return alert('שם הארגון ואימייל הם שדות חובה.');
  }

  // נבנה FormData רק ממה שהשתנה
  const fd = new FormData();

  // מיפוי שמות שדות: בצד שרת מצופה organizationName + phoneNumber
  const mapClientToServer = {
    orgName: 'organizationName',
    phone: 'phoneNumber',
    email: 'email',
    streetName: 'streetName',
    streetNumber: 'streetNumber',
    apartmentNumber: 'apartmentNumber',
    apartmentFloor: 'apartmentFloor',
    city: 'city',
    about: 'about'
  };

  Object.entries(current).forEach(([k, v]) => {
    const prev = (original[k] ?? '').toString();
    const now = (v ?? '').toString();
    if (prev !== now) {
      const serverKey = mapClientToServer[k] || k;
      fd.append(serverKey, v);
    }
  });

  // תמונה חדשה?
  const hasNewImage = imageInput.files && imageInput.files.length > 0;
  if (hasNewImage) {
    fd.append('profileImage', imageInput.files[0]);
  }
  // הסרת תמונה?
  if (removeImageCheckbox.checked) {
    fd.append('removeImage', 'true');
  }

  if ([...fd.keys()].length === 0) {
    return alert('לא בוצעו שינויים.');
  }

  try {
    const res = await fetch(`https://handsonserver-new.onrender.com/api/organizations/${orgId}`, {
      method: 'PUT',
      body: fd
      // אם יש JWT: headers: { Authorization: `Bearer ${token}` }  (לא להגדיר Content-Type ידני)
    });

    const text = await res.text();
    let result;
    try { result = JSON.parse(text); }
    catch { throw new Error(`Server returned non-JSON: ${text}`); }

    if (!res.ok) {
      throw new Error(result.message || `Error ${res.status}`);
    }

    if (result.organization) {
      localStorage.setItem('loggedInUser', JSON.stringify(result.organization));
    }

    alert('הפרופיל עודכן בהצלחה!');
    window.location.href = '/Pages/Organizer/orgProfile.html';
  } catch (err) {
    console.error('שגיאה בעדכון הארגון:', err);
    alert(`אירעה שגיאה: ${err.message}`);
  }
});

// אתחול העמוד
loadOrganization();
