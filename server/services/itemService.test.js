const test = require("node:test");
const assert = require("node:assert/strict");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const Chat = require("../models/Chat");
const MatchFeedback = require("../models/MatchFeedback");
const Notification = require("../models/Notification");
const itemService = require("./itemService");

test("deleting an item removes dependent claims, chats, feedback, and notifications", async (t) => {
  const id = "651234567890abcdef123456";
  const ownerId = "651234567890abcdef123457";
  const item = {
    _id: id,
    reportedBy: { toString: () => ownerId },
    imagePublicId: "",
    deleteOne: async () => { item.deleted = true; },
  };
  const originals = {
    findById: Item.findById,
    claims: Claim.deleteMany,
    chats: Chat.deleteMany,
    feedback: MatchFeedback.deleteMany,
    notifications: Notification.deleteMany,
  };
  const calls = {};
  Item.findById = async () => item;
  Claim.deleteMany = async (filter) => { calls.claims = filter; };
  Chat.deleteMany = async (filter) => { calls.chats = filter; };
  MatchFeedback.deleteMany = async (filter) => { calls.feedback = filter; };
  Notification.deleteMany = async (filter) => { calls.notifications = filter; };
  t.after(() => {
    Item.findById = originals.findById;
    Claim.deleteMany = originals.claims;
    Chat.deleteMany = originals.chats;
    MatchFeedback.deleteMany = originals.feedback;
    Notification.deleteMany = originals.notifications;
  });

  await itemService.deleteItem(id, { _id: ownerId, role: "user" });

  assert.deepEqual(calls.claims, { item: id });
  assert.deepEqual(calls.chats, { item: id });
  assert.deepEqual(calls.feedback, { $or: [{ item: id }, { matchedItem: id }] });
  assert.deepEqual(calls.notifications, { $or: [{ item: id }, { matchedItem: id }] });
  assert.equal(item.deleted, true);
});

test("rejects item deletion by a non-owner", async (t) => {
  const originalFindById = Item.findById;
  Item.findById = async () => ({ _id: "651234567890abcdef123456", reportedBy: { toString: () => "651234567890abcdef123457" } });
  t.after(() => { Item.findById = originalFindById; });

  await assert.rejects(
    itemService.deleteItem("651234567890abcdef123456", { _id: "651234567890abcdef123458", role: "user" }),
    { message: "Not authorized to delete this item", statusCode: 403 }
  );
});
