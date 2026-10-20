const test = require("node:test");
const assert = require("node:assert/strict");
const { toCsv } = require("./csv");

test("quotes CSV values and escapes embedded quotes, commas, and line breaks", () => {
  const csv = toCsv(["title", "location"], [["Wallet, black", 'Near "North Hall"\nDoor']]);
  assert.equal(csv, '"title","location"\r\n"Wallet, black","Near ""North Hall""\nDoor"\r\n');
});

test("serializes null values as empty cells", () => {
  assert.equal(toCsv(["title"], [[null]]), '"title"\r\n""\r\n');
});

test("neutralizes spreadsheet formula prefixes in user-controlled cells", () => {
  const csv = toCsv(["title"], [["=HYPERLINK(\"https://example.com\")"], ["+cmd"], ["-cmd"], ["@SUM(A1:A2)"]]);
  assert.equal(csv, '"title"\r\n"\'=HYPERLINK(""https://example.com"")"\r\n"\'+cmd"\r\n"\'-cmd"\r\n"\'@SUM(A1:A2)"\r\n');
});
