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
