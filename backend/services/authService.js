const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const signup = async (name, email, password) => {
  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.status = 400;
    throw error;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn(`Signup failed - user already exists: ${email}`);
    const error = new Error("User already exists");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  logger.info(`User created: ${user.email}`);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const login = async (email, password) => {

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    throw error;
  }
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Login failed - user not found: ${email}`);
    const error = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn(`Login failed - wrong password: ${email}`);
    const error = new Error("Invalid email or password");
    error.status = 400;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  logger.info(`User logged in: ${user.email}`);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = { signup, login };