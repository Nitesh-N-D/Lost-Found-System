const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const protect = async (req, res, next) => {
  let token;

  const authorization = req.headers.authorization || "";
  const bearerMatch = authorization.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch) {
    return next(new AppError("No token provided", 401));
  }

  token = bearerMatch[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(new AppError("Token expired or invalid", 401));
  }

  req.user = await User.findById(decoded.id).select("-password");
  if (!req.user || req.user.isBanned) {
    return next(new AppError("Not authorized", 401));
  }

  if (getAdminEmails().includes(req.user.email.toLowerCase())) {
    req.user.role = "admin";
  }

  return next();
};

const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};
