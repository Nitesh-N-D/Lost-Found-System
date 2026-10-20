const mongoose = require("mongoose");

const recoveryHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["not_started", "handoff_arranged", "recovered", "disputed"], required: true },
    note: { type: String, trim: true, maxlength: 500, default: "" },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const claimSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    claimant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: [true, "Claim message is required"], trim: true, minlength: 10, maxlength: 500 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    issueReported: { type: Boolean, default: false },
    recoveryStatus: {
      type: String,
      enum: ["not_started", "handoff_arranged", "recovered", "disputed"],
      default: "not_started",
    },
    recoveryNote: { type: String, trim: true, maxlength: 500, default: "" },
    recoveredAt: { type: Date, default: null },
    recoveryHistory: { type: [recoveryHistorySchema], default: [] },
  },
  { timestamps: true }
);

claimSchema.index({ item: 1, claimant: 1 }, { unique: true });

module.exports = mongoose.model("Claim", claimSchema);
