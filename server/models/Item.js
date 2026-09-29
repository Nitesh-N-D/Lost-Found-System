const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: [true, "Type is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: ["open", "claimed", "closed"],
      default: "open",
    },
    imageUrl: {
       type: String,
    },
    imagePublicId: {
       type: String,
    },
    gallery: [
      {
        type: String,
      },
    ],
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
