const test = require("node:test");
const assert = require("node:assert/strict");
const MatchFeedback = require("../models/MatchFeedback");
const matchingService = require("./matchingService");
const feedbackService = require("./matchFeedbackService");

const itemId = "651234567890abcdef123456";
const matchedItemId = "651234567890abcdef123457";
const user = { _id: "651234567890abcdef123458", role: "user" };

test("persists feedback only for a suggested match and scopes it to the reporter", async (t) => {
  const originalGetMatches = matchingService.getMatchesForItem;
  const originalFindOneAndUpdate = MatchFeedback.findOneAndUpdate;
  let query;
  let update;
  let options;
  matchingService.getMatchesForItem = async (id, currentUser, limit) => {
    assert.equal(id, itemId);
    assert.equal(currentUser, user);
    assert.equal(limit, 5);
    return [{ item: { _id: matchedItemId }, score: 85 }];
  };
  MatchFeedback.findOneAndUpdate = async (filter, changes, settings) => {
    query = filter;
    update = changes;
    options = settings;
    return { _id: "feedback-1", feedback: changes.$set.feedback };
  };
  t.after(() => {
    matchingService.getMatchesForItem = originalGetMatches;
    MatchFeedback.findOneAndUpdate = originalFindOneAndUpdate;
  });

  const result = await feedbackService.saveMatchFeedback(itemId, matchedItemId, user, {
    feedback: "helpful",
    note: "Same distinctive color and location",
  });

  assert.equal(query.user, user._id);
  assert.equal(query.item, itemId);
  assert.equal(query.matchedItem, matchedItemId);
  assert.equal(update.$set.feedback, "helpful");
  assert.equal(update.$set.note, "Same distinctive color and location");
  assert.equal(options.upsert, true);
  assert.equal(options.runValidators, true);
  assert.equal(result.feedback, "helpful");
});

test("rejects feedback for an item that is not a suggested match", async (t) => {
  const originalGetMatches = matchingService.getMatchesForItem;
  matchingService.getMatchesForItem = async () => [];
  t.after(() => { matchingService.getMatchesForItem = originalGetMatches; });

  await assert.rejects(
    feedbackService.saveMatchFeedback(itemId, matchedItemId, user, { feedback: "helpful" }),
    { message: "Feedback is only available for a suggested match", statusCode: 400 }
  );
});

test("rejects malformed item IDs before querying matches", async () => {
  await assert.rejects(
    feedbackService.saveMatchFeedback("bad-id", matchedItemId, user, { feedback: "helpful" }),
    { message: "Invalid item ID", statusCode: 400 }
  );
});
