const csvCell = (value) => {
  let text = value == null ? "" : value instanceof Date ? value.toISOString() : String(value);
  // Prevent spreadsheet formula execution when user-controlled text is opened in Excel/Sheets.
  if (/^[\s\u0000-\u001f]*[=+@]/.test(text) || /^[\s\u0000-\u001f]*-/.test(text)) {
    text = "'" + text;
  }
  return '"' + text.replace(/"/g, '""') + '"';
};

const toCsv = (headers, rows) =>
  [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";

module.exports = { toCsv };
