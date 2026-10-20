const mongoose = require("mongoose");

const matchFeedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    matchedItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    feedback: { type: String, enum: ["helpful", "not_helpful"], required: true },
    note: { type: String, trim: true, maxlength: 250, default: "" },
  },
  { timestamps: true }
);

matchFeedbackSchema.index({ user: 1, item: 1, matchedItem: 1 }, { unique: true });
matchFeedbackSchema.index({ feedback: 1, createdAt: -1 });

module.exports = mongoose.model("MatchFeedback", matchFeedbackSchema);
