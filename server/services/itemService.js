const Item = require("../models/Item");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");

const uploadItemImage = async (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "lostfound_items" },
      (error, result) => {
        if (error) {
          reject(error);
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

  return Item.create({
    ...payload,
    imageUrl,
    imagePublicId,
    reportedBy: userId,
  });
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
    filters.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }
  if (type) filters.type = type;
  if (category) filters.category = { $regex: category, $options: "i" };
  if (location) filters.location = { $regex: location, $options: "i" };
  if (status) filters.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Item.find(filters)
      .populate("reportedBy", "name email phone bio")
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
    "name email phone bio"
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

  const isOwner = item.reportedBy.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Not authorized to update this item", 403);
  }

  return Item.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("reportedBy", "name email phone bio");
};

const deleteItem = async (id, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid item ID", 400);
  }

  const item = await Item.findById(id);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  const isOwner = item.reportedBy.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Not authorized to delete this item", 403);
  }

  if (item.imagePublicId) {
    await cloudinary.uploader.destroy(item.imagePublicId);
  }

  await item.deleteOne();
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems: async (userId) =>
    Item.find({ reportedBy: userId })
      .populate("reportedBy", "name email phone bio")
      .sort({ createdAt: -1 }),
};
