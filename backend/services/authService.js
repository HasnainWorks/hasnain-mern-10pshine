const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Note = require("../models/Note");
const logger = require("../utils/logger");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async (name, email, password) => {
  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.status = 400;
    throw error;
  }
  if (name.trim().length < 2) {
    const error = new Error("Name must be at least 2 characters");
    error.status = 400;
    throw error;
  }
  if (name.length > 50) {
    const error = new Error("Name cannot exceed 50 characters");
    error.status = 400;
    throw error;
  }
  if (!EMAIL_REGEX.test(email)) {
    const error = new Error("Invalid email address");
    error.status = 400;
    throw error;
  }
  if (email.length > 100) {
    const error = new Error("Email cannot exceed 100 characters");
    error.status = 400;
    throw error;
  }
  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.status = 400;
    throw error;
  }
  if (password.length > 100) {
    const error = new Error("Password cannot exceed 100 characters");
    error.status = 400;
    throw error;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 400;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email, password: hashedPassword });
  logger.info(`User created: ${user.email}`);
  return { id: user._id, name: user.name, email: user.email };
};

const login = async (email, password) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    throw error;
  }
  if (!EMAIL_REGEX.test(email)) {
    const error = new Error("Invalid email address");
    error.status = 400;
    throw error;
  }
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  logger.info(`User logged in: ${user.email}`);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  const totalNotes = await Note.countDocuments({ user: userId, isDeleted: false });
  const trashedNotes = await Note.countDocuments({ user: userId, isDeleted: true });
  const pinnedNotes = await Note.countDocuments({ user: userId, isPinned: true, isDeleted: false });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    joinedAt: user.createdAt,
    stats: {
      totalNotes,
      trashedNotes,
      pinnedNotes,
    },
  };
};

const updateMe = async (userId, name, email) => {
  if (!name || !email) {
    const error = new Error("Name and email are required");
    error.status = 400;
    throw error;
  }
  if (name.trim().length < 2) {
    const error = new Error("Name must be at least 2 characters");
    error.status = 400;
    throw error;
  }
  if (name.length > 50) {
    const error = new Error("Name cannot exceed 50 characters");
    error.status = 400;
    throw error;
  }
  if (!EMAIL_REGEX.test(email)) {
    const error = new Error("Invalid email address");
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ email, _id: { $ne: userId } });
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name: name.trim(), email },
    { new: true }
  ).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  logger.info(`User updated: ${user.email}`);
  return { id: user._id, name: user.name, email: user.email };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    const error = new Error("Current and new password are required");
    error.status = 400;
    throw error;
  }
  if (newPassword.length < 6) {
    const error = new Error("New password must be at least 6 characters");
    error.status = 400;
    throw error;
  }
  if (newPassword.length > 100) {
    const error = new Error("New password cannot exceed 100 characters");
    error.status = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.status = 400;
    throw error;
  }

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    const error = new Error("New password must be different from current password");
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);
  return { message: "Password changed successfully" };
};

const deleteMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  await Note.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);

  logger.info(`User deleted: ${user.email}`);
  return { message: "Account deleted successfully" };
};

module.exports = { signup, login, getMe, updateMe, changePassword, deleteMe };