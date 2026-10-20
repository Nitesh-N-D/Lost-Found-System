const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");

exports.listNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 50);
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id })
      .populate("matchedItem", "title type status imageUrl location")
      .populate("item", "title type status")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Notification.countDocuments({ user: req.user._id, readAt: null }),
  ]);
  sendResponse(res, 200, "Notifications fetched successfully", {
    notifications,
    unreadCount,
    page,
    limit,
  });
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new AppError("Invalid notification ID", 400);
  }
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, readAt: null },
    { $set: { readAt: new Date() } },
    { new: true }
  );
  if (!notification) {
    const existing = await Notification.exists({ _id: req.params.id, user: req.user._id });
    if (!existing) throw new AppError("Notification not found", 404);
    return sendResponse(res, 200, "Notification already read", existing);
  }
  sendResponse(res, 200, "Notification marked as read", notification);
});

exports.markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { user: req.user._id, readAt: null },
    { $set: { readAt: new Date() } }
  );
  sendResponse(res, 200, "All notifications marked as read", { updated: result.modifiedCount });
});
