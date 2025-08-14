# Google Sheets Tracking Setup Guide

## 📊 **Sheet Structure**

### **1. Main "Guests" Sheet (רשימת מוזמנים)**

Add a new column called **"Visit Status"** (Column G):

| A          | B     | C     | D            | E           | F     | G            |
| ---------- | ----- | ----- | ------------ | ----------- | ----- | ------------ |
| Guest Name | Phone | Email | Visit Status | RSVP Status | Notes | Visit Status |

### **2. "Visits" Sheet (Auto-created)**

| A         | B          | C           | D          | E        | F   | G          |
| --------- | ---------- | ----------- | ---------- | -------- | --- | ---------- |
| Timestamp | Guest Name | Device Type | User Agent | Referrer | URL | Created At |

### **3. "RSVP Responses" Sheet (Existing)**

| A         | B   | C    | D      | E      | F        |
| --------- | --- | ---- | ------ | ------ | -------- |
| Timestamp | ID  | Name | Status | Guests | Blessing |

## 🔧 **Google Sheets Formulas**

### **Formula 1: Check if Guest Visited but Didn't RSVP**

**Location**: Column G in "Guests" sheet  
**Formula**:

```excel
=IF(
  AND(
    COUNTIF(Visits!B:B, A2) > 0,  // Guest exists in Visits
    COUNTIF('RSVP Responses'!C:C, A2) = 0  // Guest NOT in RSVP Responses
  ),
  "Visited - No RSVP",
  IF(
    COUNTIF('RSVP Responses'!C:C, A2) > 0,
    "RSVP Submitted",
    "Not Visited"
  )
)
```

### **Formula 2: Last Visit Date**

**Location**: Column H in "Guests" sheet  
**Formula**:

```excel
=IF(
  COUNTIF(Visits!B:B, A2) > 0,
  MAXIFS(Visits!A:A, Visits!B:B, A2),
  "Never"
)
```

### **Formula 3: Visit Count**

**Location**: Column I in "Guests" sheet  
**Formula**:

```excel
=COUNTIF(Visits!B:B, A2)
```

### **Formula 4: Device Type (Most Recent)**

**Location**: Column J in "Guests" sheet  
**Formula**:

```excel
=IF(
  COUNTIF(Visits!B:B, A2) > 0,
  INDEX(
    Visits!C:C,
    MATCH(
      MAXIFS(Visits!A:A, Visits!B:B, A2),
      Visits!A:A,
      0
    )
  ),
  "N/A"
)
```

### **Formula 5: Days Since Last Visit**

**Location**: Column K in "Guests" sheet  
**Formula**:

```excel
=IF(
  COUNTIF(Visits!B:B, A2) > 0,
  DATEDIF(
    MAXIFS(Visits!A:A, Visits!B:B, A2),
    TODAY(),
    "D"
  ),
  "N/A"
)
```

## 🎨 **Conditional Formatting**

### **Visit Status Colors**

1. **"Visited - No RSVP"**: Red background (#FFE6E6)
2. **"RSVP Submitted"**: Green background (#E6FFE6)
3. **"Not Visited"**: Gray background (#F5F5F5)

### **Setup Instructions**

1. Select Column G (Visit Status)
2. Go to Format → Conditional formatting
3. Add rules:
   - **Rule 1**: Text contains "Visited - No RSVP" → Red background
   - **Rule 2**: Text contains "RSVP Submitted" → Green background
   - **Rule 3**: Text contains "Not Visited" → Gray background

## 📈 **Dashboard Formulas**

### **Summary Statistics**

**Total Guests**: `=COUNTA(A:A)-1`  
**Visited**: `=COUNTIF(G:G, "Visited*")`  
**RSVP Submitted**: `=COUNTIF(G:G, "RSVP Submitted")`  
**Visited but No RSVP**: `=COUNTIF(G:G, "Visited - No RSVP")`  
**Not Visited**: `=COUNTIF(G:G, "Not Visited")`

### **Conversion Rate**

**Visit to RSVP Rate**: `=COUNTIF(G:G, "RSVP Submitted")/COUNTIF(G:G, "Visited*")`

## 🔄 **Automated Actions**

### **Email Reminders (Optional)**

You can set up automated email reminders for guests who visited but didn't RSVP:

1. Go to Extensions → Apps Script
2. Create a new script for email automation
3. Use the formula: `=FILTER(A:A, G:G = "Visited - No RSVP")`

### **WhatsApp Follow-up List**

Create a separate sheet for follow-up:

**Formula for Follow-up List**:

```excel
=FILTER(
  A:C,
  G:G = "Visited - No RSVP"
)
```

## 🚀 **Implementation Steps**

1. **Create Visits Sheet**: The Google Apps Script will auto-create this
2. **Add Visit Status Column**: Add Column G to your main Guests sheet
3. **Apply Formulas**: Copy the formulas above to the appropriate columns
4. **Set Conditional Formatting**: Apply the color coding
5. **Test**: Send a test link and verify tracking works
6. **Monitor**: Check the Visits sheet for incoming data

## 📱 **Testing**

### **Test URL Format**

```
https://rsvp-next.vercel.app/?name=Test%20Guest
```

### **Expected Results**

1. Visit appears in "Visits" sheet
2. Guest status changes to "Visited - No RSVP" in main sheet
3. After RSVP submission, status changes to "RSVP Submitted"

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Formula Errors**: Check that sheet names match exactly
2. **No Visits Tracking**: Verify Google Apps Script is deployed
3. **Duplicate Visits**: Script handles duplicates within 24 hours
4. **Hebrew Names**: Ensure proper encoding in URLs

### **Debug Steps**

1. Check browser console for tracking errors
2. Verify Google Apps Script logs
3. Test with simple English names first
4. Check sheet permissions and sharing settings

