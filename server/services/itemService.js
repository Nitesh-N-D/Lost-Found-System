const mongoose = require("mongoose");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const Chat = require("../models/Chat");
const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const uploadItemImage = async (fileBuffer) =>
  new Promise((resolve, reject) => {
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      reject(new AppError("Image uploads are not configured on this server.", 503));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "lostfound_items" },
      (error, result) => {
        if (error) {
          reject(new AppError("Image upload failed. Please try again.", 502));
          return;
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });

const createItem = async (payload, userId, file) => {
  let imageUrl = "";
  let imagePublicId = "";

  if (file) {
    const result = await uploadItemImage(file.buffer);
    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const allowedFields = ["title", "description", "category", "type", "location", "date"];
  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedFields.includes(key))
  );

  try {
    return await Item.create({
      ...safePayload,
      imageUrl,
      imagePublicId,
      reportedBy: userId,
    });
  } catch (error) {
    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (cleanupError) {
        console.error("Unable to clean up an unlinked item image:", cleanupError.message);
      }
    }
    throw error;
  }
};

const getItems = async (query) => {
  const {
    keyword,
    type,
    category,
    location,
    status,
    page = 1,
    limit = 8,
  } = query;

  const filters = {};

  if (keyword) {
    const safeKeyword = escapeRegex(String(keyword).slice(0, 80));
    filters.$or = [
      { title: { $regex: safeKeyword, $options: "i" } },
      { description: { $regex: safeKeyword, $options: "i" } },
      { category: { $regex: safeKeyword, $options: "i" } },
    ];
  }
  if (type) filters.type = type;
  if (category) filters.category = { $regex: escapeRegex(String(category).slice(0, 50)), $options: "i" };
  if (location) filters.location = { $regex: escapeRegex(String(location).slice(0, 120)), $options: "i" };
  if (status) filters.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Item.find(filters)
      .populate("reportedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Item.countDocuments(filters),
  ]);

  return {
    items,
    meta: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const getItemById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid item ID", 400);
  }

  const item = await Item.findById(id).populate(
    "reportedBy",
    "name"
  );

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  const similarItems = await Item.find({
    _id: { $ne: item._id },
    category: item.category,
    status: "open",
  })
    .populate("reportedBy", "name")
    .sort({ createdAt: -1 })
    .limit(3);

  return { item, similarItems };
};

const updateItem = async (id, payload, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid item ID", 400);
  }

  const item = await Item.findById(id);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  const isOwner = Boolean(user?._id) && item.reportedBy?.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Not authorized to update this item", 403);
  }

  const allowedFields = ["title", "description", "category", "type", "location", "date", "status"];
  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedFields.includes(key))
  );

  return Item.findByIdAndUpdate(id, safePayload, {
    new: true,
    runValidators: true,
  }).populate("reportedBy", "name");
};

const deleteItem = async (id, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid item ID", 400);
  }

  const item = await Item.findById(id);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  const isOwner = Boolean(user?._id) && item.reportedBy?.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Not authorized to delete this item", 403);
  }

  await Promise.all([
    Claim.deleteMany({ item: item._id }),
    Chat.deleteMany({ item: item._id }),
  ]);
  await item.deleteOne();

  if (item.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(item.imagePublicId);
    } catch (error) {
      console.error("Unable to remove item image from Cloudinary:", error.message);
    }
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems: async (userId) =>
    Item.find({ reportedBy: userId })
      .populate("reportedBy", "name")
      .sort({ createdAt: -1 }),
};
