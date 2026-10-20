const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const itemService = require("../services/itemService");
const matchingService = require("../services/matchingService");
const MatchFeedback = require("../models/MatchFeedback");

exports.createItem = asyncHandler(async (req, res) => {
  const item = await itemService.createItem(req.body, req.user._id, req.file);
  sendResponse(res, 201, "Item created successfully", item);
});

exports.getItems = asyncHandler(async (req, res) => {
  const result = await itemService.getItems(req.query);
  sendResponse(res, 200, "Items fetched successfully", result);
});

exports.getItemMatches = asyncHandler(async (req, res) => {
  const matches = await matchingService.getMatchesForItem(req.params.id, req.user);
  const matchedIds = matches.map((match) => match.item._id);
  const feedback = matchedIds.length
    ? await MatchFeedback.find({
        user: req.user._id,
        item: req.params.id,
        matchedItem: { $in: matchedIds },
      }).select("matchedItem feedback")
    : [];
  const feedbackByItem = new Map(feedback.map((entry) => [String(entry.matchedItem), entry.feedback]));
  const enrichedMatches = matches.map((match) => ({
    ...match,
    feedback: feedbackByItem.get(String(match.item._id)) || null,
  }));
  sendResponse(res, 200, "Potential matches fetched successfully", enrichedMatches);
});

exports.getMyItems = asyncHandler(async (req, res) => {
  const items = await itemService.getMyItems(req.user._id);
  sendResponse(res, 200, "Your items fetched successfully", items);
});

exports.getItemById = asyncHandler(async (req, res) => {
  const result = await itemService.getItemById(req.params.id);
  sendResponse(res, 200, "Item fetched successfully", result);
});

exports.updateItem = asyncHandler(async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body, req.user);
  sendResponse(res, 200, "Item updated successfully", item);
});

exports.deleteItem = asyncHandler(async (req, res) => {
  await itemService.deleteItem(req.params.id, req.user);
  sendResponse(res, 200, "Item deleted successfully");
});


exports.getSavedItems = asyncHandler(async (req, res) => {
  const User = require("../models/User");
  const user = await User.findById(req.user._id).populate({
    path: "savedItems",
    populate: { path: "reportedBy", select: "name" },
  });
  const items = (user?.savedItems || []).filter(Boolean);
  sendResponse(res, 200, "Saved items fetched successfully", items);
});

exports.toggleSavedItem = asyncHandler(async (req, res) => {
  const mongoose = require("mongoose");
  const Item = require("../models/Item");
  const User = require("../models/User");
  const AppError = require("../utils/AppError");
  const itemId = req.params.id;

  if (!mongoose.isValidObjectId(itemId)) {
    throw new AppError("Invalid item id", 400);
  }

  const item = await Item.findById(itemId);
  if (!item) throw new AppError("Item not found", 404);

  const user = await User.findById(req.user._id);
  const alreadySaved = user.savedItems.some((savedId) => String(savedId) === String(itemId));
  if (alreadySaved) {
    user.savedItems.pull(itemId);
  } else {
    user.savedItems.addToSet(itemId);
  }
  await user.save();

  sendResponse(res, 200, alreadySaved ? "Item removed from saved listings" : "Item saved successfully", {
    itemId,
    saved: !alreadySaved,
  });
});
