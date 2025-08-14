# Google Apps Script - יצירת גיליונות דיווחים אוטומטית

## 🚀 פונקציות חדשות שנוספו ל-Google Apps Script

### 📋 פונקציות זמינות:

#### **1. יצירת גיליון בסיסי:**

```javascript
function createReportsSheet()
```

- יוצר גיליון "דיווחים אחרונים"
- מציג דיווחי "אולי" ו"לא מגיע" ב-12 שעות האחרונות
- כולל סטטיסטיקות בסיסיות

#### **2. יצירת גיליון מתקדם:**

```javascript
function createAdvancedSheet()
```

- יוצר גיליון "דיווחים מתקדמים"
- כולל עמודת "שעות שעברו"
- סטטיסטיקות מתקדמות עם אחוזים

#### **3. יצירת שני הגיליונות בבת אחת:**

```javascript
function createAllReportSheets()
```

- יוצר את שני הגיליונות בבת אחת
- מומלץ לשימוש ראשוני

## 🛠️ איך להשתמש:

### **שיטה 1: ישירות מ-Google Apps Script Editor**

1. **פתח את Google Apps Script:**

   - לך ל-Google Apps Script
   - פתח את הפרויקט שלך
   - העתק את הקוד החדש מ-`קוד.js`

2. **הפעל את הפונקציה:**
   - בחר את הפונקציה הרצויה מהרשימה הנפתחת
   - לחץ על "Run" (▶️)
   - אשר הרשאות אם נדרש

### **שיטה 2: דרך API (מהפרונטנד)**

#### **יצירת גיליון בסיסי:**

```javascript
const response = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    action: "create_reports_sheet",
  }),
});
```

#### **יצירת גיליון מתקדם:**

```javascript
const response = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    action: "create_advanced_sheet",
  }),
});
```

#### **יצירת שני הגיליונות:**

```javascript
const response = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    action: "create_all_sheets",
  }),
});
```

## 📊 מה ייווצר:

### **גיליון "דיווחים אחרונים":**

- עמודות: שם, סטטוס, מספר אורחים, ברכה, זמן דיווח, מזהה
- נוסחה: `=FILTER('RSVP Responses'!A:F, ISNUMBER(MATCH('RSVP Responses'!D:D, {"אולי","לא מגיע"}, 0)), 'RSVP Responses'!A:A >= NOW()-TIME(12,0,0))`
- עיצוב: כותרות כחולות, סטטוסים צבעוניים

### **גיליון "דיווחים מתקדמים":**

- עמודות: שם, סטטוס, מספר אורחים, ברכה, זמן דיווח, מזהה, שעות שעברו
- נוסחה מתקדמת עם חישוב שעות
- סטטיסטיקות: אחוזים, דיווחים בשעה האחרונה

## 🎨 עיצוב אוטומטי:

### **כותרות:**

- רקע כחול (#4285f4)
- טקסט לבן
- גופן מודגש

### **עמודת סטטוס:**

- "אולי" = רקע כתום (#ff9800)
- "לא מגיע" = רקע אדום (#f44336)

### **סטטיסטיקות:**

- רקע אפור בהיר (#f5f5f5)
- מסגרת
- פורמט אחוזים

## ⚡ הוראות מהירות:

### **לשימוש ראשוני:**

1. העתק את הקוד החדש ל-Google Apps Script
2. שמור את הפרויקט
3. הפעל `createAllReportSheets()`
4. אשר הרשאות
5. בדוק את הגיליונות החדשים ב-Google Sheets

### **לשימוש חוזר:**

- הפעל `createReportsSheet()` לגיליון בסיסי
- הפעל `createAdvancedSheet()` לגיליון מתקדם

## 🔄 עדכון אוטומטי:

הגיליונות מתעדכנים אוטומטית כל פעם שמתקבל דיווח חדש לגיליון "RSVP Responses".

## ⚠️ הערות חשובות:

- הגיליונות יימחקו וייווצרו מחדש בכל הפעלה
- הנוסחאות עובדות רק עם נתונים ב-Google Sheets
- נדרשות הרשאות לכתיבה ב-Google Sheets
- הגיליונות ייווצרו באותו Spreadsheet כמו "RSVP Responses"

## 🎯 תוצאה צפויה:

לאחר הפעלת הפונקציה, תראה שני גיליונות חדשים:

1. **"דיווחים אחרונים"** - גיליון בסיסי
2. **"דיווחים מתקדמים"** - גיליון עם נתונים מתקדמים

כל הגיליונות יכללו עיצוב מקצועי ונוסחאות אוטומטיות!
