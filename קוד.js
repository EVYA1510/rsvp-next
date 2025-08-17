// ===== Config =====
const SHEET_ID = "1CVsub2vsHRFPGV-9Hh_nmWIi2A6_Yhq4gUDf-9-a1go";

// ===== Entry points =====
function doGet(e) {
  return handle_(e, "GET");
}
function doPost(e) {
  return handle_(e, "POST");
}

function handle_(e, method) {
  try {
    const qp = e && e.parameter ? e.parameter : {};
    let body = {};
    try {
      body =
        e && e.postData && e.postData.contents
          ? JSON.parse(e.postData.contents)
          : {};
    } catch (_) {}
    const p = Object.assign({}, qp, body);

    const action = String(p.action || "").toLowerCase() || "upsert";
    if (action === "health")
      return json_({ ok: true, message: "healthy" }, 200);

    if (action !== "upsert")
      return json_({ ok: false, message: "Unknown or missing action" }, 400);

    const name = (p.name || "").toString().trim();
    const status = (p.status || "").toString().trim();
    const reportId = p.reportId ? String(p.reportId).trim() : "";
    if (!name || !status)
      return json_({ ok: false, message: "Missing required fields" }, 400);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName("RSVP Responses");
    if (!sh)
      return json_({ ok: false, message: "Missing sheet RSVP Responses" }, 500);

    const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const idx = (h) => header.findIndex((x) => String(x).trim() === h) + 1;
    const col = {
      ts: idx("Timestamp"),
      name: idx("Name"),
      status: idx("Status"),
      id: idx("ID"),
      guests: idx("Guests"),
      blessing: idx("Blessing"),
    };
    if (!col.id) return json_({ ok: false, message: "Missing ID column" }, 500);

    // Update by reportId
    if (reportId) {
      const rng = sh.getDataRange().getValues();
      for (let r = 1; r < rng.length; r++) {
        if (String(rng[r][col.id - 1]) === reportId) {
          if (col.name) sh.getRange(r + 1, col.name).setValue(name);
          if (col.status) sh.getRange(r + 1, col.status).setValue(status);
          if (col.ts) sh.getRange(r + 1, col.ts).setValue(new Date());
          return json_({ ok: true, reportId, message: "updated" }, 200);
        }
      }
    }

    // Create new
    const newId = Utilities.getUuid();
    const row = [];
    if (col.ts) row[col.ts - 1] = new Date();
    if (col.id) row[col.id - 1] = newId;
    if (col.name) row[col.name - 1] = name;
    if (col.status) row[col.status - 1] = status;
    if (col.guests) row[col.guests - 1] = 1; // default
    if (col.blessing) row[col.blessing - 1] = "";
    sh.appendRow(row);

    return json_({ ok: true, reportId: newId, message: "created" }, 200);
  } catch (err) {
    return json_(
      { ok: false, message: (err && err.message) || "Server error" },
      500
    );
  }
}

function json_(obj, status) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  // CORS לא נחוץ כי הקריאה תהיה מ-Next (server-to-server)
  return out;
}
