const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();
const {
  createItem,
  getItems,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");
const {
  createItemValidator,
  updateItemValidator,
  itemIdValidator,
  itemQueryValidator,
} = require("../validators/itemValidators");

router.post(
  "/",
  protect,
  upload.single("image"),
  createItemValidator,
  validateRequest,
  createItem
);
router.get("/me", protect, getMyItems);
router.get("/mine", protect, getMyItems);
router.get("/", itemQueryValidator, validateRequest, getItems);
router.get("/:id", itemIdValidator, validateRequest, getItemById);
router.put(
  "/:id",
  protect,
  updateItemValidator,
  validateRequest,
  updateItem
);
router.delete(
  "/:id",
  protect,
  itemIdValidator,
  validateRequest,
  deleteItem
);

module.exports = router;
