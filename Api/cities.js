const API_BASE = 'https://handsonserver.onrender.com/api/cities';

// שליפת כל הערים מהשרת
export async function getAllCities() {
  try {
    const response = await fetch(API_BASE);
    
    if (!response.ok) {
      throw new Error(`שגיאה בטעינת ערים: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('שגיאה בקריאת ערים מהשרת:', error);
    throw error;
  }
}