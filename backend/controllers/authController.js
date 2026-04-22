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

module.exports = { signup, login };