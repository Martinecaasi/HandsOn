// ===== קונפיג =====
const API_BASE = "https://handsonserver-new.onrender.com/api";
const ORGS_URL = `${API_BASE}/organizations`;

// ===== עזרות =====
function qp(name) { return new URLSearchParams(location.search).get(name); }

function resolveOrgId() {
  const fromUrl = qp("id");
  if (fromUrl) return fromUrl;
  const fromLS = localStorage.getItem("orgId");
  return fromLS || null;
}

function resolveToken() {
  // אם שמרת בטוקן בשם אחר - עדכני כאן
  const t1 = localStorage.getItem("token");
  if (t1) return t1;
  try {
    const u = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return u.token || u.accessToken || null;
  } catch { return null; }
}

function pick(...candidates) {
  for (const c of candidates) if (c !== undefined && c !== null && c !== "") return c;
  return "";
}

// ===== DOM =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editOrgForm");
  const avatarPreview = document.getElementById("orgAvatarPreview");
  const avatarInput   = document.getElementById("orgImageInput");

  const orgNameInput        = document.getElementById("orgName");
  const phoneInput          = document.getElementById("phone");
  const emailInput          = document.getElementById("email");
  const streetNameInput     = document.getElementById("streetName");
  const streetNumberInput   = document.getElementById("streetNumber");
  const apartmentNumberInput= document.getElementById("apartmentNumber");
  const apartmentFloorInput = document.getElementById("apartmentFloor");
  const citySelect          = document.getElementById("citySelect");
  const aboutInput          = document.getElementById("aboutOrg");

  const orgId  = resolveOrgId();
  const token  = resolveToken();

  if (!form) {
    console.error("Form #editOrgForm not found");
    return;
  }

  if (!orgId) {
    console.warn("לא נמצא orgId. ננסה לטעון דרך /organizations/me");
  }

  // ---- טעינה ----
  (async function load() {
    // נכין כותרות (Auth אם יש)
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let res, json, ok = false;

    try {
      if (orgId) {
        res = await fetch(`${ORGS_URL}/${orgId}`, { headers });
        ok = res.ok;
        if (!ok) {
          console.warn("GET /:id נכשל", res.status);
        } else {
          json = await res.json();
        }
      }
      // נפילה ל-/me אם אין orgId / נכשל
      if (!ok) {
        res = await fetch(`${ORGS_URL}/me`, { headers });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`שגיאה בטעינת נתוני הארגון (${res.status}) ${txt}`);
        }
        json = await res.json();
      }
    } catch (e) {
      console.error(e);
      alert("שגיאה בטעינת הנתונים (בדקי טוקן/הרשאות/ID). ראי קונסול.");
      return;
    }

    // ---- נירמול תשובות אפשריות ----
    // ייתכן שהשרת עוטף תחת data / organization / org / [0]
    const org = pick(
      json?.organization,
      json?.org,
      Array.isArray(json) ? json[0] : null,
      json
    );

    if (!org || typeof org !== "object") {
      console.error("מבנה JSON לא צפוי:", json);
      alert("מבנה נתונים לא צפוי מהשרת. בדקי את ה-controller שמחזיר את הארגון.");
      return;
    }

    // לעיתים הכתובת מפורקת לשדות שטוחים—נכין address משולב
    const address = org.address || {
      streetName:      org.streetName,
      streetNumber:    org.streetNumber,
      apartmentNumber: org.apartmentNumber,
      apartmentFloor:  org.apartmentFloor
    };

    // מילוי השדות
    orgNameInput.value         = pick(org.name, org.orgName);
    phoneInput.value           = pick(org.phoneNumber, org.phone, org.mobile);
    emailInput.value           = pick(org.email);
    streetNameInput.value      = pick(address?.streetName);
    streetNumberInput.value    = pick(address?.streetNumber);
    apartmentNumberInput.value = pick(address?.apartmentNumber);
    apartmentFloorInput.value  = pick(address?.apartmentFloor);
    aboutInput.value           = pick(org.about, org.description, org.bio);

    const cityVal = pick(org.city, address?.city);
    if (cityVal) {
      // אם אין אופציה תואמת—נוסיף ואז נסמן
      let opt = [...citySelect.options].find(o => o.value === cityVal);
      if (!opt) {
        citySelect.appendChild(new Option(cityVal, cityVal, true, true));
      } else {
        citySelect.value = cityVal;
      }
    }

    const imgUrl = pick(org.imageUrl, org.logoUrl, org.avatarUrl, org.image);
    if (imgUrl) avatarPreview.src = imgUrl;

    // שמרי orgId אם הגיע מ-/me
    if (!orgId && org._id) localStorage.setItem("orgId", org._id);
  })();

  // ---- Preview ----
  if (avatarInput) {
    avatarInput.addEventListener("change", () => {
      const f = avatarInput.files?.[0];
      if (f) avatarPreview.src = URL.createObjectURL(f);
    });
  }

  // ---- שליחה ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idForPut = resolveOrgId() || localStorage.getItem("orgId"); // אחרי /me
    if (!idForPut) {
      alert("חסר orgId לעדכון.");
      return;
    }

    const fd = new FormData();
    fd.append("name", orgNameInput.value.trim());
    fd.append("phoneNumber", phoneInput.value.trim());
    fd.append("email", emailInput.value.trim());
    fd.append("city", citySelect.value);
    fd.append("about", aboutInput.value.trim());
    // אם השרת מצפה address כאובייקט—עדכני בקונטרולר, או שלחי בשמות עם address[...]
    fd.append("streetName", streetNameInput.value.trim());
    fd.append("streetNumber", streetNumberInput.value.trim());
    fd.append("apartmentNumber", apartmentNumberInput.value.trim());
    fd.append("apartmentFloor", apartmentFloorInput.value.trim());
    if (avatarInput?.files?.[0]) fd.append("image", avatarInput.files[0]);

    const headers = {};
    const tokenNow = resolveToken();
    if (tokenNow) headers["Authorization"] = `Bearer ${tokenNow}`;

    try {
      const res = await fetch(`${ORGS_URL}/${idForPut}`, {
        method: "PUT",
        headers,
        body: fd,
      });
      if (!res.ok) {
        console.error("PUT failed", res.status, await res.text());
        throw new Error("שגיאה בעדכון הארגון");
      }
      alert("הפרטים עודכנו בהצלחה!");
      location.href = "/Pages/Organizer/orgProfile.html";
    } catch (err) {
      console.error(err);
      alert(err.message || "עדכון נכשל");
    }
  });
});
