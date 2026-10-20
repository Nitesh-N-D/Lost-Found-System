const test = require("node:test");
const assert = require("node:assert/strict");
const { scoreItemMatch } = require("./matchingScore");

const lost = {
  _id: "lost-1",
  type: "lost",
  status: "open",
  title: "Black leather wallet",
  description: "Small black wallet with student card inside",
  category: "Wallet",
  location: "Central Library",
  date: "2026-10-10T00:00:00.000Z",
};
const found = {
  _id: "found-1",
  type: "found",
  status: "open",
  title: "Black wallet found",
  description: "Found a small leather wallet near the library",
  category: "Wallet",
  location: "Central Library",
  date: "2026-10-12T00:00:00.000Z",
};

test("scores an opposite-type report with matching details highly", () => {
  assert.ok(scoreItemMatch(lost, found) >= 70);
});

test("rejects same-type listings as matches", () => {
  assert.equal(scoreItemMatch(lost, { ...found, type: "lost" }), 0);
});

test("rejects closed listings", () => {
  assert.equal(scoreItemMatch(lost, { ...found, status: "closed" }), 0);
});

test("does not match an item to itself", () => {
  assert.equal(scoreItemMatch(lost, lost), 0);
});

test("uses case-insensitive normalized text", () => {
  assert.equal(scoreItemMatch(lost, { ...found, title: "BLACK WALLET FOUND", category: "wallet" }), scoreItemMatch(lost, found));
});

test("returns a low score for unrelated items", () => {
  const unrelated = { ...found, title: "Blue umbrella", description: "", category: "Umbrella", location: "North parking lot", date: "2025-01-01" };
  assert.ok(scoreItemMatch(lost, unrelated) < 30);
});
