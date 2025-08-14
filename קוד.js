const SHEET_ID = "1CVsub2vsHRFPGV-9Hh_nmWIi2A6_Yhq4gUDf-9-a1go";
const SHEET_NAME = "RSVP Responses";
const VISITS_SHEET_NAME = "Visits";

function doPost(e) {
  try {
    const action = e.parameter.action;

    // Handle visit tracking
    if (action === "track_visit") {
      return handleVisitTracking(e);
    }

    // Handle sheet creation
    if (action === "create_reports_sheet") {
      const result = createRecentReportsSheet();
      return jsonResponse(result);
    }
    
    // Handle recent reports check
    if (action === "check_recent_reports") {
      const result = checkRecentReports();
      return jsonResponse(result);
    }

    // Handle advanced sheet creation
    if (action === "create_advanced_sheet") {
      const result = createAdvancedReportsSheet();
      return jsonResponse(result);
    }

    // Handle creation of all sheets
    if (action === "create_all_sheets") {
      const result = createAllReportSheets();
      return jsonResponse(result);
    }

    // Handle RSVP submission (existing logic)
    // Decode URL-encoded parameters to handle Hebrew text properly
    const name = decodeURIComponent(e.parameter.name || "");
    const status = decodeURIComponent(e.parameter.status || "");
    const guests = parseInt(e.parameter.guests) || 1;
    const blessing = decodeURIComponent(e.parameter.blessing || "");
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
        name: data[i][2] || "",
        status: data[i][3] || "",
        guests: data[i][4] || 1,
        blessing: data[i][5] || "",
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

// פונקציה פשוטה לבדיקת דיווחי "אולי" ו"לא מגיע" ב-3 שעות האחרונות
function checkRecentReports() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log("❌ לא נמצא גיליון 'RSVP Responses'");
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000)); // 3 שעות אחורה
    
    Logger.log("🔍 בודק דיווחים מ-" + threeHoursAgo.toLocaleString("he-IL") + " עד עכשיו");
    Logger.log("📊 סה\"כ שורות בנתונים: " + (data.length - 1));
    
    let maybeCount = 0;
    let notComingCount = 0;
    let recentReports = [];
    
    // בדוק כל שורה (התחל מ-1 כדי לדלג על הכותרות)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timestamp = new Date(row[0]); // עמודה A - זמן
      const status = row[3]; // עמודה D - סטטוס
      const name = row[2]; // עמודה C - שם
      
      // בדוק אם הדיווח הוא מ-3 השעות האחרונות
      if (timestamp >= threeHoursAgo) {
        if (status === "אולי") {
          maybeCount++;
          recentReports.push({
            name: name,
            status: status,
            time: timestamp.toLocaleString("he-IL"),
            hoursAgo: ((now - timestamp) / (1000 * 60 * 60)).toFixed(1)
          });
        } else if (status === "לא מגיע") {
          notComingCount++;
          recentReports.push({
            name: name,
            status: status,
            time: timestamp.toLocaleString("he-IL"),
            hoursAgo: ((now - timestamp) / (1000 * 60 * 60)).toFixed(1)
          });
        }
      }
    }
    
    // הדפס תוצאות
    Logger.log("📈 תוצאות הבדיקה:");
    Logger.log("🟠 דיווחי 'אולי' ב-3 שעות: " + maybeCount);
    Logger.log("🔴 דיווחי 'לא מגיע' ב-3 שעות: " + notComingCount);
    Logger.log("📋 סה\"כ דיווחים רלוונטיים: " + recentReports.length);
    
    if (recentReports.length > 0) {
      Logger.log("📝 פירוט הדיווחים:");
      recentReports.forEach((report, index) => {
        Logger.log(`${index + 1}. ${report.name} - ${report.status} (לפני ${report.hoursAgo} שעות, ${report.time})`);
      });
    } else {
      Logger.log("✅ אין דיווחי 'אולי' או 'לא מגיע' ב-3 השעות האחרונות");
    }
    
    // בדוק גם את כל הדיווחים (לא רק מ-3 שעות)
    let totalMaybe = 0;
    let totalNotComing = 0;
    
    for (let i = 1; i < data.length; i++) {
      const status = data[i][3];
      if (status === "אולי") totalMaybe++;
      if (status === "לא מגיע") totalNotComing++;
    }
    
    Logger.log("📊 סטטיסטיקות כללית:");
    Logger.log("🟠 סה\"כ דיווחי 'אולי' בכל הזמן: " + totalMaybe);
    Logger.log("🔴 סה\"כ דיווחי 'לא מגיע' בכל הזמן: " + totalNotComing);
    
    return {
      success: true,
      recentMaybe: maybeCount,
      recentNotComing: notComingCount,
      totalMaybe: totalMaybe,
      totalNotComing: totalNotComing,
      reports: recentReports
    };
    
  } catch (error) {
    Logger.log("❌ שגיאה בבדיקה: " + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);

    // בדוק אם הגיליון כבר קיים
    let sheet = spreadsheet.getSheetByName("דיווחים אחרונים");
    if (sheet) {
      // אם הגיליון קיים, מחק אותו ויצור חדש
      spreadsheet.deleteSheet(sheet);
    }

    // צור גיליון חדש
    sheet = spreadsheet.insertSheet("דיווחים אחרונים");

    // הגדר כותרות
    const headers = ["שם", "סטטוס", "מספר אורחים", "ברכה", "זמן דיווח", "מזהה"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // הגדר נוסחה לשליפת נתונים
    const formula = `=FILTER('${SHEET_NAME}'!A:F, ISNUMBER(MATCH('${SHEET_NAME}'!D:D, {"אולי","לא מגיע"}, 0)), '${SHEET_NAME}'!A:A >= NOW()-TIME(12,0,0))`;
    sheet.getRange(2, 1).setFormula(formula);

    // הגדר נוסחאות סטטיסטיקה
    sheet.getRange("H1").setValue("סטטיסטיקות");
    sheet.getRange("H2").setValue("דיווחי 'אולי' ב-12 שעות:");
    sheet
      .getRange("I2")
      .setFormula(
        `=COUNTIFS('${SHEET_NAME}'!D:D, "אולי", '${SHEET_NAME}'!A:A, ">="&NOW()-TIME(12,0,0))`
      );

    sheet.getRange("H3").setValue("דיווחי 'לא מגיע' ב-12 שעות:");
    sheet
      .getRange("I3")
      .setFormula(
        `=COUNTIFS('${SHEET_NAME}'!D:D, "לא מגיע", '${SHEET_NAME}'!A:A, ">="&NOW()-TIME(12,0,0))`
      );

    sheet.getRange("H4").setValue('סה"כ דיווחים ב-12 שעות:');
    sheet
      .getRange("I4")
      .setFormula(
        `=COUNTIFS('${SHEET_NAME}'!D:D, {"אולי","לא מגיע"}, '${SHEET_NAME}'!A:A, ">="&NOW()-TIME(12,0,0))`
      );

    // עיצוב כותרות
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#4285f4");
    headerRange.setFontColor("white");
    headerRange.setFontWeight("bold");

    // עיצוב עמודת סטטוס
    const statusColumn = sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1);
    const conditionalFormatRules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("אולי")
        .setBackground("#ff9800")
        .setRanges([statusColumn])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("לא מגיע")
        .setBackground("#f44336")
        .setRanges([statusColumn])
        .build(),
    ];
    sheet.setConditionalFormatRules(conditionalFormatRules);

    // עיצוב עמודת זמן
    const timeColumn = sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1);
    timeColumn.setNumberFormat("dd/mm/yyyy hh:mm:ss");

    // התאם רוחב עמודות
    sheet.autoResizeColumns(1, headers.length);

    // עיצוב סטטיסטיקות
    const statsRange = sheet.getRange("H1:I4");
    statsRange.setBackground("#f5f5f5");
    statsRange.setBorder(true, true, true, true, true, true);
    sheet.getRange("H1").setFontWeight("bold");

    return {
      success: true,
      message: "גיליון 'דיווחים אחרונים' נוצר בהצלחה!",
      sheetName: "דיווחים אחרונים",
    };
  } catch (error) {
    return {
      success: false,
      message: "שגיאה ביצירת הגיליון: " + error.toString(),
    };
  }
}

