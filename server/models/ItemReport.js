const mongoose = require("mongoose");

const itemReportSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "incorrect_information",
        "possible_scam",
        "inappropriate_content",
        "duplicate_listing",
        "other",
      ],
      required: true,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "reviewed", "dismissed"],
      default: "open",
    },
  },
  { timestamps: true }
);

// A user may have only one active report for the same listing at a time.
itemReportSchema.index(
  { item: 1, reportedBy: 1 },
  { unique: true, partialFilterExpression: { status: "open" } }
);
itemReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("ItemReport", itemReportSchema);
