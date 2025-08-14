# Google Sheets - דיווחים אחרונים (12 שעות)

## 📊 גיליון חדש: "דיווחים אחרונים"

צור גיליון חדש בשם "דיווחים אחרונים" והוסף את הנוסחאות הבאות:

### 📋 כותרות העמודות (שורה 1):

```
A1: שם
B1: סטטוס
C1: מספר אורחים
D1: ברכה
E1: זמן דיווח
F1: מזהה
```

### 🔍 נוסחה לשליפת "אולי" ו"לא מגיע" ב-12 שעות האחרונות:

#### **שורה A2 (שם):**

```excel
=QUERY('RSVP Responses'!A:F, "SELECT C WHERE D IN ('אולי', 'לא מגיע') AND A >= datetime '"&TEXT(NOW()-TIME(12,0,0), "yyyy-mm-dd hh:mm:ss")&"' ORDER BY A DESC")
```

#### **שורה B2 (סטטוס):**

```excel
=QUERY('RSVP Responses'!A:F, "SELECT D WHERE D IN ('אולי', 'לא מגיע') AND A >= datetime '"&TEXT(NOW()-TIME(12,0,0), "yyyy-mm-dd hh:mm:ss")&"' ORDER BY A DESC")
```

#### **שורה C2 (מספר אורחים):**

```excel
=QUERY('RSVP Responses'!A:F, "SELECT E WHERE D IN ('אולי', 'לא מגיע') AND A >= datetime '"&TEXT(NOW()-TIME(12,0,0), "yyyy-mm-dd hh:mm:ss")&"' ORDER BY A DESC")
```

#### **שורה D2 (ברכה):**

```excel
=QUERY('RSVP Responses'!A:F, "SELECT F WHERE D IN ('אולי', 'לא מגיע') AND A >= datetime '"&TEXT(NOW()-TIME(12,0,0), "yyyy-mm-dd hh:mm:ss")&"' ORDER BY A DESC")
```

#### **שורה E2 (זמן דיווח):**

```excel
=QUERY('RSVP Responses'!A:F, "SELECT A WHERE D IN ('אולי', 'לא מגיע') AND A >= datetime '"&TEXT(NOW()-TIME(12,0,0), "yyyy-mm-dd hh:mm:ss")&"' ORDER BY A DESC")
```

#### **שורה F2 (מזהה):**

```excel
=QUERY('RSVP Responses'!A:F, "SELECT B WHERE D IN ('אולי', 'לא מגיע') AND A >= datetime '"&TEXT(NOW()-TIME(12,0,0), "yyyy-mm-dd hh:mm:ss")&"' ORDER BY A DESC")
```

## 📈 נוסחה אחת לכל הנתונים:

### **בתא A2 (כל הנתונים בבת אחת):**

```excel
=QUERY('RSVP Responses'!A:F, "SELECT C, D, E, F, A, B WHERE D IN ('אולי', 'לא מגיע') AND A >= datetime '"&TEXT(NOW()-TIME(12,0,0), "yyyy-mm-dd hh:mm:ss")&"' ORDER BY A DESC")
```

## 🚀 נוסחה פשוטה יותר (מומלצת):

### **בתא A2:**

```excel
=FILTER('RSVP Responses'!A:F, ('RSVP Responses'!D:D="אולי") + ('RSVP Responses'!D:D="לא מגיע"), 'RSVP Responses'!A:A >= NOW()-TIME(12,0,0))
```

### **או נוסחה עוד יותר פשוטה:**

```excel
=FILTER('RSVP Responses'!A:F, ISNUMBER(MATCH('RSVP Responses'!D:D, {"אולי","לא מגיע"}, 0)), 'RSVP Responses'!A:A >= NOW()-TIME(12,0,0))
```

## 🎨 עיצוב מותנה:

### **עיצוב לעמודת סטטוס:**

1. בחר את עמודה B
2. לך ל-Format → Conditional formatting
3. הוסף כללים:
   - **"אולי"** = רקע כתום
   - **"לא מגיע"** = רקע אדום

### **עיצוב לזמן:**

1. בחר את עמודה E
2. לך ל-Format → Number → Date time
3. בחר פורמט: `dd/mm/yyyy hh:mm:ss`

## 📊 סטטיסטיקות:

### **מספר דיווחי "אולי":**

```excel
=COUNTIF(B:B, "אולי")
```

### **מספר דיווחי "לא מגיע":**

```excel
=COUNTIF(B:B, "לא מגיע")
```

### **סה"כ דיווחים ב-12 שעות:**

```excel
=COUNTA(A:A)-1
```

## 📈 סטטיסטיקות מתקדמות:

### **מספר דיווחי "אולי" ב-12 שעות (ישירות מהגיליון הראשי):**

```excel
=COUNTIFS('RSVP Responses'!D:D, "אולי", 'RSVP Responses'!A:A, ">="&NOW()-TIME(12,0,0))
```

### **מספר דיווחי "לא מגיע" ב-12 שעות (ישירות מהגיליון הראשי):**

```excel
=COUNTIFS('RSVP Responses'!D:D, "לא מגיע", 'RSVP Responses'!A:A, ">="&NOW()-TIME(12,0,0))
```

### **סה"כ דיווחים ב-12 שעות (ישירות מהגיליון הראשי):**

```excel
=COUNTIFS('RSVP Responses'!D:D, {"אולי","לא מגיע"}, 'RSVP Responses'!A:A, ">="&NOW()-TIME(12,0,0))
```

### **אחוז דיווחי "אולי" מכל הדיווחים ב-12 שעות:**

```excel
=IF(COUNTIFS('RSVP Responses'!D:D, {"אולי","לא מגיע"}, 'RSVP Responses'!A:A, ">="&NOW()-TIME(12,0,0))>0,
   COUNTIFS('RSVP Responses'!D:D, "אולי", 'RSVP Responses'!A:A, ">="&NOW()-TIME(12,0,0)) /
   COUNTIFS('RSVP Responses'!D:D, {"אולי","לא מגיע"}, 'RSVP Responses'!A:A, ">="&NOW()-TIME(12,0,0)),
   0)
```

## 🔄 עדכון אוטומטי:

הנוסחאות מתעדכנות אוטומטית כל פעם שמתווסף דיווח חדש לגיליון "RSVP Responses".

## 📱 הוראות:

1. **צור גיליון חדש** בשם "דיווחים אחרונים"
2. **העתק את הנוסחה** מ-A2 לכל התא
3. **עצב את העמודות** לפי ההוראות
4. **הנוסחה תעדכן אוטומטית** כשמתקבלים דיווחים חדשים

## ⚠️ הערות חשובות:

- הנוסחה מחשבת 12 שעות אחורה מהזמן הנוכחי
- הדיווחים מסודרים לפי זמן (החדש ביותר קודם)
- אם אין דיווחים ב-12 שעות האחרונות, הגיליון יהיה ריק
- הנוסחה עובדת רק עם נתונים ב-Google Sheets (לא עם נתונים מקומיים)