// פונקציה שניתן לקרוא לה ישירות מ-Google Apps Script Editor
function createReportsSheet() {
  const result = createRecentReportsSheet();
  Logger.log("Result: " + JSON.stringify(result));
  return result;
}

// פונקציה פשוטה לבדיקת דיווחים אחרונים - הפעל ישירות מ-Google Apps Script
function checkReports() {
  Logger.log("🚀 מתחיל בדיקת דיווחים אחרונים...");
  const result = checkRecentReports();
  Logger.log("✅ בדיקה הושלמה!");
  return result;
}

// פונקציה ליצירת גיליון דיווחים מתקדם עם נוסחאות נוספות
function createAdvancedReportsSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);

    // בדוק אם הגיליון כבר קיים
    let sheet = spreadsheet.getSheetByName("דיווחים מתקדמים");
    if (sheet) {
      spreadsheet.deleteSheet(sheet);
    }

    // צור גיליון חדש
    sheet = spreadsheet.insertSheet("דיווחים מתקדמים");

    // הגדר כותרות
    const headers = [
      "שם",
      "סטטוס",
      "מספר אורחים",
      "ברכה",
      "זמן דיווח",
      "מזהה",
      "שעות שעברו",
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // נוסחה לשליפת נתונים עם חישוב שעות שעברו
    const formula = `=ARRAYFORMULA(IF(ROW(A:A)=1, {"שם", "סטטוס", "מספר אורחים", "ברכה", "זמן דיווח", "מזהה", "שעות שעברו"}, 
      IF(ISNUMBER(MATCH('${SHEET_NAME}'!D:D, {"אולי","לא מגיע"}, 0)) * ('${SHEET_NAME}'!A:A >= NOW()-TIME(12,0,0)),
        {'${SHEET_NAME}'!C:C, '${SHEET_NAME}'!D:D, '${SHEET_NAME}'!E:E, '${SHEET_NAME}'!F:F, '${SHEET_NAME}'!A:A, '${SHEET_NAME}'!B:B, 
         ROUND((NOW() - '${SHEET_NAME}'!A:A) * 24, 1)},
        {""})
      ))`;

    sheet.getRange(1, 1).setFormula(formula);

    // סטטיסטיקות מתקדמות
    sheet.getRange("I1").setValue("סטטיסטיקות מתקדמות");
    sheet.getRange("I2").setValue("דיווחי 'אולי' ב-12 שעות:");
    sheet
      .getRange("J2")
      .setFormula(
        `=COUNTIFS('${SHEET_NAME}'!D:D, "אולי", '${SHEET_NAME}'!A:A, ">="&NOW()-TIME(12,0,0))`
      );

    sheet.getRange("I3").setValue("דיווחי 'לא מגיע' ב-12 שעות:");
    sheet
      .getRange("J3")
      .setFormula(
        `=COUNTIFS('${SHEET_NAME}'!D:D, "לא מגיע", '${SHEET_NAME}'!A:A, ">="&NOW()-TIME(12,0,0))`
      );

    sheet.getRange("I4").setValue('סה"כ דיווחים ב-12 שעות:');
    sheet
      .getRange("J4")
      .setFormula(
        `=COUNTIFS('${SHEET_NAME}'!D:D, {"אולי","לא מגיע"}, '${SHEET_NAME}'!A:A, ">="&NOW()-TIME(12,0,0))`
      );

    sheet.getRange("I5").setValue("אחוז 'אולי' מכל הדיווחים:");
    sheet.getRange("J5").setFormula(`=IF(J4>0, J2/J4, 0)`);
    sheet.getRange("J5").setNumberFormat("0.00%");

    sheet.getRange("I6").setValue("דיווחים בשעה האחרונה:");
    sheet
      .getRange("J6")
      .setFormula(
        `=COUNTIFS('${SHEET_NAME}'!D:D, {"אולי","לא מגיע"}, '${SHEET_NAME}'!A:A, ">="&NOW()-TIME(1,0,0))`
      );

    // עיצוב
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#4285f4");
    headerRange.setFontColor("white");
    headerRange.setFontWeight("bold");

    // עיצוב עמודת סטטוס
    const statusColumn = sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1);
    const conditionalFormatRules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("אולי")
        .setBackground("#ff9800")
        .setRanges([statusColumn])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("לא מגיע")
        .setBackground("#f44336")
        .setRanges([statusColumn])
        .build(),
    ];
    sheet.setConditionalFormatRules(conditionalFormatRules);

    // עיצוב עמודת שעות
    const hoursColumn = sheet.getRange(2, 7, sheet.getMaxRows() - 1, 1);
    hoursColumn.setNumberFormat("0.0");

    // התאם רוחב עמודות
    sheet.autoResizeColumns(1, headers.length);

    // עיצוב סטטיסטיקות
    const statsRange = sheet.getRange("I1:J6");
    statsRange.setBackground("#f5f5f5");
    statsRange.setBorder(true, true, true, true, true, true);
    sheet.getRange("I1").setFontWeight("bold");

    return {
      success: true,
      message: "גיליון 'דיווחים מתקדמים' נוצר בהצלחה!",
      sheetName: "דיווחים מתקדמים",
    };
  } catch (error) {
    return {
      success: false,
      message: "שגיאה ביצירת הגיליון המתקדם: " + error.toString(),
    };
  }
}

