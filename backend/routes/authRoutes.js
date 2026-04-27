const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected
router.get("/me", authMiddleware, authController.getMe);
router.put("/me", authMiddleware, authController.updateMe);
router.put("/me/password", authMiddleware, authController.changePassword);
router.delete("/me", authMiddleware, authController.deleteMe);

module.exports = router;