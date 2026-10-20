const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["potential_match"], required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    matchedItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    matchScore: { type: Number, min: 0, max: 100, default: 0 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index(
  { user: 1, item: 1, matchedItem: 1, type: 1 },
  { unique: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
