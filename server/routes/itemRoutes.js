const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();
const {
  createItem,
  getItems,
  getItemMatches,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
  getSavedItems,
  toggleSavedItem,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");
const { submitMatchFeedback } = require("../controllers/matchFeedbackController");
const { matchFeedbackValidator } = require("../validators/matchFeedbackValidators");
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
router.get("/saved", protect, getSavedItems);
router.post("/:id/matches/:matchedItemId/feedback", protect, matchFeedbackValidator, validateRequest, submitMatchFeedback);
router.get("/:id/matches", protect, itemIdValidator, validateRequest, getItemMatches);
router.put("/:id/save", protect, toggleSavedItem);
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
