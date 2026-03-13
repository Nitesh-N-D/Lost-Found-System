const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "niteshndmaster@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user || req.user.isBanned) {
        return next(new AppError("Not authorized", 401));
      }

      if (getAdminEmails().includes(req.user.email.toLowerCase())) {
        req.user.role = "admin";
      }

      next();
    } catch (error) {
      return next(new AppError("Token expired or invalid", 401));
    }
  }

  if (!token) {
    return next(new AppError("No token provided", 401));
  }
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
