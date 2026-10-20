const csvCell = (value) => {
  const text = value == null ? "" : value instanceof Date ? value.toISOString() : String(value);
  return '"' + text.replace(/"/g, '""') + '"';
};

const toCsv = (headers, rows) =>
  [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";

module.exports = { toCsv };
