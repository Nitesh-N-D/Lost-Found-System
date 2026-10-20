const test = require("node:test");
const assert = require("node:assert/strict");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const User = require("../models/User");
const matchingService = require("./matchingService");

const lost = {
  _id: "lost-1",
  reportedBy: "user-a",
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
  reportedBy: "user-b",
  type: "found",
  status: "open",
  title: "Black wallet found",
  description: "Found a small leather wallet near the library",
  category: "Wallet",
  location: "Central Library",
  date: "2026-10-12T00:00:00.000Z",
};

const queryFor = (items) => ({
  sort() { return this; },
  limit() { return Promise.resolve(items); },
});

const mockUserPreferences = (t, overrides = {}) => {
  const originalFind = User.find;
  User.find = () => ({
    select: () => Promise.resolve(["user-a", "user-b"].map((id) => ({
      _id: id,
      notificationPreferences: { inAppMatches: overrides[id] !== false },
    }))),
  });
  t.after(() => { User.find = originalFind; });
};

test("notifies both reporters for a qualifying opposite-type match", async (t) => {
  mockUserPreferences(t);
  const originalFind = Item.find;
  const originalBulkWrite = Notification.bulkWrite;
  let capturedFilter;
  let capturedOperations;
  Item.find = (filter) => {
    capturedFilter = filter;
    return queryFor([found]);
  };
  Notification.bulkWrite = async (operations, options) => {
    capturedOperations = operations;
    assert.deepEqual(options, { ordered: false });
    return { upsertedCount: operations.length };
  };
  t.after(() => {
    Item.find = originalFind;
    Notification.bulkWrite = originalBulkWrite;
  });

  await matchingService.notifyPotentialMatches(lost);

  assert.equal(capturedFilter.type, "found");
  assert.equal(capturedFilter.status, "open");
  assert.deepEqual(capturedFilter.reportedBy, { $ne: "user-a" });
  assert.equal(capturedOperations.length, 2);

  const [forLostReporter, forFoundReporter] = capturedOperations.map((entry) => entry.updateOne);
  assert.equal(forLostReporter.filter.user, "user-a");
  assert.equal(forLostReporter.filter.item, "lost-1");
  assert.equal(forLostReporter.filter.matchedItem, "found-1");
  assert.equal(forLostReporter.update.$setOnInsert.type, "potential_match");
  assert.ok(forLostReporter.update.$setOnInsert.matchScore >= matchingService.MIN_MATCH_SCORE);
  assert.equal(forFoundReporter.filter.user, "user-b");
  assert.equal(forFoundReporter.filter.item, "found-1");
  assert.equal(forFoundReporter.filter.matchedItem, "lost-1");
});

test("does not write notifications for weak matches", async (t) => {
  mockUserPreferences(t);
  const originalFind = Item.find;
  const originalBulkWrite = Notification.bulkWrite;
  Item.find = () => queryFor([{
    ...found,
    title: "Blue umbrella",
    description: "A small umbrella left in a parking lot",
    category: "Umbrella",
    location: "North parking lot",
    date: "2025-01-01T00:00:00.000Z",
  }]);
  Notification.bulkWrite = async () => {
    assert.fail("weak matches must not create notifications");
  };
  t.after(() => {
    Item.find = originalFind;
    Notification.bulkWrite = originalBulkWrite;
  });

  await matchingService.notifyPotentialMatches(lost);
});

test("uses idempotent upserts so repeated matching does not create duplicate alerts", async (t) => {
  mockUserPreferences(t);
  const originalFind = Item.find;
  const originalBulkWrite = Notification.bulkWrite;
  let operations;
  Item.find = () => queryFor([found]);
  Notification.bulkWrite = async (writes) => {
    operations = writes;
    return {};
  };
  t.after(() => {
    Item.find = originalFind;
    Notification.bulkWrite = originalBulkWrite;
  });

  await matchingService.notifyPotentialMatches(lost);
  await matchingService.notifyPotentialMatches(lost);

  assert.equal(operations.length, 2);
  for (const { updateOne } of operations) {
    assert.equal(updateOne.upsert, true);
    assert.ok(updateOne.update.$setOnInsert);
    assert.equal(updateOne.filter.type, "potential_match");
  }
});

test("respects per-user opt-out while notifying the other reporter", async (t) => {
  mockUserPreferences(t, { "user-a": false });
  const originalFind = Item.find;
  const originalBulkWrite = Notification.bulkWrite;
  let operations = [];
  Item.find = () => queryFor([found]);
  Notification.bulkWrite = async (writes) => { operations = writes; return {}; };
  t.after(() => {
    Item.find = originalFind;
    Notification.bulkWrite = originalBulkWrite;
  });

  await matchingService.notifyPotentialMatches(lost);

  assert.equal(operations.length, 1);
  assert.equal(operations[0].updateOne.filter.user, "user-b");
});
