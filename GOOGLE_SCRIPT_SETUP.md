# Google Apps Script Setup for RSVP Form

## Updated Apps Script Code

Here's the updated Apps Script code that handles unique IDs:

```javascript
const SHEET_ID = "1CVsub2vsHRFPGV-9Hh_nmWIi2A6_Yhq4gUDf-9-a1go";
const SHEET_NAME = "RSVP Responses";

function doPost(e) {
  try {
    // Get data from URL parameters
    const name = e.parameter.name;
    const status = e.parameter.status;
    const guests = parseInt(e.parameter.guests) || 1;
    const blessing = e.parameter.blessing || "";
    const timestamp = new Date();
    const id = e.parameter.id; // New: Get unique ID

    if (!name || !id) {
      return jsonResponse({
        success: false,
        message: "Missing name or ID parameter",
      });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const existingRow = findRowById(sheet, id); // Changed: Search by ID instead of name
    const rowData = [timestamp, id, name, status, guests, blessing]; // Added ID column

    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
      return jsonResponse({
        success: true,
        message: "RSVP updated",
        action: "update",
      });
    } else {
      sheet.appendRow(rowData);
      return jsonResponse({
        success: true,
        message: "RSVP submitted",
        action: "add",
      });
    }
  } catch (err) {
    return jsonResponse({ success: false, message: "Server error: " + err });
  }
}

function doGet(e) {
  const id = e.parameter.id; // Changed: Get ID instead of name
  if (!id)
    return jsonResponse({ success: false, message: "Missing ID parameter" });

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === id) {
      // Changed: Search by ID column
      return jsonResponse({
        success: true,
        id: data[i][1],
        name: data[i][2],
        status: data[i][3],
        guests: data[i][4],
        blessing: data[i][5],
        timestamp: data[i][0],
      });
    }
  }

  return jsonResponse({ success: false, message: "ID not found" });
}

function findRowById(sheet, id) {
  // Changed: Search by ID
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === id) {
      // Changed: ID is in column 1
      return i + 1;
    }
  }
  return 0;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

## Google Sheets Setup

### 1. Create the Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename the first sheet to "RSVP Responses"

### 2. Set Up Headers

In the first row, add these headers:

```
A1: Timestamp
B1: ID
C1: Name
D1: Status
E1: Guests
F1: Blessing
```

### 3. Format the Headers

- Select row 1
- Make it bold
- Add a background color
- Freeze the first row

### 4. Set Up Data Validation (Optional)

For the Status column (D):

1. Select column D
2. Go to Data > Data validation
3. Set criteria to "List of items"
4. Enter: `מגיע,אולי,לא מגיע`
5. Check "Show validation help text"

## Apps Script Setup

### 1. Create Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New project"
3. Replace the default code with the code above

### 2. Update Sheet ID

Replace `'1CVsub2vsHRFPGV-9Hh_nmWIi2A6_Yhq4gUDf-9-a1go'` with your actual Google Sheet ID.

To find your Sheet ID:

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. Copy the ID part

### 3. Deploy the Script

1. Click "Deploy" > "New deployment"
2. Choose "Web app"
3. Set:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the Web app URL

### 4. Set Environment Variable

In your Vercel project:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add:
   - Name: `GOOGLE_SCRIPT_URL`
   - Value: Your Apps Script Web app URL

## Testing

### 1. Test the Form

1. Fill out the RSVP form
2. Submit
3. Check the Google Sheet - you should see a new row with:
   - Timestamp
   - Unique ID
   - Name
   - Status
   - Guests
   - Blessing

### 2. Test Duplicate Names

1. Submit with name "Moshe Cohen"
2. Submit again with name "Moshe Cohen" (different guest)
3. Both should have different IDs and separate rows

### 3. Test Updates

1. Submit an RSVP
2. Update the same guest's details
3. The row should be updated, not duplicated

## Benefits of This Approach

✅ **No Name Collisions**: Each guest gets a unique ID  
✅ **Persistent Identity**: Same guest can update their RSVP  
✅ **Privacy**: IDs are random and not tied to personal info  
✅ **Scalability**: Works for any number of guests  
✅ **Backward Compatibility**: Still stores names for display

## Troubleshooting

### Common Issues:

1. **"Missing ID parameter"**: Check that the form is sending the ID
2. **"Sheet not found"**: Verify the Sheet ID and name
3. **"Permission denied"**: Check Apps Script deployment settings

### Debug Steps:

1. Check browser console for form data
2. Check Vercel logs for API calls
3. Check Apps Script logs for server errors
4. Verify Google Sheet permissions