// פונקציה שניתן לקרוא לה ישירות מ-Google Apps Script Editor
function createAdvancedSheet() {
  const result = createAdvancedReportsSheet();
  Logger.log("Advanced Sheet Result: " + JSON.stringify(result));
  return result;
}

// פונקציה ליצירת שני הגיליונות בבת אחת
function createAllReportSheets() {
  try {
    const result1 = createRecentReportsSheet();
    const result2 = createAdvancedReportsSheet();

    Logger.log("Basic Sheet Result: " + JSON.stringify(result1));
    Logger.log("Advanced Sheet Result: " + JSON.stringify(result2));

    return {
      success: result1.success && result2.success,
      basicSheet: result1,
      advancedSheet: result2,
      message: "ניסיון ליצירת שני הגיליונות הושלם",
    };
  } catch (error) {
    return {
      success: false,
      message: "שגיאה ביצירת הגיליונות: " + error.toString(),
    };
  }
}

function handleVisitTracking(e) {
  try {
    const name = decodeURIComponent(e.parameter.name || "");
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const deviceType = e.parameter.deviceType || "unknown";
    const userAgent = e.parameter.userAgent || "";
    const referrer = e.parameter.referrer || "";
    const url = e.parameter.url || "";

    if (!name) {
      return jsonResponse({
        success: false,
        message: "Missing name parameter for visit tracking",
      });
    }

    const sheet =
      SpreadsheetApp.openById(SHEET_ID).getSheetByName(VISITS_SHEET_NAME);

    // Create Visits sheet if it doesn't exist
    if (!sheet) {
      createVisitsSheet();
    }

    const visitsSheet =
      SpreadsheetApp.openById(SHEET_ID).getSheetByName(VISITS_SHEET_NAME);

    // Check if this is a duplicate visit (same name within 24 hours)
    const existingVisit = findRecentVisit(visitsSheet, name);

    if (existingVisit) {
      // Update existing visit with new timestamp
      visitsSheet.getRange(existingVisit.row, 2).setValue(new Date(timestamp));
      visitsSheet.getRange(existingVisit.row, 6).setValue(deviceType);
      visitsSheet.getRange(existingVisit.row, 7).setValue(userAgent);
      visitsSheet.getRange(existingVisit.row, 8).setValue(referrer);
      visitsSheet.getRange(existingVisit.row, 9).setValue(url);

      return jsonResponse({
        success: true,
        message: "Visit updated",
        action: "update",
      });
    } else {
      // Add new visit
      const visitData = [
        new Date(timestamp), // Timestamp
        name, // Guest Name
        deviceType, // Device Type
        userAgent, // User Agent
        referrer, // Referrer
        url, // URL
        new Date(), // Created At
      ];

      visitsSheet.appendRow(visitData);

      return jsonResponse({
        success: true,
        message: "Visit tracked",
        action: "add",
      });
    }
  } catch (err) {
    return jsonResponse({
      success: false,
      message: "Visit tracking error: " + err,
    });
  }
}

function createVisitsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.insertSheet(VISITS_SHEET_NAME);

  // Set up headers
  const headers = [
    "Timestamp",
    "Guest Name",
    "Device Type",
    "User Agent",
    "Referrer",
    "URL",
    "Created At",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers
  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#f3f4f6")
    .setBorder(true, true, true, true, true, true);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

function findRecentVisit(sheet, guestName) {
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  for (let i = 1; i < data.length; i++) {
    const rowName = data[i][1]; // Guest Name column
    const rowTimestamp = data[i][0]; // Timestamp column

    if (rowName === guestName && rowTimestamp >= twentyFourHoursAgo) {
      return { row: i + 1, timestamp: rowTimestamp };
    }
  }

  return null;
}

function onEdit(e) {
  const SHEET_NAME = "RSVP Responses";
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
