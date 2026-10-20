const AppError = require("./AppError");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildItemFilters = (query) => {
  const { keyword, type, category, location, status, dateFrom, dateTo } = query;
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

  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    throw new AppError("Start date must be on or before end date.", 400);
  }
  const dateRange = {};
  if (dateFrom) dateRange.$gte = new Date(dateFrom);
  if (dateTo) {
    const endDate = new Date(dateTo);
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateTo))) endDate.setUTCHours(23, 59, 59, 999);
    dateRange.$lte = endDate;
  }
  if (Object.keys(dateRange).length) filters.date = dateRange;

  return filters;
};

module.exports = { buildItemFilters };
