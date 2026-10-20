const mongoose = require("mongoose");
const MatchFeedback = require("../models/MatchFeedback");
const matchingService = require("./matchingService");
const AppError = require("../utils/AppError");

const saveMatchFeedback = async (itemId, matchedItemId, user, payload) => {
  if (!mongoose.isValidObjectId(itemId) || !mongoose.isValidObjectId(matchedItemId)) {
    throw new AppError("Invalid item ID", 400);
  }
  if (String(itemId) === String(matchedItemId)) {
    throw new AppError("An item cannot be matched to itself", 400);
  }

  const matches = await matchingService.getMatchesForItem(itemId, user, 5);
  const isSuggestedMatch = matches.some((match) => String(match.item?._id || match.item) === String(matchedItemId));
  if (!isSuggestedMatch) {
    throw new AppError("Feedback is only available for a suggested match", 400);
  }

  return MatchFeedback.findOneAndUpdate(
    { user: user._id, item: itemId, matchedItem: matchedItemId },
    { $set: { feedback: payload.feedback, note: payload.note || "" } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
};

module.exports = { saveMatchFeedback };
