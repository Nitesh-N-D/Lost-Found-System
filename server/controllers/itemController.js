const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const itemService = require("../services/itemService");

exports.createItem = asyncHandler(async (req, res) => {
  const item = await itemService.createItem(req.body, req.user._id, req.file);
  sendResponse(res, 201, "Item created successfully", item);
});

exports.getItems = asyncHandler(async (req, res) => {
  const result = await itemService.getItems(req.query);
  sendResponse(res, 200, "Items fetched successfully", result);
});

exports.getMyItems = asyncHandler(async (req, res) => {
  const items = await itemService.getMyItems(req.user._id);
  sendResponse(res, 200, "Your items fetched successfully", items);
});

exports.getItemById = asyncHandler(async (req, res) => {
  const result = await itemService.getItemById(req.params.id);
  sendResponse(res, 200, "Item fetched successfully", result);
});

exports.updateItem = asyncHandler(async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body, req.user);
  sendResponse(res, 200, "Item updated successfully", item);
});

exports.deleteItem = asyncHandler(async (req, res) => {
  await itemService.deleteItem(req.params.id, req.user);
  sendResponse(res, 200, "Item deleted successfully");
});
