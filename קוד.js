const SHEET_ID = "1CVsub2vsHRFPGV-9Hh_nmWIi2A6_Yhq4gUDf-9-a1go";
const SHEET_NAME = "RSVP Responses";

function doPost(e) {
  try {
    const name = e.parameter.name;
    const status = e.parameter.status;
    const guests = parseInt(e.parameter.guests) || 1;
    const blessing = e.parameter.blessing || "";
    const timestamp = new Date();
    const id = e.parameter.id; // חדש: מקבל ID ייחודי

    if (!name || !id) {
      return jsonResponse({
        success: false,
        message: "Missing name or ID parameter",
      });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const existingRow = findRowById(sheet, id); // מחפש לפי ID במקום שם
    const rowData = [timestamp, id, name, status, guests, blessing]; // כולל ID

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


function onEdit(e) {
  const SHEET_NAME = 'RSVP Responses';
  const sh = e.range.getSheet();
  if (!sh || sh.getName() !== SHEET_NAME) return;

  const row = e.range.getRow();
  if (row === 1) return; // כותרות

  // נעדכן רק אם נערכו עמודות תוכן: C,D,E,F (Name, Status, Guests, Blessing)
  const editedCol = e.range.getColumn();
  const colsToWatch = [3, 4, 5, 6];
  if (!colsToWatch.includes(editedCol)) return;

  // כתיבת זמן נוכחי לעמודה A (Timestamp) כ-date "אמיתי"
  sh.getRange(row, 1).setValue(new Date());
}
