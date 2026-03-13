const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "niteshndmaster@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const resolveRoleFromEmail = (email) =>
  getAdminEmails().includes(email.toLowerCase()) ? "admin" : "user";

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  bio: user.bio,
  isBanned: user.isBanned,
  token: generateToken(user._id),
});

const registerUser = async ({ name, email, password, phone }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    role: resolveRoleFromEmail(normalizedEmail),
  });

  return buildAuthPayload(user);
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || user.isBanned) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const expectedRole = resolveRoleFromEmail(normalizedEmail);
  if (user.role !== expectedRole) {
    user.role = expectedRole;
    await user.save();
  }

  return buildAuthPayload(user);
};

const updateProfile = async (userId, payload) => {
  const user = await User.findByIdAndUpdate(
    userId,
    payload,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    bio: user.bio,
    isBanned: user.isBanned,
  };
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
};
