const Item = require("../models/Item");

// @desc Create new item
// @route POST /api/items
// @access Private
const cloudinary = require("../config/cloudinary");

// @desc Create new item with image
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date } = req.body;

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "lostfound_items" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: error.message });
          }
        }
      );
    }

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lostfound_items" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date,
      imageUrl,
      imagePublicId,
      reportedBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all items with search + filter + pagination
// @route GET /api/items
// @access Public
exports.getItems = async (req, res) => {
  try {
    const { keyword, type, category, location, status, page = 1, limit = 5 } =
      req.query;

    let query = {};

    // Search by title
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    // Filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (location) query.location = location;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const items = await Item.find(query)
      .populate("reportedBy", "name email")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single item
// @route GET /api/items/:id
// @access Public
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "reportedBy",
      "name email"
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update item
// @route PUT /api/items/:id
// @access Private (Owner only)
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete item
// @route DELETE /api/items/:id
// @access Private (Owner only)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
if (item.imagePublicId) {
  await cloudinary.uploader.destroy(item.imagePublicId);
}

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
