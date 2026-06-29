/**
 * AI Workshop — Google Apps Script · Registration Capture
 * ─────────────────────────────────────────────────────────────
 * SETUP (do this once):
 *  1. sheets.google.com → New spreadsheet → name it "AI Workshop Registrations"
 *  2. Extensions → Apps Script → delete default code → paste this file → Save
 *  3. Deploy → New deployment → Web App → Execute as: Me → Who has access: Anyone
 *  4. Copy the Web App URL → add as GOOGLE_SHEET_URL in GitHub secrets
 * ─────────────────────────────────────────────────────────────
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data  = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp  || new Date().toLocaleString('en-IN'),
    data.name       || '',
    data.email      || '',
    data.phone      || '',
    data.plan       || '',
    data.batch      || '',
    data.amount     || '',
    data.payment_id || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
