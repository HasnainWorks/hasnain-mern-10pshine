const authService = require("../services/authService");

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.signup(name, email, password);
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ message: "Login successful", ...result });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await authService.updateMe(req.user.id, name, email);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    const result = await authService.deleteMe(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe, updateMe, changePassword, deleteMe };